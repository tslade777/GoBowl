import { View, Text } from 'react-native';

const TenthFrame = ({ 
  width = 66, 
  height = 60, 
  borderWidth = 2, 
  roll1 = '', 
  roll2 = '', 
  roll3 = '', 
  total = '',
  isSelected = false  
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
          {[roll1, roll2, roll3].map((roll, index) => (
            <View key={index} className={`flex-1 items-center justify-center ${index < 2 ? "border-r border-black" : ""}`}>
              <Text className="text-lg font-bold">{roll}</Text>
            </View>
          ))}
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
