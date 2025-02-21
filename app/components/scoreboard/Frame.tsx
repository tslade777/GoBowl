import { View, Text } from 'react-native';

const Frame = ({ 
    frameNumber = 1,
    width = 36, 
    height = 60, 
    borderColor = 'border-black', 
    borderWidth = 2, 
    roll1 = '', 
    roll2 = '', 
    total = '',
    isSelected = false
}) => {
    return (
        <View className="items-center">
            {/* Frame Number Label */}
            <Text className={`text-2xl ${isSelected ? "text-orange" : "text-white"} font-bold mb-1`}>
                {frameNumber}
            </Text>
            
            {/* Bowling Frame */}
            <View 
                className={`rounded-md border ${isSelected ? "border-orange" : "border-black"} bg-white ms-0.5`} 
                style={{ width, height, borderWidth }}
            >
                {/* Rolls */}
                <View className="flex-row">
                    <View className="flex-1 items-center justify-center border-r border-black">
                        <Text className="text-lg font-bold">{roll1}</Text>
                    </View>
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-lg font-bold">{roll2}</Text>
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

export default Frame;
