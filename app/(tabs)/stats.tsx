import { View, Text} from 'react-native'
import React from 'react'
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SESSIONS } from '../src/config/constants';
import images from '@/constants/images';
import StatsButton from '../components/buttons/StatsButton';

const Stats = () => {
  return (
    <SafeAreaView className={"bg-primary h-full"}>
      <View className={'mt-20 items-center justify-center'}>
      <Text className={'text-orange text-4xl font-pbold'}>{"STATS"}</Text>
      </View>
      
      <View className={'flex flex-row flex-wrap items-center justify-center'}>
        <StatsButton
              className='rounded-xl w-[45%] m-1 mb-5 justify-center items-center align-middle'
              title={"Practice"}
              image={images.practice}
              handlePress={() => 
                router.push({pathname:"/screens/statsScreen", params: {type: SESSIONS.practice}})
              }
            />
        <StatsButton
              className='rounded-xl w-[45%] m-1 mb-5 justify-center items-center align-middle'
              title={"Open"}
              image={images.practice}
              handlePress={() => router.push({pathname:"/screens/statsScreen", params: {type: SESSIONS.open}})}
            />
        <StatsButton
              className='rounded-xl w-[45%] m-1 mb-5 justify-center items-center align-middle'
              title={"League"}
              image={images.practice}
              handlePress={() => router.push("/screens/leagueStats")}
            />
        <StatsButton
              className='rounded-xl w-[45%] m-1 mb-5 justify-center items-center align-middle'
              title={"Tournament"}
              image={images.practice}
              handlePress={() => router.push({pathname:"/screens/statsScreen", params: {type: SESSIONS.tournament}})}
            />
      </View>
    </SafeAreaView>
  )
}

export default Stats