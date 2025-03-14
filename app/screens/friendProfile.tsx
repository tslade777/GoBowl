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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Profile</Text>
          </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.content}>
           
            <Image source={profileImage ? { uri: profileImage } : icons.profile} style={styles.profileImage} />
          
          <Text style={styles.info}>Username: {userData.username}</Text>
          <Text style={styles.info}>Email: {userData.email}</Text>

          
            <>
              <Text style={styles.info}>Age: {userData.age}</Text>
              <Text style={styles.info}>Bowling Hand: {userData.bowlingHand}</Text>
              <Text style={styles.info}>Favorite Ball: {userData.favoriteBall}</Text>
              <Text style={styles.info}>Years Bowling: {userData.yearsBowling}</Text>
              <Text style={styles.info}>High Game: {userData.highGame}</Text>
              <Text style={styles.info}>High Series: {userData.highSeries}</Text>
            </>
          
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: 0,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: 16,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '80%',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 10 },
});

export default FriendProfile;
