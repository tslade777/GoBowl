import { View, Text, SafeAreaView, Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import Stream from './components/streamview/Stream';
import icons from '@/constants/icons';

const StreamView = () => {
    const params = useLocalSearchParams(); // Get paramaters passed in.
    const id = params.id as string;
    const username = params.username as string
    const isActive = params.active === "true"; // Convert string to boolean
  return (
    <SafeAreaView className="flex-1 bg-primary h-full">
      <View className="items-center">
        <View className="flex-row items-center space-x-3 mb-3">
          <Image
            source={icons.profile}
            className="w-10 h-10 rounded-full"
          />
          <Text className="text-white ml-3 text-3xl font-pbold">{username}</Text>
        </View>
        <Stream id={id} username={username} active={isActive}/>
      </View>
    </SafeAreaView>
  )
}

export default StreamView