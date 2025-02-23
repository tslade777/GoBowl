import { View, Text } from 'react-native'
import React from 'react'
import PracticeStatsList from '../PracticeStatsListPage'

const StatsTab = () => {
  return (
    <View className="flex-1 bg-primary justify-center items-center">
      <PracticeStatsList />
    </View>
  )
}

export default StatsTab