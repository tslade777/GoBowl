import { TouchableOpacity, Text, Image, View } from 'react-native'
import React from 'react'
import { images } from '@/constants'

const CustomButtonBowling = ({title, image, handlePress}:
    {title:any, image:any, handlePress:any}) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={.07}
        className={`rounded-xl h-50 w-50 m-4 justify-center items-center align-middle`}
       >
       <View className={"items-center"}> {/* Center Image & Text */}
          <Image 
            source={image}
            className={'w-48 h-48'}
            resizeMode={'contain'}
          />
          <Text className={"text-3xl font-pbold mt-2 text-orange"}>{title?.toString() || "Default Title"}</Text>
        </View>
      
    </TouchableOpacity>
  )
}

export default CustomButtonBowling