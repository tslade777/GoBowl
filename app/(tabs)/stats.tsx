import { View, Text, Button } from 'react-native'
import React from 'react'
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import BowlingGameButton from '../components/buttons/BowlingGameButton';
import { router } from 'expo-router';

const Stats = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className='flex flex-row flex-wrap mt-20 items-center justify-center'>
        <BowlingGameButton
              title="Practice stats"
              handlePress={() => 
                router.push({pathname:"/screens/statsScreen", params: {type: "practice"}})
              }
            />
        <BowlingGameButton
              title="Open Stats"
              handlePress={() => router.push({pathname:"/screens/statsScreen", params: {type: "open"}})}
            />
        <BowlingGameButton
              title="League Stats"
              handlePress={() => router.push("/tournament_stats")}
            />
        <BowlingGameButton
              title="Tournament Stats"
              handlePress={() => router.push({pathname:"/screens/statsScreen", params: {type: "tournament"}})}
            />
      </View>
    </SafeAreaView>
  )
}

export default Stats