import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BowlingGame, { BowlingGameRef } from '../components/scoreboard/BowlingGame'
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { router, useNavigation } from 'expo-router';
import useBowlingStats from '../hooks/useBowlingStats';
import { tGame, BowlingStats, SeriesStats } from "@/app/src/values/types";
import { defaultSeriesStats } from "@/app/src/values/defaults";
import { setFirebaseActive, setFirebaseInActive, updateFirebaseActiveGames, updateFirebaseGameComplete, updateFirebaseLeagueWeekCount } from '../hooks/firebaseFunctions';
import { ACTIVESESSION, BOWLINGSTATE, INPROGRESS, SESSIONS, SESSIONSTARTED } from '../src/config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from '@/constants/icons';
import { db, FIREBASE_AUTH } from '@/firebase.config';
import { doc, onSnapshot } from 'firebase/firestore';


const initialStats: SeriesStats = {
  ...defaultSeriesStats
};

const game = () => {
  const args = useLocalSearchParams();
  const [numGames, setNumGames] = useState(0);
  const [gamesData, setGamesData] = useState([{}])
  const [activeGame, setActiveGame] = useState(true)
  const [firstRender, setFirstRender] = useState(true)
  const [seriesStats, setSeriesStats] = useState<SeriesStats>(initialStats)
  const [games, setGames] = useState<tGame[]>([])
  const [index, setIndex] = useState(0);
  const [numViewers, setNumViewers] = useState(0)

  const childRef = useRef<BowlingGameRef>(null);

  const navigation = useNavigation()

  let highGame = 0;
  let lowGame = 301;
  let sID = args.id as string;
  let lID = args.leagueID as string;
  let sName = args.name as string;
  let sType = args.type as string;
  sName = sName == '' ? sType.slice(0,-8) : sName;
  sName = sName.charAt(0).toUpperCase() + sName.slice(1);

  useEffect(() => {
    sName = sName == '' ? sType.slice(0,-8) : sName;
    sName = sName.charAt(0).toUpperCase() + sName.slice(1);
    navigation.setOptions({
      headerTitle: () => (
        <View className="flex-row items-center">
          <Text className="text-white text-xl font-bold">🎳 {sName}</Text>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}>
          <Image 
            source={icons.eye}
            className="w-8 h-8 mr-2" 
            style={{ tintColor: "#16E60D"}}
          />
          <Text className="text-white text-xl font-bold">{numViewers}</Text>
        </View>
      ),
    });
  }, [numViewers]); // Update header when viewer count changes

  useEffect(() => {
    const unsubscribe = getFirebaseWatching();
  
    return () => {
      unsubscribe(); 
    };
  }, []); 
  
  const getFirebaseWatching = () => {
    let currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser == null) return () => {};
  
    const docRef = doc(db, "activeUsers", currentUser.uid);
  
    // Listen for real-time changes
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const newViewerCount = data.watching || 0;
  
        // 🔹 Only update state if the viewer count has changed
        setNumViewers((prevCount) => {
          if (prevCount !== newViewerCount) {
            return newViewerCount;
          }
          return prevCount; // Prevent unnecessary re-renders
        });
      }
    });
  
    return () => unsubscribe();
  };

  /**
   * Show previous game.
   */
  const previousGame = () =>{
    if (index > 0){
      childRef.current?.setGame(games[index-1])
      setIndex(index-1)
    }
  }

  /**
   * Start then next game
   */
  const nextGame = () =>{
    // if we are in game history, pass next game
    if (index < games.length-1){
      childRef.current?.setGame(games[index+1])
      setIndex(index+1)
    }
    else if (games[games.length-1].gameComplete){
      childRef.current?.clearGame()
      setIndex(games.length)
    }
  }

  /**
   * Called when a game is over 
   * @param inProgress 
   */
  const toggleActiveGame = (inProgress:boolean)=>{
    setActiveGame(inProgress)
    saveSession();
  }

  // Load saved game on startup
  useEffect(() => {
    loadSession();
    setFirebaseActive();
  }, []);

  /**
   * Update the current game that is being streamed
   * @param game 
   */
  const updateCurrentGame = (game: tGame) =>{
    let newGames = [...games];
    newGames[game.gameNum-1] = game;
    setGames(newGames)
    updateFirebaseActiveGames(newGames)
    setIndex(game.gameNum-1)
  }

  /**
   * A game has just been bowled, update firebase.
   * 
   * @param data The game data for the recently bowled game. 
   */
  const handleDataFromChild = (data: any) =>{
    if (!data || !Array.isArray(data)) {
      console.error("📛 Invalid data received from child:", data);
      return;
    }
    
    const stats = useBowlingStats(data);
    

    const statsList: BowlingStats = {
      finalScore: stats.finalScore,
      totalStrikes: stats.totalStrikes,
      totalShots: stats.totalShots,
      totalSpares: stats.totalSpares,
      spareOpportunities: stats.spareOpportunities,
      singlePinAttempts: stats.singlePinAttempts,
      singlePinSpares: stats.singlePinSpares,
      strikePercentage: stats.strikePercentage,
      sparePercentage: stats.sparePercentage,
      singlePinSparePercentage: stats.singlePinSparePercentage,
      openFramePercentage: stats.openFramePercentage,
      openFrames: stats.openFrames,
      strikeOpportunities: stats.strikeOpportunities,
      tenPins: stats.tenPins,
      sevenPins: stats.sevenPins,
      splits:stats.splits,
      washouts: stats.washouts,
      tenPinsConverted: stats.tenPinsConverted,
      sevenPinsConverted: stats.sevenPinsConverted,
      splitsConverted: stats.splitsConverted,
      washoutsConverted: stats.washoutsConverted,
      pinCombinations: stats.pinCombinations,
    }
    addToSerriesStats(statsList, numGames+1)
    setNumGames(numGames+1)
    setGamesData([...gamesData, {game: data, stats: statsList}])
    saveSession();
  }

/**
 * Loads the session from async storage
 */
const loadSession = async ()=>{
  try {
    const inProgress = await AsyncStorage.getItem(SESSIONSTARTED);
    const savedSession = await AsyncStorage.getItem(ACTIVESESSION);

    // If the game is not in progress, Nothing to load, do nothing.
    if(inProgress && !JSON.parse(inProgress)) return;
     
    // Load the saved game. 
    if (savedSession) {
      const { sessionID,leagueID,name,type,numGames,gamesData,activeGame, seriesStats,localHighGame,localLowGame, } = JSON.parse(savedSession);
      sID = sessionID;
      lID = leagueID;
      sName = name;
      sType = type;
      setNumGames(numGames);
      setGamesData(gamesData);
      setActiveGame(activeGame);
      setFirstRender(seriesStats);
      setSeriesStats(seriesStats);
      lowGame = localLowGame;
      highGame = localHighGame;
    }
  } catch (error) {
    console.error('📛 Error loading game:', error);
  }
}

/**
 * Saves the session to async storage
 */
const saveSession = async () => {
  try {
    const sessionState = {
      sessionID: sID,
      leagueID: lID,
      name: sName,
      type: sType,
      numGames,
      gamesData,
      activeGame, 
      seriesStats,
      localHighGame: highGame,
      localLowGame: lowGame,
    };
    await AsyncStorage.setItem(ACTIVESESSION, JSON.stringify(sessionState));
  } catch (error) {
    console.error('📛 Error saving game:', error);
  }
}

/**
 * A session is complete, mark the user as inactive and clear the AsyncStorage
 */
const markSessionComplete = async () =>{
  try {
    const keysToRemove = [BOWLINGSTATE, INPROGRESS, ACTIVESESSION, SESSIONSTARTED]
    await AsyncStorage.multiRemove(keysToRemove)
    setFirebaseInActive()
  } catch (error) {
    console.error('📛 Error cleaning session from asyn or firebase error:', error);
  }
}
/**
 * Update series stats. 
 * 
 * @param gameStats The stats from the game bowled. 
 * @param games The number of games bowled.
 */
  const addToSerriesStats = (gameStats: BowlingStats, games: number) =>{
      setSeriesStats((prevStats)=>({...prevStats,
        totalShots: gameStats.totalShots + prevStats.totalShots,
        seriesScore: gameStats.finalScore + prevStats.seriesScore,
        totalStrikes: gameStats.totalStrikes + prevStats.totalStrikes,
        totalSpares: gameStats.totalSpares + prevStats.totalSpares,
        spareOpportunities: gameStats.spareOpportunities + prevStats.spareOpportunities,
        singlePinAttempts: gameStats.singlePinAttempts + prevStats.singlePinAttempts,
        singlePinSpares: gameStats.singlePinSpares + prevStats.singlePinSpares,
        strikePercentage: (gameStats.totalStrikes + prevStats.totalStrikes)/(gameStats.totalShots + prevStats.totalShots)*100,
        sparePercentage: (gameStats.totalSpares + prevStats.totalSpares)/(gameStats.spareOpportunities + prevStats.spareOpportunities)*100,
        singlePinSparePercentage: (gameStats.singlePinSpares + prevStats.singlePinSpares)/(gameStats.singlePinAttempts + prevStats.singlePinAttempts)*100,
        openFrames: (gameStats.openFrames + prevStats.openFrames),
        openFramePercentage: (gameStats.openFrames + prevStats.openFrames)/(games*10),
        numberOfGames: games,
        threeGameSeries: games == 3 ? prevStats.seriesScore + gameStats.finalScore : 0,
        average: (gameStats.finalScore + prevStats.seriesScore)/games,
        highGame: Math.max(gameStats.finalScore, prevStats.highGame),
        lowGame: Math.min(gameStats.finalScore, prevStats.lowGame ),
        tenPins: gameStats.tenPins + prevStats.tenPins,
        tenPinsConverted: gameStats.tenPinsConverted + prevStats.sevenPinsConverted,
        sevenPins: gameStats.sevenPins + prevStats.sevenPins,
        sevenPinsConverted: gameStats.sevenPinsConverted + prevStats.sevenPinsConverted,
        tenPinPercentage: (gameStats.tenPinsConverted + prevStats.tenPinsConverted)/(gameStats.tenPins + prevStats.tenPins)*100,
        sevenPinPercentage: (gameStats.sevenPinsConverted + prevStats.sevenPinsConverted)/(gameStats.sevenPins + prevStats.sevenPins)*100,
        strikeOpportunities: gameStats.strikeOpportunities + prevStats.strikeOpportunities,
        splitsTotal: gameStats.splits + prevStats.splitsTotal,
        splitsConverted: gameStats.splitsConverted + prevStats.splitsConverted,
        washoutsTotal: gameStats.washouts + prevStats.washoutsTotal,
        washoutsConverted: gameStats.washoutsConverted + prevStats.washoutsConverted,
        splitsPercentage: (gameStats.splitsConverted + prevStats.splitsConverted)/(gameStats.splits + prevStats.splitsTotal)*100,
        washoutsPrecentage: (gameStats.washoutsConverted + prevStats.washoutsConverted)/(gameStats.washouts + prevStats.washoutsTotal)*100,
        // This needs to be calculated differently. 
        pinCombinations: prevStats.pinCombinations,
      }))
  }

  /**
   * Wait for changes to the games Data and update firebase.
   */
  useEffect(()=>{
    if(firstRender){
      setFirstRender(false);
      return;
    }
    updateFirebaseGameComplete(sType, sName, lID,sID,gamesData,seriesStats)
  },[gamesData])

  /**
   * End the current session. No futher updates to firebase will be made. 
   * Redirect to create page. 
   */
  const endSession = () =>{
    if(sType == SESSIONS.league){
      updateFirebaseLeagueWeekCount(lID, sName.toString())
    }
    markSessionComplete();
    router.push("/(tabs)/create")
  }

  return (
    <SafeAreaView className="flex-1 bg-primary h-full">
      <View className="flex-1">
        <BowlingGame 
          ref={childRef}
          sendDataToParent={handleDataFromChild}
          toggleBowling={toggleActiveGame}
          updateCurrentGame={updateCurrentGame}
        />

        {/* Button Positioned at Bottom Right */}
        <TouchableOpacity
          onPress={endSession}
          disabled = {activeGame}
          className={`absolute bottom-9 left-1/2 -translate-x-1/2 ${activeGame ? "bg-red-700":"bg-green-800"} px-4 py-2 rounded-lg`}
        >
          <Text className="text-white font-bold">End Session</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={nextGame} 
          className="absolute bottom-8 right-5 mr-5 px-1 py-2 rounded-lg"
        >
          <Image source={icons.next}
            className='w-10 h-10'
            resizeMode='contain'
            style={{tintColor: "white"}}/>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={previousGame} 
          className="absolute bottom-8 left-5 mr-5 px-1 py-2 rounded-lg"
        >
          <Image source={icons.previous}
            className='w-10 h-10'
            resizeMode='contain'
            style={{tintColor: "white"}}/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default game
