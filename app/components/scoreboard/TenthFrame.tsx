import { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';

const TenthFrame = ({  
  height = 60, 
  borderWidth = 2, 
  roll1 = 0, 
  roll2 = 0, 
  roll3 = 0, 
  total = 0,
  isSelected = false,
  isSplit = false,
  selectedShot = 0, // accepts 'roll1' | 'roll2' | null
}) => {
  
  const { width } = Dimensions.get('window');
  const frameWidth = width / 7.5; // or /12 to leave margin

  const spare = roll1 + roll2 == 10 && (roll1 != 10)

  const roll1Val = roll1==-1 ? '':roll1 == 10 ? 'X': roll1 == 0 ? '-' : roll1;
  const roll2Val = roll2==-1 ? '': roll1 == 10 && roll2 == 10 ? 'X' : 
  spare ? '/': roll2 == 0 ? '-' : roll2;

  const roll3Val = roll3 ==-1 ? '' : roll3 == 10 ? 'X': roll1 == 10 && roll2 != 10
    && roll2 + roll3==10 ? '/':
    roll3 == 0 ? '-' : roll3

  const totalVal = total == -1 ? '' : total;

  return (
    <View className="items-center">
      {/* Frame Number Label */}
      <Text className={`text-2xl ${isSelected ? "text-orange" : "text-white"} font-bold mb-1`}>10</Text>

      {/* Bowling Frame with Three Roll Sections */}
      <View 
        className={`rounded-md border ${isSelected ? "border-orange" : "border-black"} bg-white`} 
        style={{ width:frameWidth, height, borderWidth }}
      >
        {/* Rolls */}
        <View className="flex-row">
           {/* TODO: Tenth frame isn't displaying*/}
        <View className={`flex-1 items-center justify-center  border-r border-black ${selectedShot === 1 && isSelected ? 'bg-teal' : ''}`}>
          <Text className={`text-lg ${(isSplit && roll1 != 10) ? 'text-red-500':'text-black'} font-bold`}>{roll1Val}</Text>
        </View>
        <View className={`flex-1 items-center justify-center  border-r border-black ${selectedShot === 2 && isSelected ? 'bg-teal' : ''}`}>
          <Text className={`text-lg ${isSplit && roll1 == 10 ? 'text-red-500':'text-red'} font-bold`}>{roll2Val}</Text>
        </View>
        <View className={`flex-1 items-center justify-center ${selectedShot === 3 && isSelected ? 'bg-teal' : ''}`}>
          <Text className={`text-lg text-black font-bold`}>{roll3Val}</Text>
        </View>
          
        </View>

        {/* Total Score */}
        <View className="border-t border-black flex-1 items-center justify-center">
          <Text className="text-xl font-bold">{totalVal}</Text>
        </View>
      </View>
    </View>
  );
};

export default TenthFrame;


