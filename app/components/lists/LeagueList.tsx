import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import parseSessionStats from '@/app/hooks/parseSessionStats';
import parseTotalSessionStats from '@/app/hooks/parseTotalSessionStats';
import { League, Series, SeriesStats } from '@/app/src/values/types';
import { getLeagueSessions } from '@/app/hooks/firebaseFunctions';
import { defaultSeriesStats } from '@/app/src/values/defaults';


// Single Item Component
const LeagueListSingleItem = ({ league, onPress, weeks }: { weeks:number, league: League; onPress: () => void }) => {
    const [stats, setStats] = useState<SeriesStats>(defaultSeriesStats);

    useEffect(()=>{
        fetchData();
    })

    const fetchData = async ()  =>{
        const sessions = await getLeagueSessions(league.leagueID);
        const sessionsStats = parseTotalSessionStats(sessions)
        setStats(sessionsStats)
    }
    

    
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <View className="bg-gray-300 shadow-md rounded-3xl p-4 my-2 mt-3 mx-4">
                <View className="flex-row justify-between">
                    <Text className="text-2xl font-pbold text-blue-600">{league.title}</Text>
                    <Text className="text-gray-900 text-lg font-pbold">Weeks: {weeks}</Text>
                </View>
                <View className="flex-row justify-evenly mt-1">
                    <Text className="text-lg text-gray-500">
                        Avg: <Text className="font-pbold">{(stats.average % 1 === 0) ? stats.average : stats.average.toFixed(2)}</Text>
                    </Text>
                    <Text className="text-lg text-gray-500">
                        Game: <Text className="font-pbold">{stats.highGame}</Text>
                    </Text>
                    <Text className="text-lg text-gray-500">
                        Series: <Text className="font-pbold">{stats.highSeries}</Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const LeagueList = ({ data, onItemPress }: { data: League[]; onItemPress: (item: any) => void }) => {
    const weeks = data.length;
      
    return (
        <View className="flex-1 w-full h-50">
            <FlatList
                data={data}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => <LeagueListSingleItem weeks={weeks} league={item} onPress={() => onItemPress(item)} />}
            />
        </View>
    );
};

export default LeagueList;
