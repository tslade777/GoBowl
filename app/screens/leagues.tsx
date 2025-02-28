import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const leagues = () => {

    const args = useLocalSearchParams();
      const id = args.id as string;
      const name = args.name as string;
      const type = args.type as string;
  return (
    <View className='flex-row justify-center'>
      <Text>{id}</Text>
      <Text>{name}</Text>
      <Text>{type}</Text>
    </View>
  )
}

export default leagues