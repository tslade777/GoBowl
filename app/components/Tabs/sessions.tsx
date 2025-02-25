import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import SeriesList from '../lists/SeriesList';
import { Game, Series } from '@/app/src/constants/types';
import GameList from '../lists/GameList';

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
        console.log(`You selected: game ${gameNum}`);
    }

    return (
        <View className="flex-1 justify-center items-center bg-primary">
            {showGames ? (
                
                <GameList data={selectedItem} onItemPress={handleGamePress} />
            ):
            <SeriesList data={sessionsData} onItemPress={handleItemPress} />
            }
            
        </View>
    );
};

export default SessionsTab;