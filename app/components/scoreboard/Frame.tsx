import { View, Text, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
export const frameWidth = width/10.8; // or /12 to leave margin
export const frameHeight = frameWidth*1.55;
const Frame = ({ 
    frameNumber = 1, 
    height = 60, 
    borderColor = 'border-black', 
    borderWidth = 2, 
    roll1 = -1, 
    roll2 = -1, 
    total = -1,
    isSelected = false,
    isSplit = false,
    selectedShot = 1, // accepts 'roll1' | 'roll2' | null
}) => {

    
    const spare = roll1 + roll2 == 10 && (roll1 != 10)

    const totalVal = total == -1 ? '' : total;

    return (
        <View className="items-center ">
            {/* Frame Number Label */}
            <Text className={`text-2xl ${isSelected ? "text-orange" : "text-white"} font-bold mb-1`}>
                {frameNumber}
            </Text>
            
            {/* Bowling Frame */}
            <View 
                className={`rounded-md border ${isSelected ? "border-orange" : "border-black"} bg-white`} 
                style={{ width:frameWidth, height:frameHeight, borderWidth }}
            >
                {/* Rolls */}
                <View className="flex-row">
                <View
                    className={`
                        flex-1 items-center justify-center border-r
                        ${selectedShot == 1 && isSelected ? 'bg-teal' : ''}
                    `}
                    >
                    <Text className={`text-lg font-bold ${isSplit ? 'text-red-500' : 'text-black'}`}>
                        {roll1==-1 ? '' : roll1 == 10 ? 'X' : roll1 == 0 ? '-' : roll1}
                    </Text>
                    </View>

                    <View
                    className={`
                        flex-1 items-center justify-center
                        ${selectedShot === 2 && isSelected ? 'bg-teal' : ''}
                    `}
                    >
                    <Text className="text-lg font-bold">{roll2 ==-1 ? '':
                     spare ? '/' : roll2 == 0 ? '-' : roll2}</Text>
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

export default Frame;
