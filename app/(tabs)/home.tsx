import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDoc, getDocs, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db, storage } from '@/firebase.config';
import { listAll, getDownloadURL, ref } from 'firebase/storage';
import GameStatTile from '../gamestattile';

interface Game {
  id: string;
  userID: string;
  username: string;
  highestScore: number;
  lastGame: string;
  mode: string;
  profilePic: string;
}

const Home = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendGames = async () => {
      try {
        const auth = getAuth();
        const currentUserID = auth.currentUser?.uid;
        if (!currentUserID) return;

        const friendsDoc = await getDoc(doc(db, 'userFriends', currentUserID));
        const friendsList = friendsDoc.exists() ? friendsDoc.data().friendsList || [] : [];
        const friendIDs = friendsList.map((f: any) => f.id);

        if (friendIDs.length === 0) {
          setGames([]);
          return;
        }

        const sessionSnapshot = await getDocs(collection(db, 'practiceSessions'));

        const filteredGames: Game[] = await Promise.all(
          sessionSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter((session: any) => friendIDs.includes(session.userID))
            .map(async (session: any) => {
              const friend = friendsList.find((f: any) => f.id === session.userID);
              const profilePic = await fetchProfileImage(session.userID);

              return {
                id: session.id,
                userID: session.userID,
                username: friend?.username || 'Friend',
                highestScore: session.stats?.highGame || 0,
                lastGame: session.date?.toDate().toLocaleDateString() || '',
                mode: 'Practice',
                profilePic,
              };
            })
        );

        setGames(filteredGames);
      } catch (error) {
        console.error("Error fetching friend games: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendGames();
  }, []);

  const fetchProfileImage = async (userID: string): Promise<string> => {
    const folderRef = ref(storage, `profileImages/${userID}`);
    const result = await listAll(folderRef);

    if (result.items.length > 0) {
      const firstImageRef = result.items[0];
      return await getDownloadURL(firstImageRef);
    } else {
      return '../../assets/images/profile.png';
    }
  };

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
