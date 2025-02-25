import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BowlingGame from '../components/scoreboard/BowlingGame'
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { router } from 'expo-router';
import useBowlingStats from '../hooks/useBowlingStats';
import { GameStats, SeriesStats } from "@/app/src/constants/types";
import { defaultSeriesStats } from "@/app/src/constants/defaults";



const initialStats: SeriesStats = {
  ...defaultSeriesStats
};

const game = () => {
  const args = useLocalSearchParams();
  const id = args.id as string;
  const name = args.name as string;
  const type = args.type as string;
  const [numGames, setNumGames] = useState(0);
  const [gamesData, setGamesData] = useState([{}])
  const [activeGame, setActiveGame] = useState(true)
  const [firstRender, setFirstRender] = useState(true)
  const [seriesStats, setSeriesStats] = useState<SeriesStats>(initialStats) 
  let localHighGame = 0;
  let localLowGame = 0;

  const toggleActiveGame = (inProgress:boolean)=>{
    setActiveGame(inProgress)
  }

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

    const statsList: GameStats = {
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
    }
    addToSerriesStats(statsList, numGames+1)
    setNumGames(numGames+1)
    setGamesData([...gamesData, {game: data, stats: statsList}])
  }
  
/**
 * Update series stats. 
 * 
 * @param gameStats The stats from the game bowled. 
 * @param games The number of games bowled.
 */
  const addToSerriesStats = (gameStats: GameStats, games: number) =>{
    
      localHighGame = Math.max(localHighGame, gameStats.finalScore)
      localLowGame = Math.min(localLowGame, gameStats.finalScore)
      setSeriesStats((prevStats)=>({...prevStats,
        totalShots: gameStats.totalShots + prevStats.totalShots,
        seriesScore: gameStats.finalScore + prevStats.seriesScore,
        totalStrikes: gameStats.totalStrikes + prevStats.totalStrikes,
        totalSpares: gameStats.totalSpares + prevStats.totalSpares,
        spareOpportunities: gameStats.spareOpportunities + prevStats.spareOpportunities,
        singlePinAttempts: gameStats.singlePinAttempts + prevStats.singlePinAttempts,
        singlePinSpares: gameStats.singlePinSpares + prevStats.singlePinSpares,
        strikePercentage: (gameStats.totalStrikes + prevStats.totalStrikes)/(gameStats.totalShots + prevStats.totalShots),
        sparePercentage: (gameStats.totalSpares + prevStats.totalSpares)/(gameStats.spareOpportunities + prevStats.spareOpportunities),
        singlePinSparePercentage: (gameStats.singlePinSpares + prevStats.singlePinSpares)/(gameStats.singlePinAttempts + prevStats.singlePinAttempts),
        openFrames: (gameStats.openFrames + prevStats.openFrames),
        openFramePercentage: (gameStats.openFrames + prevStats.openFrames)/(games*10),
        numberOfGames: games,
        average: (gameStats.finalScore + prevStats.seriesScore)/games,
        highGame:localHighGame,
        lowGame: localLowGame,
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
    updateFirebaseGameComplete()
  },[gamesData])

  /**
   * End the current session. No futher updates to firebase will be made. 
   * Redirect to create page. 
   */
  const endSession = () =>{
    router.push("/(tabs)/create")
  }

  /**
   * Update firebase when a new game has been bowled.
   */
  const updateFirebaseGameComplete = async () =>{
      try{
          await updateDoc(doc(db,`${type}Sessions`, id),{
            games: gamesData,
            stats: seriesStats
          })

      }catch(e){
        console.log("👎 Something happened")
        console.error(e)
      }
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
