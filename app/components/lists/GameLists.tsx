import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';

// Function to calculate average score
const calculateAverage = (games: number[]): string => {
    if (games.length === 0) return "0";
    const total = games.reduce((acc, score) => acc + score, 0);
    return (total / games.length).toFixed(1);
};

// Function to get highest game score
const getHighestGame = (games: number[]): number => {
    return games.length > 0 ? Math.max(...games) : 0;
};

// Single Item Component
const BowlingSeriesItem = ({ series, onPress }: { series: any; onPress: () => void }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <View className="bg-gray-300 shadow-md rounded-2xl p-4 my-2 mt-3 mx-4">
                <View className="flex-row justify-between">
                    <Text className="text-2xl font-bold text-blue-600">{series.title}</Text>
                    <Text className="text-gray-900 text-lg font-semibold">{series.date.toLocaleDateString()}</Text>
                </View>
                <View className="flex-row justify-evenly mt-1">
                    <Text className="text-lg text-gray-500">
                        Avg: <Text className="font-bold">n/a</Text>
                    </Text>
                    <Text className="text-lg text-gray-500">
                        High: <Text className="font-bold">n/a</Text>
                    </Text>
                    <Text className="text-lg text-gray-500">
                        Strikes: <Text className="font-bold">n/a</Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const GameLists = ({ data, onItemPress }: { data: any[]; onItemPress: (item: any) => void }) => {
    return (
        <View className="flex-1 w-full h-50">
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <BowlingSeriesItem series={item} onPress={() => onItemPress(item)} />}
            />
        </View>
    );
};

export default GameLists;
