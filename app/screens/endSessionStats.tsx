import { View, Text, TouchableOpacity, SafeAreaView, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import EndSessionStatsTab from '../components/Tabs/endSessionStatsTab'
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { SeriesData, SeriesStats } from '../src/values/types';

const EndSessionStats = () => {

    const navigation = useNavigation();
    const router = useRouter();

    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          // custom logic here
          router.replace('/(tabs)/create')
          return true; // prevent default goBack
        };
    
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [])
    );

    useEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity
                className=''
                onPress={() => {console.log('press');}}
                onPressIn={() => {router.replace('/(tabs)/create')}}>
              <Text className='text-white text-xl font-psemibold'>Back</Text>
            </TouchableOpacity>
          ),
        });
      }, [navigation]);

    const args = useLocalSearchParams();
    let data = args.seriesData as string;
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

export default EndSessionStats