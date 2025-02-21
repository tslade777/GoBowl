import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, Keyboard, 
  Platform, ActionSheetIOS, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, getDocs, onSnapshot, query, where, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '@/firebase.config';
import SearchBar from "../components/SearchBar";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

interface User {
  id: string;
  username: string;
  active: boolean;
}

const Friends = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [activeFriends, setActiveFriends] = useState<string[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const defaultFriend = { id: "", username: "Unknown User", active: false }; // ✅ Prevents `null` issues
  const [selectedFriend, setSelectedFriend] = useState<User>(defaultFriend); // ✅ Uses default instead of `null`

  
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

  useEffect(() => {
    if (!currentUser) return;

    const docRef = doc(db, 'userFriends', currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const friendsList: User[] = docSnap.data().friendsList || [];
        setFriends(friendsList);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'activeUsers'), where('active', '==', true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeUserIDs = snapshot.docs.map(doc => doc.data().id);
      setActiveFriends(activeUserIDs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setFriends(prevFriends =>
      prevFriends.map(friend => ({
        ...friend,
        active: activeFriends.includes(friend.id)
      }))
    );
  }, [activeFriends]);


  const handleLongPress = (friend: User) => {
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

  const closeModal = () => {

    console.log("🚀 Closing modal...");
    console.log("🔍 Current selectedFriend:", selectedFriend);
    console.log("🔍 Type of setSelectedFriend:", typeof setSelectedFriend);

    console.log("🚀 Closing modal...");

    // ✅ Instantly hide the modal
    setIsModalVisible(false);
    setIsRendered(false);

    // ✅ Reset selectedFriend immediately
    setSelectedFriend(defaultFriend);
  };

  const viewProfile = (friend: User ) => {
    console.log(`👤 Viewing profile of ${friend?.username}`);
    closeModal();
  };

  const removeFriend = async (friend: User ) => {
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
          <SearchBar data={usersData} onSelect={() => {}} onFocus={() => {}} />
        </View>

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
                onLongPress={() => handleLongPress(item)}
                activeOpacity={0.7}
              >
                <View>
                  <Text className="text-2xl font-pextrabold text-white">{item.username}</Text>
                </View>
                {item.active && <View className="w-6 h-6 bg-green-500 rounded-full" />}
              </TouchableOpacity>
            )}
          />
        )}

        {/* 📌 Modern Animated Modal for Android */}
        {isRendered &&  (
          <Modal visible={isModalVisible} transparent animationType="none">
            <TouchableWithoutFeedback onPress={closeModal}>
              <View className="flex-1 justify-center items-center">
                <Animated.View 
                  className="bg-white p-6 rounded-2xl shadow-lg w-80"
                  style={animatedStyle}
                >
                  <Text className="text-xl font-bold text-center mb-4 text-black">
                  {selectedFriend?.username || "Unknown User"}  {/* ✅ Prevents crash */}
                  </Text>

                  <TouchableOpacity
                    className="bg-blue p-3 rounded-lg mb-2"
                    onPress={() => viewProfile(selectedFriend)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white text-center text-lg">View Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-red-500 p-3 rounded-lg mb-2"
                    onPress={() => removeFriend(selectedFriend)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white text-center text-lg">Remove Friend</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-gray-300 p-3 rounded-lg"
                    onPress={closeModal}
                    activeOpacity={0.7}
                  >
                    <Text className="text-black text-center text-lg">Cancel</Text>
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
