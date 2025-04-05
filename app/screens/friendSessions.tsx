import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Series } from '@/app/src/values/types';
import SeriesList from '../components/lists/SeriesList';
import GameList from '../components/lists/GameList';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { getSessionsByID } from '../hooks/firebaseFunctions'

const FriendSessions = () => {
  const { friendID, username, type } = useLocalSearchParams();
  const [sessionsData, setSessionsData] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [showGames, setShowGames] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const data = await getSessionsByID(friendID as string, type as string);
    setSessionsData(data);
  };

  const handleSeriesPress = (series: Series) => {
    if (Array.isArray(series.games) && series.games.length > 0 && Object.keys(series.games[0]).length === 0) {
        series.games.shift();
      }
    setSelectedSeries(series);
    setShowGames(true);
  };

  const handleGamePress = (game: any, index: number) => {
    router.push({
      pathname: '/screens/previousGame',
      params: {
        gameData: JSON.stringify(game),
        gameNumber: index,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="py-4 px-6 justify-center items-center bg-blue-500">
        <Text className="text-orange text-3xl font-pbold">{username}'s Games</Text>
      </View>

      {sessionsData.length === 0 ? (
        <ActivityIndicator size="large" color="#F24804" />
      ) : showGames && selectedSeries ? (
        <>
          <View className="mt-4 mx-4 flex-row items-center justify-between w-full">
            <TouchableOpacity
              onPress={() => setShowGames(false)}
              className="p-2 rounded-full bg-gray-200 active:bg-gray-300"
            >
              <ArrowLeft size={24} color="black" />
            </TouchableOpacity>
            <View className="absolute left-1/2 -translate-x-1/2">
              <Text className="p-2 text-orange text-2xl font-psemibold">Games</Text>
            </View>
          </View>
          <GameList data={selectedSeries.games} onItemPress={handleGamePress} />
        </>
      ) : (
        <SeriesList data={sessionsData} onItemPress={handleSeriesPress} onHold={() => {}} />
      )}
    </SafeAreaView>
  );
};

export default FriendSessions;
