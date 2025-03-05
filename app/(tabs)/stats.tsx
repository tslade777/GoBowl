import { View, Text, Button } from 'react-native'
import React from 'react'
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import BowlingGameButton from '../components/buttons/BowlingGameButton';
import { router } from 'expo-router';
import { SESSIONS } from '../src/config/constants';
import images from '@/constants/images';
import StatsButton from '../components/buttons/StatsButton';

const Stats = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className='mt-20 items-center justify-center'>
      <Text className='text-orange text-4xl font-pbold'>STATS</Text>
      </View>
      
      <View className='flex flex-row flex-wrap items-center justify-center'>
        <StatsButton
              title="Practice"
              image={images.practice}
              handlePress={() => 
                router.push({pathname:"/screens/statsScreen", params: {type: SESSIONS.practice}})
              }
            />
        <StatsButton
              title="Open"
              image={images.practice}
              handlePress={() => router.push({pathname:"/screens/statsScreen", params: {type: SESSIONS.open}})}
            />
        <StatsButton
              title="League"
              image={images.practice}
              handlePress={() => router.push("/screens/leagueStats")}
            />
        <StatsButton
              title="Tournament"
              image={images.practice}
              handlePress={() => router.push({pathname:"/screens/statsScreen", params: {type: SESSIONS.tournament}})}
            />
      </View>
    </SafeAreaView>
  )
}

export default Stats