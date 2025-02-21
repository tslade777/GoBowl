import { View, Text, FlatList, ActivityIndicator, TouchableWithoutFeedback, Keyboard, TouchableOpacity,  } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '@/firebase.config';
import SearchBar from "../components/SearchBar";
import "react-native-gesture-handler";

interface User {
  id: string;
  username: string;
  active: boolean
}

const Friends = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [activeFriends, setActiveFriends] = useState<string[]>([]); // Store only active friend IDs
  const [usersData, setUsersData] = useState<User[]>([]); // Stores all users for searching
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false); // Loading state for search
  const currentUser = FIREBASE_AUTH.currentUser;


  // Load Friends List on Mount
  useEffect(() => {
    if (!currentUser) return;

    const docRef = doc(db, 'userFriends', currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const friendsList: User[] = docSnap.data().friendsList || [];
        console.log(`📜 Friends list loaded: ${friendsList.length} friends`);
        setFriends(friendsList);
      } else {
        console.log("📭 No friends list found.");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Listen for Active Users in Firestore
  useEffect(() => {
    const q = query(collection(db, 'activeUsers'), where('active', '==', true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeUserIDs = snapshot.docs.map(doc => doc.data().id);
      console.log(`🔥 Active users updated: ${activeUserIDs.length} users`);
      setActiveFriends(activeUserIDs);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Update Friends List When Active Users Change
  useEffect(() => {
    setFriends(prevFriends =>
      prevFriends.map(friend => ({
        ...friend,
        active: activeFriends.includes(friend.id) // Update active status
      }))
    );
  }, [activeFriends]); // Runs when `activeFriends` changes

  // Fetch All Users on SearchBar Focus (Prevents Unnecessary Fetches)
  const fetchUserData = async () => {
    try {
      if (!currentUser || usersData.length > 0) return; // Prevent unnecessary re-fetch

      setSearchLoading(true);
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const usersList: User[] = querySnapshot.docs
        .map(doc => ({
          id: doc.data().id,
          username: doc.data().username,
          active: false
        }))
        .filter(user => user.id !== currentUser.uid); // Exclude current user

      setUsersData(usersList);
      console.log(`🔍 Found ${usersList.length} users.`);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Add User to Friends List in Firebase
  const addFriend = async (user: User) => {
    try {
      if (!currentUser) return;

      // Prevent adding duplicates
      if (friends.some(friend => friend.id === user.id)) {
        console.log("⚠ User is already in friends list.");
        return;
      }

      const updatedFriends = [...friends, user];
      setFriends(updatedFriends);

      // Save to Firestore
      await setDoc(doc(db, "userFriends", currentUser.uid), { friendsList: updatedFriends });
      console.log(`✅ ${user.username} added to friends list.`);
    } catch (error) {
      console.error("❌ Error adding friend:", error);
    }
    
  };

  // Handle Friend Selection (Example: Open Profile or Show Options)
  const handleFriendPress = (friend: User) => {
    console.log(`👤 Friend clicked: ${friend.username}`);
    // Example: Navigate to Friend's Profile (Replace with actual navigation)
    // navigation.navigate('FriendProfile', { friendId: friend.id });
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className='bg-primary h-full p-4'>
        <Text className='text-3xl text-center text-white mb-4 font-psemibold'>My Friends</Text>

        {/* 🔍 Integrated SearchBar Component */}
        <View className="mb-4">
          <SearchBar data={usersData} onSelect={addFriend} onFocus={fetchUserData} />
        </View>

        {/* 👫 Friends List */}
        {loading ? (
          <ActivityIndicator size='large' color='#F24804' />
        ) : (
          <FlatList
            className='mt-10 border-t border-orange'
            data={friends}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-[2px] bg-orange m-1 " />}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`flex-row bg-primary p-4 mb-3 rounded-lg shadow-md w-full justify-between items-center`}
                onPress={() => handleFriendPress(item)} // ✅ Now clickable!
                activeOpacity={0.7} // ✅ Adds touch feedback
              >
                <View>
                  <Text className="text-2xl font-pextrabold text-white">{item.username}</Text>
                </View>
                {item.active && <View className="w-6 h-6 bg-green-500 rounded-full" />}

              </TouchableOpacity>
              
            )}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};


export default Friends;
