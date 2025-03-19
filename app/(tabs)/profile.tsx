import { View, Text, Button, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getStorage } from 'firebase/storage';
import "../../global.css";
import { FIREBASE_AUTH, db } from '@/firebase.config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { icons } from '@/constants';
import { getLocalImagePath, handleImageSelection } from '../hooks/ImageFunctions';
import { SeriesStats, UserData } from '../src/values/types';
import { getFromStorage } from '../hooks/userDataFunctions';
import { fetchUserDataByID } from '../hooks/firebaseFunctions';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import StatComparison from '../components/Tabs/statComparison';
import Bio from '../components/Tabs/bio';
import ProfileBio from '../components/Tabs/profileBio';
import getAllStats from '../hooks/allStats';
import { defaultSeriesStats } from '../src/values/defaults';
import ProfileStats from '../components/Tabs/profileStats';

const Tab = createMaterialTopTabNavigator();
const { width, height } = Dimensions.get("window"); // Get screen size
const editButtonMarginTop = 5; // Adjust based on screen size

const Profile = () => {
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
  const [editedData, setEditedData] = useState<UserData>({ ...userData });
  const [statData, setStatData] = useState<SeriesStats>(defaultSeriesStats)

  useEffect(() => {
    getUserData()
    
  }, []);

  const getUserData = async ()=> {
    const stats = await getAllStats();
    setStatData(stats)
    const user = await getFromStorage()
    if(user){
      setProfileImage(getLocalImagePath(`${user.username}.png`))
      setUserData(user)
      setEditedData(user)
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

  const handleEditToggle = () => {
    // Save
    if (editing){
      setEditing(false)
      setUserData(editedData);
      handleSaveChanges(editedData);
    }
    // edit
    else{
      setEditing(true)
    }
  };
  
  const handleCancelEdit = () => {
    setUserData(originalData);
    setEditing(false);
  };

  const handleSaveChanges = async (editedData:UserData) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, `users/${currentUser.uid}`);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const storedData = userDoc.data();
        const newData = {
          age: parseInt(editedData.age) || 0,
          bowlingHand: editedData.bowlingHand,
          favoriteBall: editedData.favoriteBall,
          yearsBowling: parseInt(editedData.yearsBowling) || 0,
          highGame: parseInt(editedData.highGame) || 0,
          highSeries: parseInt(editedData.highSeries) || 0,
        };
  
        const isSame = (Object.keys(newData) as Array<keyof typeof newData>).every(
          (key) => storedData[key] === newData[key]
        );
  
        if (isSame) {
          setEditing(false);
          return;
        }
  
        await updateDoc(userRef, newData);
        setEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  

  const handleLogout = async () => {
    try {
      if (currentUser) {
        const userRef = doc(db, `users/${currentUser.uid}`);
        await updateDoc(userRef, { active: false });
      }
      console.log("User logged out successfully");
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const handleUserDataChange = (field: keyof UserData, value: string) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value, // Update only when needed
    }));
    
  };

  /**
   * Select an upload image to firebase
   */
  const selectAndUploadImage = async () => {
    const result = await handleImageSelection(`profileImages/${currentUser?.uid}`, userData.username);
    if (result) {
      setProfileImage(result.localPath)
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <View className='flex-1 mt-2'>
        {/** Top Section. Profile picture, username, friends */}
        <View className='flex-row justify-between'>
          <View className='flex-row ml-5'>
            <Image 
              className={`border-white border-4`}
              resizeMode='contain'
              style={{ width: width * 0.3, height: width * 0.3, borderRadius: width * 0.2 }}
              source={profileImage ? { uri: profileImage } : icons.profile}/>
              <TouchableOpacity className={`absolute w-10 h-10`} onPress={selectAndUploadImage}>
              <Image
              className={`w-10 h-10`}
                resizeMode='contain'
                source={icons.addImage}/>
              </TouchableOpacity>
              
            
            <Text className='text-white text-4xl font-pbold align-bottom mb-4'>{userData.username}</Text>
          </View>
          <View className='flex-row mr-5'>
            <TouchableOpacity onPress={()=>{handleEditToggle()}} style={{ marginTop: editButtonMarginTop }}>
              <Image 
                  className='w-8 h-8 mt-2'
                  style={{tintColor:"#57FFFF"}}
                  source={editing ? icons.save : icons.editProfile}/>
            </TouchableOpacity>
          </View>
        </View>
        {/* Nested Top Tabs */}
        <View className='flex-1 h-full bg-primary mt-5'>
        <Tab.Navigator
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
              {() => <ProfileBio data={userData} editing={editing} onUpdate={handleUserDataChange}/>}
          </Tab.Screen>
          <Tab.Screen name="Total Stats">
          {() => <ProfileStats data={statData}/>}
          </Tab.Screen>
        </Tab.Navigator>
        </View>
        <View>
        <TouchableOpacity 
          onPress={handleLogout} 
          className="bg-red-500 px-4 py-2 rounded-2xl mx-2 mb-2"
        >
          <Text className="text-white text-center text-xl font-pbold">Logout</Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
