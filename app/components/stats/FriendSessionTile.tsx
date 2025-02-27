import { View, Text } from 'react-native';
import { Series } from '@/app/src/constants/types';
import { useEffect, useState } from 'react';
import { usernameFromUserID } from '@/app/hooks/firebaseFunctions';
import parseSessionStats from '@/app/hooks/parseSessionStats';

const [loading, setLoading] = useState(true);

const FriendSessionTile = (session: Series, username: string) => {
  const seriesStats = parseSessionStats(session)

  return (
    <View className="bg-gray-800 p-4 m-2 rounded-lg">
      <Text className="text-white text-lg font-bold">{username}</Text>
      <Text className="text-gray-300">Highest Score: {seriesStats.highGame}</Text>
      <Text className="text-gray-300">Last Game: {session.notes}</Text>
      <Text className="text-gray-300">Mode: {session.notes}</Text>
    </View>
  );
};

export default FriendSessionTile;