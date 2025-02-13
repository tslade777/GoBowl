import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import "../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import BallStatsList from './components/BallStatsListPage';

const Stats = () => {
  return (
      <View className='items-center flex-1 bg-gray-100 pt-2'>
        <BallStatsList />
      </View>
  )
}

export default Stats
