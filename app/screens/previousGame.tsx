import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import EmptyGame from '../components/scoreboard/EmptyGame'
import { useLocalSearchParams } from 'expo-router'
import { Game } from '../src/values/types'


const previousGame = () => {
    const params = useLocalSearchParams();
    const gamData: Game = params.gameData ? JSON.parse(params.gameData as string): null;
    const gameNum: number = params.gameNumber ? parseInt(params.gameNumber as string) : 0;
  return (
    <SafeAreaView className="flex-1 bg-primary h-full">
          <View className="flex-1">
            <EmptyGame gameData={gamData} gameNum={gameNum}/>
      </View>
    </SafeAreaView>
    
  )
}

export default previousGame