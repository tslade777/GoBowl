import { TouchableOpacity, Text, Image, View, ImageSourcePropType, Dimensions } from 'react-native'
import React from 'react'

type Props = {
  title: string;
  image: ImageSourcePropType;
  handlePress: () => void;
  className?: string; // 👈 add this
};

const CustomButtonBowling = ({title, image, handlePress, className}: Props) => {

  const { width } = Dimensions.get('window');
  const fontSize = width <= 360 ? 'text-2xl' : 'text-3xl';
  
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={.07}
        className={`${className}`}
       >
       <View className={"items-center"}> 
          <Image 
            source={image}
            style={{ width: width * 0.40, height: width * 0.40 }}
            resizeMode={'contain'}
          />
          <Text className={`${fontSize} font-pbold mt-2 text-orange`}>{title?.toString() || "Default Title"}</Text>
        </View>
      
    </TouchableOpacity>
  )
}

export default CustomButtonBowling