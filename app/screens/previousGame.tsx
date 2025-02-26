import { View, Text } from 'react-native'
import React from 'react'
import EmptyGame from '../components/scoreboard/EmptyGame'
import { useLocalSearchParams } from 'expo-router'
import { Game } from '../src/constants/types'

const previousGame = () => {
    const params = useLocalSearchParams();
    const gamData: Game = params.gameData ? JSON.parse(params.gameData as string): null;
    const gameNum: number = params.gameNumber ? parseInt(params.gameNumber as string) : 0;
  return (
    <View className='flex-1 bg-primary h-full'>
      <EmptyGame gameData={gamData} gameNum={gameNum}/>
    </View>
  )
}

export default previousGame