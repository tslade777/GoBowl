import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import "../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import PracticeStatsList from './components/PracticeStatsListPage';

const Stats = () => {
  return (
      <View className='items-center flex-1 bg-gray-100 pt-2'>
        <PracticeStatsList />
      </View>
  )
}

export default Stats
