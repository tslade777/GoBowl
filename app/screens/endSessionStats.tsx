import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import EndSessionStatsTab from '../components/Tabs/endSessionStatsTab'
import { useLocalSearchParams } from 'expo-router';
import { SeriesData, SeriesStats } from '../src/values/types';

const EndSessionStats = () => {
    const args = useLocalSearchParams();
    let data = args.seriesData as string;
    let title = args.title as string;
    title = title==''? 'Stats' : title + 'Stats'
    const parsedData:SeriesStats = JSON.parse(data)
  return (
    <SafeAreaView className="bg-primary h-full">
        <View className='flex-1 items-center justify-center'>
            <Text className='text-white text-3xl font-pbold'>{title}</Text>
            <EndSessionStatsTab sessionData={parsedData}/>
        </View>
    </SafeAreaView>
    
  )
}

export default EndSessionStats