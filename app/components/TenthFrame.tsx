import { View, Text } from 'react-native';

const TenthFrame = ({ 
  width = 66, 
  height = 60, 
  borderColor = 'border-black', 
  borderWidth = 2, 
  roll1 = '', 
  roll2 = '', 
  roll3 = '', 
  total = '' 
}) => {
  return (
    <View className="items-center">
      {/* Frame Number Label */}
      <Text className="text-lg font-bold mb-1">10</Text>

      {/* Bowling Frame with Three Roll Sections */}
      <View className={`border ${borderColor} bg-white ms-0.5`} style={{ width, height, borderWidth }}>
        {/* Top section for three rolls */}
        <View className="flex-row">
          <View className="flex-1 items-center justify-center border-r border-black">
            <Text className="text-lg font-bold">{roll1}</Text>
          </View>
          <View className="flex-1 items-center justify-center border-r border-black">
            <Text className="text-lg font-bold">{roll2}</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-bold">{roll3}</Text>
          </View>
        </View>

        {/* Bottom section for total score */}
        <View className="border-t border-black flex-1 items-center justify-center">
          <Text className="text-xl font-bold">{total}</Text>
        </View>
      </View>
    </View>
  );
};

export default TenthFrame;