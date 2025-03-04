import { View, Text, Touchable, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import SeriesList from '../lists/SeriesList';
import { Game, Series } from '@/app/src/values/types';
import GameList from '../lists/GameList';
import { router } from 'expo-router';
import { ArrowLeft } from "lucide-react-native";

interface StatsTabProps {
    sessionsData: Series[];
}
  
  const SessionsTab : React.FC<StatsTabProps> = ({ sessionsData }) => {
    const [showGames, setShowGames] = useState(false);
    const [selectedItem, setSelected] = useState<any[]>([])

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

    return (
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
            <SeriesList data={sessionsData} onItemPress={handleItemPress} />
            }
            
        </View>
    );
};

export default SessionsTab;