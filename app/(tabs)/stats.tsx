import { View, Text, Button } from 'react-native'
import React from 'react'
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import BowlingGameButton from '../components/buttons/BowlingGameButton';
import { router } from 'expo-router';
import { SESSIONS } from '../src/config/constants';

const Stats = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className='flex flex-row flex-wrap mt-20 items-center justify-center'>
        <BowlingGameButton
              title="Practice stats"
              handlePress={() => 
                router.push({pathname:"/screens/statsScreen", params: {type: SESSIONS.practice}})
              }
            />
        <BowlingGameButton
              title="Open Stats"
              handlePress={() => router.push({pathname:"/screens/statsScreen", params: {type: SESSIONS.open}})}
            />
        <BowlingGameButton
              title="League Stats"
              handlePress={() => router.push("/home")}
            />
        <BowlingGameButton
              title="Tournament Stats"
              handlePress={() => router.push({pathname:"/screens/statsScreen", params: {type: SESSIONS.tournament}})}
            />
      </View>
    </SafeAreaView>
  )
}

export default Stats