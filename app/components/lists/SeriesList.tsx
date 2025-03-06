import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import parseSessionStats from '@/app/hooks/parseSessionStats';



// Single Item Component
const BowlingSeriesItem = ({ series, onPress }: { series: any; onPress: () => void }) => {
    const stats = parseSessionStats(series);
    
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <View className="bg-gray-300 shadow-md rounded-2xl p-4 my-2 mt-3 mx-4">
                <View className="flex-row justify-between">
                    <Text className="text-2xl font-pbold text-blue-600">{series.title}</Text>
                    <Text className="text-gray-900 text-lg font-pbold">{series.date.toLocaleDateString()}</Text>
                </View>
                <View className="flex-row justify-evenly mt-1">
                    <Text className="text-lg text-gray-500">
                        Avg: <Text className="font-pbold">{isNaN(stats.average) ? '--' : stats.average.toFixed(2)}</Text>
                    </Text>
                    <Text className="text-lg text-gray-500">
                        High: <Text className="font-pbold">{isNaN(stats.highGame) ? '--' : stats.highGame}</Text>
                    </Text>
                    <Text className="text-lg text-gray-500">
                        Strikes: <Text className="font-pbold">{isNaN(stats.totalStrikes) ? '--' : stats.totalStrikes}</Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const SeriesList = ({ data, onItemPress }: { data: any[]; onItemPress: (item: any) => void }) => {
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

export default SeriesList;
