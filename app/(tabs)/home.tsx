import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from '@/firebase.config';
import GameStatTile from '../gamestattile';
import { Series } from '../src/constants/types';
import { getAllSessions } from '../hooks/firebaseFunctions';
import FriendSessionTile from '../components/stats/FriendSessionTile';
import FriendSessionsListTile from '../components/stats/FriendSessionsListTile';

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
  const [sessions, setSessions] = useState<Series[]>([]);
  const [friends, setFriends] = useState<any>([])
  const [myID, setMyID] = useState("")

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const currentUserID = FIREBASE_AUTH.currentUser?.uid
        const querySnapshot = await getDoc(doc(db, `userFriends/${currentUserID}`));
        var friends: any[] = []
        if (querySnapshot.exists()) {
          friends = querySnapshot.data().friendsList.map((friend: any) => friend)
        }
        
        //const gamesData: Game[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Game[];
        //setGames(gamesData);
        var allSessions = await getAllSessions();
        setSessions(allSessions.filter(session => friends.includes(session.userID)));
        setFriends(friends);
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
        <Text>Sessions will go here</Text>
        /**
        <FlatList
          data={friends}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <FriendSessionsListTile sessions={sessions.filter(s => s.userID == item.id)}/>}
        />
         */
      )}
    </SafeAreaView>
  );
};

export default Home;
