import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import Stream from './components/streamview/Stream';

const StreamView = () => {
    const params = useLocalSearchParams(); // Get paramaters passed in.
    const id = params.id as string;
    const username = params.username as string
    const isActive = params.active === "true"; // Convert string to boolean
  return (
    <SafeAreaView className="flex-1 bg-primary h-full">
      <View className="items-center">
        <Stream id={id} username={username} active={isActive}/>
      </View>
    </SafeAreaView>
  )
}

export default StreamView