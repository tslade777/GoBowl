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
              handlePress={() => router.push("/screens/statsScreen")}
            />
        <BowlingGameButton
              title="League stats"
              handlePress={() => router.push("/league_stats")}
            />
        <BowlingGameButton
              title="Tournament stats"
              handlePress={() => router.push("/tournament_stats")}
            />
        <BowlingGameButton
              title="Ball stats"
              handlePress={() => router.push("/ball_stats")}
            />
        <BowlingGameButton
              title="Spare stats"
              handlePress={() => router.push("/spare_stats")}
            />
        
      </View>
    </SafeAreaView>
  )
}

export default Stats