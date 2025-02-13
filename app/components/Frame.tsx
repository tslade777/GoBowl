import { View, Text } from 'react-native';

const Frame = ({ 
    frameNumber = 1, // Frame number label
    width = 36, 
    height = 60, 
    borderColor = 'border-black', 
    borderWidth = 2, 
    roll1 = '', 
    roll2 = '', 
    total = '' 
  }) => {
    return (

        <View className="items-center">
        {/* Frame Number Label */}
        <Text className="text-2xl text-orange font-bold mb-1">{frameNumber}</Text>
        
        {/* Bowling Frame */}
        <View className={`rounded-md border ${borderColor} bg-white ms-0.5`} style={{ width, height, borderWidth }}>
          {/* Top section for rolls with divider */}
          <View className="flex-row">
            <View className="flex-1 items-center justify-center border-r border-black">
              <Text className="text-lg font-bold">{roll1}</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <Text className="text-lg font-bold">{roll2}</Text>
            </View>
          </View>
  
          {/* Bottom section for total score with top border */}
          <View className="border-t border-black flex-1 items-center justify-center">
            <Text className="text-xl font-bold">{total}</Text>
          </View>
        </View>
      </View>
    );
  };

export default Frame;
