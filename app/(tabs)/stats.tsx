import { View, Text, Button } from 'react-native'
import React from 'react'
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import BowlingGameButton from '../components/BowlingGameButton';
import { router } from 'expo-router';

const Stats = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className='flex flex-row flex-wrap mt-20 items-center justify-center'>
        <BowlingGameButton
              title="Practice stats"
              handlePress={() => router.push("/practice_stats")}
            />
        <BowlingGameButton
              title="League stats"
              handlePress={() => router.push("/(tabs)/home")}
            />
        <BowlingGameButton
              title="Tournament stats"
              handlePress={() => router.push("/(tabs)/home")}
            />
        <BowlingGameButton
              title="Ball stats"
              handlePress={() => router.push("/(tabs)/home")}
            />
        <BowlingGameButton
              title="Spare stats"
              handlePress={() => router.push("/(tabs)/home")}
            />
        <BowlingGameButton
              title="Combine stats"
              handlePress={() => router.push("/(tabs)/home")}
            />
      </View>
    </SafeAreaView>
  )
}

export default Stats