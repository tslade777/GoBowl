import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import EndSessionStatsTab from '../components/Tabs/endSessionStatsTab'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { SeriesData, SeriesStats } from '../src/values/types';

const HistorySessionStats = () => {

    const navigation = useNavigation();
    const router = useRouter();

    const args = useLocalSearchParams();
    let data = args.seriesStats as string;
    let title = args.title as string;
    title = title==''? 'Stats' : title + ' Stats'
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

export default HistorySessionStats