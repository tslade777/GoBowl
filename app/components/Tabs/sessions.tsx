import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import GameLists from '../lists/GameLists';
import { collection, getDocs, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from '@/firebase.config';
import { Series } from '@/app/src/types';

interface StatsTabProps {
    sessionsData: Series[];
}
  
  const SessionsTab : React.FC<StatsTabProps> = ({ sessionsData }) => {
    const [sessionData, setSessionData] = useState<Series[]>([]);

    useEffect(() => {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (!currentUser) {
            console.warn("No user logged in.");
            return;
        }

        // Firestore query to filter by user ID and order by date
        const q = query(
            collection(db, "practiceSessions"),
            where("userID", "==", currentUser.uid),
            orderBy("date", "desc") // Order newest first
        );

        // Subscribe to Firestore updates in real-time
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const sessions: Series[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();

                return {
                    id: doc.id,
                    date: data.date ? (data.date as Timestamp).toDate() : new Date(),
                    games: Array.isArray(data.games) ? data.games : [],
                    notes: data.notes || "",
                    title: data.title || "No Title",
                    userID: data.userID || "",
                    stats: Array.isArray(data.stats) ? data.stats : [],
                };
            });

            setSessionData(sessions); // Update state with real-time data
            console.log(`Fetched ${sessions.length} practice sessions.`);
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    const handleItemPress = (item: Series) => {
        console.log(`You selected: ${item.title}`);
    };

    return (
        <View className="flex-1 justify-center items-center bg-primary">
            <GameLists data={sessionsData} onItemPress={handleItemPress} />
        </View>
    );
};

export default SessionsTab;