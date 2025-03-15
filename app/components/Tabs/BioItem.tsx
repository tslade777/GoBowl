import { View, Text } from 'react-native'
import React from 'react'

const BioItem = ({ label, item }: { label: string; item: string }) => {
  return (
    <View className='flex-row border-b-2 mt-5 justify-between border-gray-400 mx-3 mb-1'>
      <Text className='text-white text-3xl font-pbold'>{label}</Text>
      <Text className='text-white text-3xl mr-20 font-pbold'>{item}</Text>
    </View>
  )
}

export default BioItem