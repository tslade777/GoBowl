import { Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase.config';
import GameStatTile from '../gamestattile';

interface Game {
  id: string;
  username: string;
  highestScore: number;
  lastGame: string;
  mode: string;
}

const Home = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const gamesData: Game[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Game[];
        setGames(gamesData);
      } catch (error) {
        console.error("Error fetching games: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  return (
    <SafeAreaView className='bg-primary h-full'>
      <Text className='text-3xl text-center text-white mt-5'>Friends' Game Stats</Text>
      {loading ? (
        <ActivityIndicator size='large' color='#F24804' />
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GameStatTile game={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
