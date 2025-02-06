import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButtonBowling = ({title, handlePress}:
    {title:any, handlePress:any}) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={.07}
        className={`bg-teal rounded-xl h-48 w-48 m-4 justify-center items-center align-middle`}
       >
      <Text className={`text-primary font-pblack text-2xl`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButtonBowling