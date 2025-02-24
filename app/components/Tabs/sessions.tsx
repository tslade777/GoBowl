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

    const handleItemPress = (item: Series) => {
        // Show screen with games and stats.
        console.log(`You selected: ${item.title}`);
    };

    return (
        <View className="flex-1 justify-center items-center bg-primary">
            <GameLists data={sessionsData} onItemPress={handleItemPress} />
        </View>
    );
};

export default SessionsTab;