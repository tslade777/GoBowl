import { View, Text } from 'react-native';
import { Series } from '@/app/src/constants/types';
import { useEffect, useState } from 'react';
import { usernameFromUserID } from '@/app/hooks/firebaseFunctions';
import parseSessionStats from '@/app/hooks/parseSessionStats';
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';
import FriendSessionTile from './FriendSessionTile';

const [loading, setLoading] = useState(true);

const FriendSessionsListTile = (sessions: Series[], username: string) => {
  /**
  return (
    <View className="bg-gray-800 p-4 m-2 rounded-lg">
      <Text className="text-white text-lg font-bold">{username}</Text>
      
      <FlatList data={sessions} keyExtractor={(item: Series, index) => item} renderItem={s => }>

      </FlatList>
    </View>
  ); */
};

export default FriendSessionsListTile;