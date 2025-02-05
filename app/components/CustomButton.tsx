import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlePress}:
    {title:any, handlePress:any}) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={.07}
        className={`bg-orange rounded-xl min-h-[62px] justify-center items-center`}
       >
      <Text className={`text-primary font-pblack text-2xl`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton