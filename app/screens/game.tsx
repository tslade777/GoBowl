import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BowlingGame from '../components/scoreboard/BowlingGame'
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { router } from 'expo-router';
import useBowlingStats from '../hooks/useBowlingStats';

interface Frame {
  roll1: string;
  roll2: string;
  roll3: string;
  score: number;
  firstBallPins: boolean[];
  secondBallPins: boolean[];
  thirdBallPins: boolean[];
  isSpare: boolean;
  isStrike: boolean;
  visible: boolean;
}

const game = () => {
  const args = useLocalSearchParams();
  const id = args.id as string;
  const name = args.name as string;
  const type = args.type as string;
  const [numGames, setNumGames] = useState(0);
  const [gamesData, setGamesData] = useState([{}])
  const [activeGame, setActiveGame] = useState(true)
  const [firstRender, setFirstRender] = useState(true)

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

    const statsList = [{
      finalScore: stats.finalScore,
      totalStrikes: stats.totalStrikes,
      strikePercentage: stats.strikePercentage,
      totalSpares: stats.totalSpares,
      sparePercentage: stats.sparePercentage,
      singlePinSparePercentage: stats.singlePinSparePercentage,
      openFramePercentage: stats.openFramePercentage,
    }]
    setNumGames(numGames+1)
    setGamesData([...gamesData, {game: data, stats: statsList}])
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
            games: gamesData
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
