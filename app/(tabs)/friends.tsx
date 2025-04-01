import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, Keyboard, 
  Platform, ActionSheetIOS, Modal, Image, 
  RefreshControl} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, getDocs, onSnapshot, query, where, updateDoc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '@/firebase.config';
import SearchBar from "../components/SearchBar";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { router } from 'expo-router';
import { Friend } from '../src/values/types';
import { defaultFriend } from '../src/values/defaults';
import LiveListItem from '../components/lists/ListItems/FriendsListItem';
import { downloadImageFromFirebase } from '../hooks/firebaseFunctions';
import icons from '@/constants/icons';

// TODO: Add loading icon for friends list
const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeFriends, setActiveFriends] = useState<string[]>([]);
  const [usersData, setUsersData] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  
  const [selectedFriend, setSelectedFriend] = useState<Friend>(defaultFriend);

  const [refreshing, setRefreshing] = useState(false);

  
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  // 🔹 Animated styles (Fixes direct value access in JSX)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const currentUser = FIREBASE_AUTH.currentUser;


  const onRefresh = async () => {
    setRefreshing(true);
    fetchUserData();
    fetchFriends();
    setRefreshing(false);
  };

  const fetchFriends = async () => {
    if (!currentUser) return;
  
    try {
      const docRef = doc(db, 'userFriends', currentUser.uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const friendsList: Friend[] = docSnap.data().friendsList || [];
        setFriends(friendsList);
      } else {
        setFriends([]); // fallback if no data
      }

    } catch (error) {
      console.error("Error fetching friends:", error);
    } 
  };

  // Load Friends List on Mount
  useEffect(() => {
    fetchUserData();
    if (!currentUser) return;

    const docRef = doc(db, 'userFriends', currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const friendsList: Friend[] = docSnap.data().friendsList || [];
        setFriends(friendsList);
      } else {
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
      const usersList: Friend[] = await Promise.all(
        querySnapshot.docs.map(async (doc) => ({
          id: doc.data().id,
          username: doc.data().username,
          profilePic: await getPic(doc.data().id, doc.data().username) || "",
          active: doc.data().active || false,
        }))
      );

      setUsersData(usersList.filter((user) => user.id !== currentUser.uid));
    } catch (error) {
      console.error("📛 Error fetching users:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const getPic = async (id: string, username: string) : Promise<string> =>{
    const url = await downloadImageFromFirebase(`profileImages/${id}/${username}.png`)
    return url || ""
  }

  // Add User to Friends List in Firebase
  const addFriend = async (user: Friend) => {
    console.log(`Friend: ${JSON.stringify(user)}`)
    router.push({
      pathname: "/screens/friendProfile",
      params: {
        friend: JSON.stringify(user),
        active: JSON.stringify(user.active)
      }
    })
  };
  

  /**
   * User should be presented a menu when long press is detected. 
   * @param friend 
   */
  const handleLongPress = (friend: Friend) => {
    setSelectedFriend(friend);
    setIsRendered(true);

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "View Profile", "Remove Friend"],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            viewProfile(friend);
          } else if (buttonIndex === 2) {
            removeFriend(friend);
          }
        }
      );
    } else {
      scale.value = 0.8;
      opacity.value = 0;
      setTimeout(() => {
        setIsModalVisible(true);
        scale.value = withSpring(1);
        opacity.value = withTiming(1);
      }, 50);
    }
  };

  /**
   * User should be redirected to the friends stream when pressed and their live. 
   * @param friend 
   */
  const handlePress = (friend: Friend) =>{
    if (friend.active){
      // Route to stream page
      router.push({
        pathname: "../streamview",
        params: {
          id: friend.id,
          profilePic: friend.profilePic,
          username: friend.username,
          active: friend.active.toString()
        }
      })
    }
    else{
      router.push({
        pathname: "/screens/friendProfile",
        params: {
          friend: JSON.stringify(friend),
        }
      })
    }

  }

  /**
   * Close the popup window.
   */
  const closeModal = () => {

    // ✅ Instantly hide the modal
    setIsModalVisible(false);
    setIsRendered(false);

    // ✅ Reset selectedFriend immediately
    setSelectedFriend(defaultFriend);
  };

  /**
   * View profile of friend clicked. 
   * 
   * @param friend 
   */
  const viewProfile = (friend: Friend ) => {
    console.log(`👤 Viewing profile of ${friend?.username}`);
    closeModal();
  };

  /**
   * Remove frined from friends list. 
   * 
   * @param friend 
   * 
   * @returns 
   */
  const removeFriend = async (friend: Friend ) => {
    if (!currentUser) return;
    try {
      const updatedFriends = friends.filter(f => f.id !== friend?.id);
      setFriends(updatedFriends);

      await updateDoc(doc(db, "userFriends", currentUser.uid), { friendsList: updatedFriends });
    } catch (error) {
      console.error("❌ Error removing friend:", error);
    }
    closeModal();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className='bg-primary h-full p-4'>
        <Text className='text-3xl text-center text-white mb-4 font-psemibold'>My Friends</Text>

        <View className="mb-4">
          <SearchBar data={usersData} onSelect={addFriend} onFocus={() => {}} />
        </View>

        {loading ? (
          <ActivityIndicator size='large' color='#F24804' />
        ) : (
          <FlatList
            className='mt-2 mx-2'
            data={friends}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="" />}
            renderItem={({ item }) => (
              <LiveListItem username={item.username} profilePicture={item.profilePic} active={item.active} 
              onHold={()=>{handleLongPress(item)}} onTouch={()=>{handlePress(item)}}></LiveListItem>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

        {/* 📌 Modern Animated Modal for Android */}
        {isRendered &&  (
          <Modal visible={isModalVisible} transparent animationType="none">
            <TouchableWithoutFeedback onPress={closeModal}>
              <View className="flex-1 justify-center items-center">
                <Animated.View 
                  className="bg-gray-300 p-6 opacity-2 rounded-3xl shadow-lg w-80"
                  style={animatedStyle}
                >
                  <View className="flex-row justify-center mb-4 items-center">
                    <Image
                        source={selectedFriend.profilePic ? { uri: selectedFriend.profilePic } : icons.profile}
                        className="w-10 h-10 rounded-full"
                      />
                    <Text className="text-3xl font-pbold text-center ml-2 mt-1 text-black">
                    {selectedFriend?.username || "Unknown User"}  {/* ✅ Prevents crash */}
                    </Text>
                  </View>
                  

                  <TouchableOpacity
                    className="bg-blue p-3 rounded-xl mb-2"
                    onPress={() => viewProfile(selectedFriend)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white text-center text-lg">View Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-red-500 p-3 rounded-xl mb-2"
                    onPress={() => removeFriend(selectedFriend)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white text-center text-lg">Remove Friend</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-gray-700 p-3 rounded-xl"
                    onPress={closeModal}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white text-center text-lg">Cancel</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Friends;
