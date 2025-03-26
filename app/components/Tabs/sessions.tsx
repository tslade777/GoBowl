import { View, Text, TouchableOpacity, Image, SafeAreaView, Platform, ActionSheetIOS, Modal, TouchableWithoutFeedback } from 'react-native';
import React, {  useState } from 'react';
import SeriesList from '../lists/SeriesList';
import { Game, Series } from '@/app/src/values/types';
import GameList from '../lists/GameList';
import { router } from 'expo-router';
import { ArrowLeft } from "lucide-react-native";
import { removeSession } from '@/app/hooks/firebaseFunctions';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { defaultSession } from '@/app/src/values/defaults';

interface StatsTabProps {
    sessionsData: Series[];
    type: string;
    leagueID: string
}
  
  const SessionsTab : React.FC<StatsTabProps> = ({ sessionsData, type,leagueID }) => {
    const [showGames, setShowGames] = useState(false);
    const [selectedItem, setSelected] = useState<any[]>([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const [selectedSeries, setSelectedSeries] = useState<Series>(sessionsData[0]);

    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    // 🔹 Animated styles (Fixes direct value access in JSX)
      const animatedStyle = useAnimatedStyle(() => {
        return {
          transform: [{ scale: scale.value }],
          opacity: opacity.value,
        };
      });

    const handleItemPress = (item: Series) => {
        
        setSelected(item.games)
        setShowGames(true);
        if (Array.isArray(item.games) && item.games.length > 0 && Object.keys(item.games[0]).length === 0) {
            item.games.shift(); // Removes the first element if it's an empty object
        }
        
    };

    const handleGamePress = (game: Game, gameNum: number) => {
        router.push({pathname:"/screens/previousGame",
            params: {gameData: JSON.stringify(game), gameNumber: gameNum}
        })
    }

    const remove = (series: Series)=>{
        console.log(`Type: ${type}`)
        console.log(`Long press: series: ${JSON.stringify(series)}`)
        removeSession(type, leagueID, series.id)
        setIsRendered(false);
    }

    /**
       * Close the popup window.
       */
      const closeModal = () => {
        // ✅ Instantly hide the modal
        setIsModalVisible(false);
      };

    
    const handleSeriesLongPress = (series: Series) => {
        setIsRendered(true);
        setSelectedSeries(series)
        if (Platform.OS === "ios") {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ["Cancel", "View Profile", "Remove Friend"],
                  cancelButtonIndex: 0,
                  destructiveButtonIndex: 2,
                },
                (buttonIndex) => {
                  if (buttonIndex === 1) {
                    remove(series)
                }}
              );
            } else {
              scale.value = 0.8;
              opacity.value = 0;
              setTimeout(() => {
                setIsModalVisible(true);
                scale.value = withSpring(1);
                opacity.value = withTiming(1);
              }, 50);
            }
    }

    return (
        <SafeAreaView className="flex-1 bg-primary h-full">
                <View className="flex-1  bg-primary">
            {showGames ? (
                <><View className="mt-4 mx-4 flex-row items-center justify-between w-full">
                    <TouchableOpacity 
                        onPress={() => setShowGames(false)} 
                        className="p-2 rounded-full bg-gray-200 active:bg-gray-300">
                        <ArrowLeft size={24} color="black" />
                    </TouchableOpacity>
                    <View className="absolute left-1/2 -translate-x-1/2">
                        <Text className='p-2 text-orange text-2xl font-psemibold'>Games</Text>
                    </View>
                </View>
                <GameList data={selectedItem} onItemPress={handleGamePress} /></>
            ):
            <SeriesList data={sessionsData} onItemPress={handleItemPress} onHold={handleSeriesLongPress} />
            }

            {/* 📌 Modern Animated Modal for Android */}
            {isRendered &&  (
                <Modal visible={isModalVisible} transparent animationType="none">
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View className="flex-1 justify-center items-center">
                    <Animated.View 
                        className="bg-gray-400 p-6 opacity-2 rounded-3xl shadow-lg w-80"
                        style={animatedStyle}
                    >
                        <View className="flex-row justify-center mb-4 items-center">
                        
                        <Text className="text-3xl font-pbold text-center ml-2 mt-1 text-black">
                            {selectedSeries.title}
                        </Text>
                        </View>
    
                        <TouchableOpacity
                        className="bg-red-500 p-3 rounded-xl mb-2"
                        onPress={() => remove(selectedSeries)}
                        activeOpacity={0.7}
                        >
                        <Text className="text-white text-center text-lg">Remove Series?</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity
                        className="bg-gray-700 p-3 rounded-xl"
                        onPress={closeModal}
                        activeOpacity={0.7}
                        >
                        <Text className="text-white text-center text-lg">Cancel</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
                </Modal>
            )}
            
        </View>
        </SafeAreaView>
        
    );
};

export default SessionsTab;