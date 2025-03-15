import { View, Text, Button, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { icons } from '@/constants';
import { getLocalImagePath, handleImageSelection } from '../hooks/ImageFunctions';
import { UserData } from '../src/values/types';
import { getFromStorage } from '../hooks/userDataFunctions';
import { fetchUserDataByID } from '../hooks/firebaseFunctions';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Bio from '../components/Tabs/bio';
import StatComparison from '../components/Tabs/statComparison';

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

  useEffect(() => {
    if( Object.keys(params).length > 0){
      const id = params.id as string;
      const username = params.username as string
      const live = params.active as unknown as Boolean
      const friends = params.friends as string
      setActive(Boolean(live))
      setFriendAdded(friends=="true")
      setProfileImage(getLocalImagePath(`${username}.png`))
      getProfileData(id)
    }else{
      console.log(`Parameters NOT found`)
      getUserData()
    }
  }, []);

  const getUserData = async ()=> {
    const user = await getFromStorage()
    if(user){
      setProfileImage(getLocalImagePath(`${user.username}.png`))
      setUserData(user)
    }
    else
      console.log(`User is null`)

    setLoading(false)
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
            <Image 
                className='w-10 h-10'
                style={friendAdded ? {tintColor:"#57FFFF"} : {tintColor:"#F24804"}}
                source={friendAdded ? icons.friendAdded : icons.addFriend}/>
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
          {() => <StatComparison/>}
          </Tab.Screen>
        </Tab.Navigator>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FriendProfile;
