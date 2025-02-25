import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import parseGameStats from '@/app/hooks/parseGameStats';
import { gamestats } from '@/app/src/constants/defaults';

// Single Item Component
const BowlingGameItem = ({ game, onPress, index }: { game: any; onPress: () => void, index:number }) => {
    //const stats = parseGameStats(game.stats);
    const stats = gamestats;
    
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <View className="bg-gray-300 shadow-md rounded-2xl p-4 my-2 mt-3 mx-4">
                <View className="flex-row justify-between">
                    <Text className="text-2xl font-bold text-blue-600">Game {index}</Text>
                    <Text className="text-gray-900 text-lg font-semibold">{game.stats.finalScore}</Text>
                </View>
                <View className="flex-row justify-evenly mt-1">
                    <Text className="text-lg text-gray-500">
                        Strikes: <Text className="font-bold">{isNaN(game.stats.totalStrikes) ? '--' : game.stats.totalStrikes}</Text>
                    </Text>
                    <Text className="text-lg text-gray-500">
                        Spares: <Text className="font-bold">{isNaN(game.stats.totalSpares) ? '--' : game.stats.totalSpares}</Text>
                    </Text>
                    <Text className="text-lg text-gray-500">
                        Opens: <Text className="font-bold">{isNaN(game.stats.openFrames) ? '--' : game.stats.openFrames}</Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const GameList = ({ data, onItemPress }: { data: any[]; onItemPress: (item: any, gameNum: number) => void }) => {
    return (
        <View className="flex-1 w-full h-50">
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item,index }) => <BowlingGameItem game={item} onPress={() => onItemPress(item,index+1)} index={index+1} />}
            />
        </View>
    );
};

export default GameList;