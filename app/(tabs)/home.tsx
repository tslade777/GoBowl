import { View, Text, FlatList } from 'react-native'
import React from 'react'
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  return (
    <SafeAreaView>
      <Text className='text-3xl text-center'>Home</Text>
    </SafeAreaView>
  )
}

export default Home