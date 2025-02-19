import { View, Text, FlatList, ActivityIndicator, TouchableWithoutFeedback  } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { FIREBASE_AUTH } from '@/firebase.config';
import BowlingGameButton from '../components/BowlingGameButton';
import { Redirect, router, Tabs } from "expo-router";
import SearchBar from "../components/SearchBar";
import "react-native-gesture-handler";

const Friends = () => {
  const navigation = useNavigation();
  const [friends, setFriends] = useState<{ id: string; username: string; email: string }[]>([]);
  const [usersData, setUsersData] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    fetchUserData();
    }, []);
    
    // Retrieve list of possible users to add
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users: string[] = querySnapshot.docs.map(doc => doc.data().username);
        setUsersData(users);
      } catch (error) {
        console.error("Error fetching userNames: ", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {

  }, [currentUser]);

  const handleSelection = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <SafeAreaView className='bg-primary h-full p-4'>
      <Text className='text-3xl text-center text-white mb-4 font-psemibold'>My Friends</Text>
      <View className='flex flex-row flex-wrap mt-4 items-center justify-center'>
      <SearchBar data={usersData} onSelect={handleSelection} />
      {selectedItem !== "" && (
            <Text className="text-4xl mt-4">Selected: {selectedItem}</Text>
          )}
      </View>
      {loading ? (
        <ActivityIndicator size='large' color='#F24804' />
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: '#333', padding: 10, margin: 5, borderRadius: 5 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.username}</Text>
              <Text style={{ color: 'gray' }}>{item.email}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Friends;
