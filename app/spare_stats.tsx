import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import "../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import SpareStatsList from './components/PracticeStatsListPage';

const Stats = () => {
  return (
      <View className='items-center flex-1 bg-gray-100 pt-2'>
        <SpareStatsList />
      </View>
  )
}

export default Stats
