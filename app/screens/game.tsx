import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { router, useNavigation } from 'expo-router';
import useBowlingStats from '../hooks/useBowlingStats';
import { tGame, BowlingStats, SeriesStats, Session, SeriesData, Game } from "@/app/src/values/types";
import { defaultGame, defaultSeriesData, defaultSeriesStats } from "@/app/src/values/defaults";
import { setFirebaseActive, setFirebaseInActive, updateFirebaseActiveGames, updateFirebaseGameComplete, updateFirebaseLeagueWeekCount } from '../hooks/firebaseFunctions';
import { SESSIONS } from '../src/config/constants';

import icons from '@/constants/icons';
import { db, FIREBASE_AUTH } from '@/firebase.config';
import { doc, onSnapshot } from 'firebase/firestore';
import useGameStore from '../src/zustandStore/store';
import useSessionStore from '../src/zustandStore/sessionStore';
import FrameView, { GameRef } from '../components/scoreboard/FrameView';
import useGameViewStore from '../src/zustandStore/gameStore';
import Toast from 'react-native-toast-message';


const initialStats: SeriesStats = {
  ...defaultSeriesStats
};

const game = () => {
  const args = useLocalSearchParams();
  const [numGames, setNumGames] = useState(0);
  const [seriesData, setSeriesData] = useState<SeriesData>({...defaultSeriesData})
  const [firstRender, setFirstRender] = useState(true)
  const [index, setIndex] = useState(0);
  const [numViewers, setNumViewers] = useState(0)
  const [sessionEnded, setSessionEnded] = useState(false)
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [warned, setWarned] = useState(false);

  const resetGame = useGameViewStore((state) => state.resetGame)
  const setGame = useGameViewStore((state) => state.setGame)
  const resetGameNum = useGameViewStore((state) => state.resetGameNum)
  const currGame = useGameViewStore((state) => state.game)
  const gameComplete = useGameViewStore((state) => state.game.gameComplete)
  const incrementGameNum = useGameViewStore((state)=> state.incrementGameNum)

  const session = useSessionStore((state) => state.session)
  const isActive = useSessionStore((state) => state.isActive)
  const setSession = useSessionStore((state) => state.setSession)
  const clearSession = useSessionStore((state) => state.clearSession)

  const childRef = useRef<GameRef>(null);

  const navigation = useNavigation()

  // Stat tracking
  let highGame = 0;
  let lowGame = 301;

  // Session id, leagueID, session name, and session type. 
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
  const previousGame = () => {
    if (index > 0) {
      // ✅ Save current game before leaving it
      if (index == seriesData.data.length-1) {
  
        const savedGame = JSON.parse(JSON.stringify(currGame));
        const updatedEntry: Game = {
          game: savedGame,
          stats: useBowlingStats(savedGame.frames),
        };
        
        const updatedSeries = { ...seriesData };
        updatedSeries.data[index] = updatedEntry;
        
        setSeriesData(updatedSeries);
        saveSession(updatedSeries);
        
      }
  
      // 👈 Now go back safely
      const previous = JSON.parse(JSON.stringify(seriesData.data[index - 1].game));
      setGame(previous);
      childRef.current?.setGameNumber(index);
      setIndex(index - 1);
    }
  };
  

  /**
   * Start then next game
   */
  const nextGame = () => {
    setWarned(false)
    let games = seriesData.data;
  
    // ✅ Step 1: If navigating history
    if (index < games.length - 1) {
      const cloned = JSON.parse(JSON.stringify(games[index + 1].game));
      setGame(cloned);
      
      childRef.current?.setGameNumber(index + 2);
      setIndex(index + 1);
      return;
    }
  
    // ✅ Step 2: If current game is finished, SAVE it
    if (currGame.gameComplete) {
  
      // Clone finished game
      const completedGame = JSON.parse(JSON.stringify(currGame));
  
      const newGameEntry: Game = {
        game: completedGame,
        stats: useBowlingStats(completedGame.frames),
      };
  
      // ⛔ Do not call resetGame() yet!
      const updatedData = [...seriesData.data];
      updatedData[index] = newGameEntry; // 🔁 Replace current index
  
      // Now create new blank game
      const newGame = JSON.parse(JSON.stringify(defaultGame));
      newGame.gameNum = index + 2;
  
      const newGameEntryBlank: Game = {
        game: newGame,
        stats: useBowlingStats(newGame.frames),
      };
  
      updatedData.push(newGameEntryBlank);
  
      const updatedSeriesData: SeriesData = {
        ...seriesData,
        data: updatedData,
      };
  
      setSeriesData(updatedSeriesData);
      setGame(newGame);
      childRef.current?.setGameNumber(updatedData.length);
      setIndex(updatedData.length - 1);
    }
  };

  // Load saved game on startup
  useEffect(() => {
    if (isActive && session)
      loadSession();
    else
      startNewSession();

    setFirebaseActive();
  }, []);


  /**
   * A game has just been bowled, update firebase.
   * 
   * @param data The game data for the recently bowled game. 
   */
  const updateData = () =>{
    const stats = useBowlingStats(currGame.frames);

    const statsList: BowlingStats = {
      ...stats,
      pinCombinations: stats.pinCombinations,
    };

    const newGameEntry: Game = {
      game: currGame,
      stats: statsList
    };
    

    const newSeriesData: SeriesData = {
      data: [...seriesData.data.slice(0, -1), newGameEntry], // replaces last entry
      stats: initialStats // ✅ updated stats
    };

    setSeriesData(newSeriesData);
    saveSession(newSeriesData);
    return newSeriesData;
  }

/**
 * Loads the session from Zustand
 */
const loadSession = async ()=>{
  try {
    // If the game is not in progress, Nothing to load, do nothing.
    sID = session.sessionID;
    lID = session.leagueID;
    sName = session.name;
    sType = session.type;
    
    setSeriesData(session.seriesData)
    setFirstRender(true);
    setWarned(false)
    childRef.current?.setGameNumber(session.seriesData.data.length);
    lowGame = session.localLowGame;
    highGame = session.localHighGame;
  } catch (error) {
    console.error('📛 Error loading game:', error);
  }
}

/**
 * Saves the session to zustand
 */
const saveSession = async (seriesData:SeriesData) => {
  try {
    const sessionState:Session = {
      sessionID: sID,
      leagueID: lID,
      name: sName,
      type: sType,
      numGames,
      seriesData: seriesData,
      localHighGame: highGame,
      localLowGame: lowGame,
      activeGame: true
    };
    setSession(sessionState)
  } catch (error) {
    console.error('📛 Error saving game:', error);
  }
}

/**
 * Start new session. 
 */
const startNewSession = () =>{
  resetGame();
  resetGameNum();
  clearSession();
  setNumGames(1)
  setWarned(false)
  useSessionStore.persist.clearStorage();
  useGameStore.persist.clearStorage();
  
  const newGameEntry: Game = {
    game: currGame,
    stats: useBowlingStats(currGame.frames),
  };

  const newSeriesData: SeriesData = {
    data: [newGameEntry],
    stats: { ...initialStats }, // ✅ Reset stats here too
  };
  highGame = 0;
  lowGame = 301;
  setSeriesData(newSeriesData);
  saveSession(newSeriesData);
  childRef.current?.setGameNumber(1)
  
}

/**
 * Update firebase active game, and save the session. 
 */
const updateSession = async ()=>{
  setWarned(false)
  if (index < seriesData.data.length-1) return;
  if(sessionEnded)return;
  const data = updateData()
  saveSession(data)
  await updateFirebaseActiveGames(data.data)

}

/**
 * Game is complete, updatefirebase. 
 */
const sessionGameComplete = async ()=>{
  if(index < seriesData.data.length-1)return;
    const stats = useBowlingStats(currGame.frames);
    
    const statsList: BowlingStats = {
      ...stats,
      pinCombinations: stats.pinCombinations,
    };

    setNumGames(numGames + 1);

    const newGameEntry: Game = {
      game: currGame,
      stats: statsList
    };
    

    const newSeriesData: SeriesData = {
      data: [...seriesData.data.slice(0, -1), newGameEntry], // replaces last entry
      stats: initialStats // ✅ updated stats
    };

    setSeriesData(newSeriesData)

    const updatedStats = calculateSeriesStats(newSeriesData); // 🔁 Get updated stats here
   
  await updateFirebaseGameComplete(sType,sName,lID,sID,newSeriesData,updatedStats)
}

/**
 * A session is complete, update firebase and reset
 */
const endSession = ()=>{
  if(!warned){
    setWarned(true)
    Toast.show({
      type: 'customInfo',
      text1: `Heads up! You're ending the session!`,
      text2: `Press again to end your session`,
      position: 'bottom',
      bottomOffset: 100,
      visibilityTime: 4000,
    });
    return;
  }
  setSessionEnded(true)
  if(sType == SESSIONS.league){
    updateFirebaseLeagueWeekCount(lID, sName.toString())
  }
  router.push({
              pathname: "../screens/endSessionStats",
              params: {
                seriesData: JSON.stringify(calculateSeriesStats(seriesData)),
                title: sName
              }
            });
  resetGame();
  clearSession();
  useSessionStore.persist.clearStorage();
  useGameStore.persist.clearStorage();
  setFirebaseInActive()
}

/**
 * Update series stats. 
 * 
 * @param gameStats The stats from the game bowled. 
 * @param games The number of games bowled.
 */
  const calculateSeriesStats = (newSeriesData: SeriesData) =>{
    const numGames = newSeriesData.data.length;
    let seriesStats = {...initialStats};
    let count = 0;
    newSeriesData.data.forEach(game => {
      count++;
      const gameStats = game.stats
      const updatedStats: SeriesStats = {
        ...seriesStats,
        totalShots: gameStats.totalShots + seriesStats.totalShots,
        seriesScore: gameStats.finalScore + seriesStats.seriesScore,
        totalStrikes: gameStats.totalStrikes + seriesStats.totalStrikes,
        totalSpares: gameStats.totalSpares + seriesStats.totalSpares,
        spareOpportunities: gameStats.spareOpportunities + seriesStats.spareOpportunities,
        singlePinAttempts: gameStats.singlePinAttempts + seriesStats.singlePinAttempts,
        singlePinSpares: gameStats.singlePinSpares + seriesStats.singlePinSpares,
        strikePercentage: (gameStats.totalStrikes + seriesStats.totalStrikes)/(gameStats.totalShots + seriesStats.totalShots)*100,
        sparePercentage: (gameStats.totalSpares + seriesStats.totalSpares)/(gameStats.spareOpportunities + seriesStats.spareOpportunities)*100,
        singlePinSparePercentage: (gameStats.singlePinSpares + seriesStats.singlePinSpares)/(gameStats.singlePinAttempts + seriesStats.singlePinAttempts)*100,
        openFrames: gameStats.openFrames + seriesStats.openFrames,
        openFramePercentage: (gameStats.openFrames + seriesStats.openFrames)/(numGames*10),
        numberOfGames: numGames,
        threeGameSeries: numGames === 3 ? seriesStats.seriesScore + gameStats.finalScore : 0,
        average: (gameStats.finalScore + seriesStats.seriesScore)/numGames,
        highGame: Math.max(gameStats.finalScore, seriesStats.highGame),
        lowGame: Math.min(gameStats.finalScore, seriesStats.lowGame ),
        tenPins: gameStats.tenPins + seriesStats.tenPins,
        tenPinsConverted: gameStats.tenPinsConverted + seriesStats.tenPinsConverted,
        sevenPins: gameStats.sevenPins + seriesStats.sevenPins,
        sevenPinsConverted: gameStats.sevenPinsConverted + seriesStats.sevenPinsConverted,
        tenPinPercentage: (gameStats.tenPinsConverted + seriesStats.tenPinsConverted)/(gameStats.tenPins + seriesStats.tenPins)*100,
        sevenPinPercentage: (gameStats.sevenPinsConverted + seriesStats.sevenPinsConverted)/(gameStats.sevenPins + seriesStats.sevenPins)*100,
        strikeOpportunities: gameStats.strikeOpportunities + seriesStats.strikeOpportunities,
        splitsTotal: gameStats.splits + seriesStats.splitsTotal,
        splitsConverted: gameStats.splitsConverted + seriesStats.splitsConverted,
        washoutsTotal: gameStats.washouts + seriesStats.washoutsTotal,
        washoutsConverted: gameStats.washoutsConverted + seriesStats.washoutsConverted,
        splitsPercentage: (gameStats.splitsConverted + seriesStats.splitsConverted)/(gameStats.splits + seriesStats.splitsTotal)*100,
        washoutsPrecentage: (gameStats.washoutsConverted + seriesStats.washoutsConverted)/(gameStats.washouts + seriesStats.washoutsTotal)*100,
        pinCombinations: seriesStats.pinCombinations,
        highSeries: 0, // Optional: update if needed
      };

      seriesStats = updatedStats
      
    });
   
  
    return seriesStats;
  }

  return (
    <SafeAreaView className="flex-1 bg-primary h-full">
      <View className="flex-1">
        <FrameView 
          ref={childRef}
          sessionGameComplete={sessionGameComplete}
          toggleBowling={()=>{}}
          updateCurrentGame={updateSession}
          isHistory={isViewingHistory}
        />

        {/* Button Positioned at Bottom Right */}
        <TouchableOpacity
          onPress={endSession}
          disabled = {!gameComplete}
          className={`absolute bottom-9 left-1/2 -translate-x-1/2 ${!gameComplete ? "bg-red-700":"bg-green-800"} px-4 py-2 rounded-lg`}
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
