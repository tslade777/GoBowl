import { View, Text, Animated, TextInput, TouchableOpacity, SafeAreaView, Modal, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import LeagueList from '@/src/components/lists/LeagueList';
import { League } from '@/src/values/types';
import subscribeToLeagues from '@/src/hooks/GetLeaguesByID';



const LeagueStats = () => {
  const [leagueData, setLeagueData] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
  }, []);
  /**
   * Get collection of leagues for this user
   * @returns 
   */
  const fetchData = async () =>{
    const unsubscribe = subscribeToLeagues((updatedLeagues) => {
      setLeagueData(updatedLeagues);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup when component unmounts
  }
  
  /**
   * User has clicked a league to start bowling. give them a heads up before starting a new week for them
   * 
   * @param item League that was clicked
   */
  function handleLeaguePress(item: any): void {
    router.push({pathname:"/(tabs)/stats/statsScreenLeagues", params: {
        leagueID: item.leagueID,
        leagueName: item.title
    }})
  }

  if (loading) {
    return <ActivityIndicator size="large" className="mt-10" />;
  }

  return (
    <SafeAreaView className="flex-1 p-6 bg-primary h-full justify-center items-center">
        <Text className="text-orange font-psemibold text-5xl">
            Leagues
        </Text>

        <LeagueList data={leagueData} onItemPress={handleLeaguePress} />
    </SafeAreaView>

    
  );
};

export default LeagueStats