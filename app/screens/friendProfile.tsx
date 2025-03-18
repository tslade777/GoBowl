import { View, Text, Button, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { icons } from '@/constants';
import { getLocalImagePath, handleImageSelection } from '../hooks/ImageFunctions';
import { Friend, UserData } from '../src/values/types';
import { fetchUserDataByID } from '../hooks/firebaseFunctions';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Bio from '../components/Tabs/bio';
import StatComparison from '../components/Tabs/statComparison';
import { defaultFriend } from '../src/values/defaults';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from '@/firebase.config';

const Tab = createMaterialTopTabNavigator();

const FriendProfile = () => {
  const params = useLocalSearchParams();
  
  const [friendAdded, setFriendAdded] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    age: "",
    bowlingHand: "",
    favoriteBall: "",
    yearsBowling: "",
    highGame: "",
    highSeries: "",
    profilepic: "",
  });

  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [friendID, setFriendID] = useState("")
  const [fList, setFriends] = useState<Friend[]>([])
  const [newFriend, setNewFriend] = useState<Friend>()

  useEffect(() => {
    getFriendsList();
  }, []);

  const getParams = (usersFriends:Friend[])=>{
    if( Object.keys(params).length > 0){
      const {friend, friends, friendsList} = params as { 
        friend: string 
        friends: string; 
        friendsList?: string; 
      };
      
      // Parse the string back into a Friend object
      let parsedFriend: Friend = defaultFriend;
      parsedFriend = friend ? JSON.parse(friend) as Friend: defaultFriend;
      try {
        if(parsedFriend)
          setNewFriend(parsedFriend)
      } catch (error) {
        console.error("Error parsing friend data:", error);
      }

      // get friends list
      setActive(Boolean(parsedFriend.active))
      setProfileImage(getLocalImagePath(`${parsedFriend.username}.png`))
      getProfileData(parsedFriend.id)
      setFriendID(parsedFriend.id)
      setFriendAdded(usersFriends.some(user => user.id === parsedFriend.id))
    }else{
      console.log(`Parameters NOT found`)
    }
  }

  const getFriendsList = async () =>{
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) return;
    const docRef = doc(db, 'userFriends', currentUser.uid);
    const userDoc = await getDoc(docRef);
         
    if (userDoc.exists()) {
      const friendsList: Friend[] = userDoc.data().friendsList || [];
      setFriends(friendsList);
      getParams(friendsList);
    } else {
      console.log(`Failed to get friends list`)
    }
    setLoading(false);
        
  }
  const getProfileData = async (id:string)=> {
    const user = await fetchUserDataByID(id)
    if(user){
      setUserData(user)
    }
    else
      console.log(`User is null`)

    setLoading(false)
  }

  /**
   * 
   * @returns 
   */
  const removeFriend = async () =>{
    if (FIREBASE_AUTH.currentUser == null) return
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) return;
        try {
          const updatedFriends = fList.filter(f => f.id !== newFriend?.id);
          setFriends(updatedFriends);
          await updateDoc(doc(db, "userFriends", currentUser.uid), { friendsList: updatedFriends });
          setFriendAdded(false)
        } catch (error) {
          console.error("❌ Error removing friend:", error);
        }
  }

  const addFriend = async () => {
    if (FIREBASE_AUTH.currentUser == null) return

    try {
      if(!fList) return
      // Prevent adding duplicates
      if (fList.some(user => user.id === friendID)) {
        console.log("⚠ User is already in friends list.");
        return;
      }
      if(!newFriend)return;
      const updatedFriends = [...fList, newFriend];
      setFriends(updatedFriends);
      setFriendAdded(true)
      // Save to Firestore
      await setDoc(doc(db, "userFriends", FIREBASE_AUTH.currentUser.uid), { friendsList: updatedFriends });
    } catch (error) {
      console.error("❌ Error adding friend:", error);
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <View className='flex-1'>
        {/** Top Section. Profile picture, username, friends */}
        <View className='flex-row justify-between'>
          <View className='flex-row ml-5'>
            <Image 
              className={`w-48 h-48 rounded-full ${active ? 'border-orange': 'border-white'} border-4`}
              source={profileImage ? { uri: profileImage } : icons.profile}/>
            
            <Text className='text-white text-4xl font-pbold align-bottom mb-4'>{userData.username}</Text>
          </View>
          <View className='flex-row mr-5 mt-32'>
            <TouchableOpacity className='w-10 h-10' onPress={friendAdded ? removeFriend : addFriend}>
            <Image 
                className='w-10 h-10'
                style={friendAdded ? {tintColor:"#57FFFF"} : {tintColor:"#F24804"}}
                source={friendAdded ? icons.friendAdded : icons.addFriend}/>
            </TouchableOpacity>
            
          </View>
        </View>
        {/* Nested Top Tabs */}
        <View className='flex-1 h-full bg-primary mt-5'>
        <Tab.Navigator
          className='bg-primary w-full'
          screenOptions={{
            tabBarStyle: {
              backgroundColor: "#1E293B",
              borderRadius: 15,
              marginHorizontal: 10,
              marginTop: 5,
              borderTopLeftRadius: 20, // Rounded top-left corner
              borderTopRightRadius: 20, // Rounded top-right corner
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
            },
            tabBarLabelStyle: {
              fontSize: 20,
              fontWeight: "bold",
              textTransform: "capitalize", // Makes text look cleaner
            },
            tabBarIndicatorStyle: {
              backgroundColor: "#57FFFF", // Active tab indicator color
              height: 4, // Thicker indicator for better visibility
            },
            tabBarActiveTintColor: "#57FFFF", // Active tab text color
            tabBarInactiveTintColor: "white", // Inactive tab text color
          }}
          >
          <Tab.Screen name="Bio">
              {() => <Bio data={userData} editing={false}/>}
          </Tab.Screen>
          <Tab.Screen name="Stats">
          {() => <StatComparison friendID={friendID}/>}
          </Tab.Screen>
        </Tab.Navigator>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FriendProfile;
