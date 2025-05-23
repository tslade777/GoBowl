import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';



// Single Item Component
const LeagueListSingleItem = ({ league, onPress }: { league: any; onPress: () => void }) => {
    
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <View className="bg-gray-300 shadow-md rounded-3xl p-4 my-2 mt-3 mx-4">
                <View className="flex-row justify-between">
                    <Text className="text-2xl font-pbold text-blue-600">{league.title}</Text>
                    <Text className="text-gray-900 text-lg font-pbold">--</Text>
                </View>
                <View className="flex-row justify-evenly mt-1">
                    <Text className="text-lg text-gray-500">
                        Weeks: <Text className="font-pbold">{league.weeks}</Text>
                    </Text>
                    <Text className="text-lg text-gray-500">
                        Avg: <Text className="font-pbold">--</Text>
                    </Text>
                    <Text className="text-lg text-gray-500">
                        Game: <Text className="font-pbold">--</Text>
                    </Text>
                    <Text className="text-lg text-gray-500">
                        Series: <Text className="font-pbold">--</Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const LeagueList = ({ data, onItemPress }: { data: any[]; onItemPress: (item: any) => void }) => {
    return (
        <View className="flex-1 w-full h-50">
            <FlatList
                data={data}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => <LeagueListSingleItem league={item} onPress={() => onItemPress(item)} />}
            />
        </View>
    );
};

export default LeagueList;
