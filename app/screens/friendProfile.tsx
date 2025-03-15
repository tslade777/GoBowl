import { View, Text, Button, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getStorage } from 'firebase/storage';
import "../../global.css";
import { FIREBASE_AUTH, db } from '@/firebase.config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { icons } from '@/constants';
import { getLocalImagePath, handleImageSelection } from '../hooks/ImageFunctions';
import { UserData } from '../src/values/types';
import { getFromStorage } from '../hooks/userDataFunctions';
import { fetchUserDataByID } from '../hooks/firebaseFunctions';

const FriendProfile = () => {
  const params = useLocalSearchParams();
  const currentUser = FIREBASE_AUTH.currentUser;
  const storage = getStorage();
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
  const [editing, setEditing] = useState(false);
  const [originalData, setOriginalData] = useState(userData);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if( Object.keys(params).length > 0){
      const id = params.id as string;
      const username = params.username as string
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
      <View className='flex-col'>
        <View className='flex-row justify-between'>
          <View className='flex-row ml-5'>
            <Image 
              className='w-48 h-48 rounded-full border-orange border-4'
              source={profileImage ? { uri: profileImage } : icons.profile}/>
            
            <Text className='text-white text-4xl font-pbold align-bottom mb-4'>{userData.username}</Text>
          </View>
          <View className='flex-row mr-5 mt-32'>
            <Image 
                className='w-10 h-10'
                style={{tintColor:'teal'}}
                source={icons.friendAdded}/>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FriendProfile;
