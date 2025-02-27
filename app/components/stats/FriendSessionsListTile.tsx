import { View, Text, FlatList } from 'react-native';
import { Series } from '@/app/src/constants/types';
import { useEffect, useState } from 'react';
import { usernameFromUserID } from '@/app/hooks/firebaseFunctions';
import parseSessionStats from '@/app/hooks/parseSessionStats';
import FriendSessionTile from './FriendSessionTile';

const [loading, setLoading] = useState(true);

const FriendSessionsListTile = (practiceSessions: Series[],
                                openSessions: Series[],
                                tournamentSessions: Series[], 
                                username: string) => {
  
  return (
    <View className="bg-gray-800 p-4 m-2 rounded-lg">
      <Text className="text-white text-lg font-bold">{username}</Text>
      <Text className="text-white font-bold">Last 2 practice sessions:</Text>
      <FlatList 
        data={practiceSessions}   
        keyExtractor={(item: Series, index) => (item.id)} 
        renderItem={({ item }) => (FriendSessionTile(item, username))}>
      </FlatList>

      <Text className="text-white font-bold">Last 2 open sessions:</Text>
      <FlatList 
        data={openSessions}   
        keyExtractor={(item: Series, index) => (item.id)} 
        renderItem={({ item }) => (FriendSessionTile(item, username))}>
      </FlatList>

      <Text className="text-white font-bold">Last 2 tournament sessions:</Text>
      <FlatList 
        data={tournamentSessions}   
        keyExtractor={(item: Series, index) => (item.id)} 
        renderItem={({ item }) => (FriendSessionTile(item, username))}>
      </FlatList>

      <Text className="text-white font-bold">Last 2 league sessions: coming soon</Text>
    </View>
  );
};

export default FriendSessionsListTile;