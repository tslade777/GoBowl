import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BowlingGame from './components/scoreboard/BowlingGame'
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useLocalSearchParams } from 'expo-router/build/hooks';

interface SessionProps {
  name: string;
  id: string;
}

const game = () => {
  const args = useLocalSearchParams();
  const id = args.id as string;
  const name = args.name as string;
  const [numGames, setNumGames] = useState(0);
  const [gamesData, setGamesData] = useState([{}])

  /**
   * A game has just been bowled, update firebase.
   * 
   * @param data The game data for the recently bowled game. 
   */
  const handleDataFromChild = (data: any) =>{
    setNumGames(numGames+1)
    setGamesData([...gamesData, {game: data, stats: [{}]}])
    
    
  }

  useEffect(()=>{
    updateFirebaseGameComplete()
  },[gamesData])

  const updateFirebaseGameComplete = async () =>{
      try{
          await updateDoc(doc(db,"practiceSessions", id),{
            games: gamesData
          })

      }catch(e){
        console.log("👎 Something happened")
        console.error(e)
      }
    }

  return (
    <SafeAreaView className="flex-1 bg-primary h-full">
      <View className="items-center">
        <BowlingGame sendDataToParent={handleDataFromChild}/>
      </View>
    </SafeAreaView>
  )
}

export default game
