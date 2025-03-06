import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BowlingGame from '../components/scoreboard/BowlingGame'
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { router } from 'expo-router';
import useBowlingStats from '../hooks/useBowlingStats';
import { BowlingStats, SeriesStats } from "@/app/src/values/types";
import { defaultSeriesStats } from "@/app/src/values/defaults";
import { updateFirebaseGameComplete, updateFirebaseLeagueWeekCount } from '../hooks/firebaseFunctions';
import { ACTIVESESSION, INPROGRESS, SESSIONS, SESSIONSTARTED } from '../src/config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
  let highGame = 0;
  let lowGame = 301;
  let sID = args.id as string;
  let lID = args.leagueID as string;
  let sName = args.name as string;
  let sType = args.type as string;

  const toggleActiveGame = (inProgress:boolean)=>{
    setActiveGame(inProgress)
    saveSession();
  }

  // Load saved game on startup
  useEffect(() => {
    loadSession();
  }, []);

  /**
   * A game has just been bowled, update firebase.
   * 
   * @param data The game data for the recently bowled game. 
   */
  const handleDataFromChild = (data: any) =>{
    if (!data || !Array.isArray(data)) {
      console.error("❌ Invalid data received from child:", data);
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
    console.error('Error loading game:', error);
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
    console.error('Error saving game:', error);
  }
}

const markSessionComplete = async () =>{
  try {
    await AsyncStorage.clear()
  } catch (error) {
    console.error('Error saving game:', error);
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
        // This needs to calculated differently. 
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
      <View className="items-center flex-1">
      
        <BowlingGame 
        sendDataToParent={handleDataFromChild}
        toggleBowling={toggleActiveGame}
        />

        {/* Button Positioned at Bottom Right */}
        <TouchableOpacity
          onPress={endSession}
          disabled = {activeGame}
          className={`absolute bottom-5 right-5 ${activeGame ? "bg-red-700":"bg-green-800"} px-4 py-2 rounded-lg`}
        >
          <Text className="text-white font-bold">End Session</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default game
