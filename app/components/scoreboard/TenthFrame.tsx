import { View, Text } from 'react-native';

const TenthFrame = ({ 
  width = 66, 
  height = 60, 
  borderWidth = 2, 
  roll1 = '', 
  roll2 = '', 
  roll3 = '', 
  total = '',
  isSelected = false,
  isSplit = false 
}) => {
  return (
    <View className="items-center">
      {/* Frame Number Label */}
      <Text className={`text-2xl ${isSelected ? "text-orange" : "text-white"} font-bold mb-1`}>10</Text>

      {/* Bowling Frame with Three Roll Sections */}
      <View 
        className={`rounded-md border ${isSelected ? "border-orange" : "border-black"} bg-white ms-0.5`} 
        style={{ width, height, borderWidth }}
      >
        {/* Rolls */}
        <View className="flex-row">
          
        <View className={`flex-1 items-center justify-center  border-r border-black`}>
          <Text className={`text-lg ${isSplit && roll1=='10' ? 'text-red-500':'text-black'} font-bold`}>{roll1}</Text>
        </View>
        <View className={`flex-1 items-center justify-center  border-r border-black`}>
          <Text className={`text-lg ${isSplit && roll1!='10' ? 'text-red-500':'text-black'} font-bold`}>{roll2}</Text>
        </View>
        <View className={`flex-1 items-center justify-center`}>
          <Text className={`text-lg text-black font-bold`}>{roll3}</Text>
        </View>
          
        </View>

        {/* Total Score */}
        <View className="border-t border-black flex-1 items-center justify-center">
          <Text className="text-xl font-bold">{total}</Text>
        </View>
      </View>
    </View>
  );
};

export default TenthFrame;
