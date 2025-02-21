import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BowlingGame from './components/scoreboard/BowlingGame'

const game = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary h-full">
      <View className="items-center">
        <BowlingGame />
      </View>
    </SafeAreaView>
  )
}

export default game
