import { View, Text,  TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import React, { Suspense, useEffect, useState } from 'react';
import "../../global.css";
import { FIREBASE_AUTH, db } from '@/firebase.config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { router} from 'expo-router';
import { icons } from '@/constants';
import { getLocalImagePath, handleImageSelection } from '../hooks/ImageFunctions';
import { SeriesStats, UserData } from '../src/values/types';
import { getFromStorage } from '../hooks/userDataFunctions';
import getAllStats from '../hooks/allStats';
import { defaultSeriesStats } from '../src/values/defaults';
import ProfileBio from '../components/Tabs/profileBio';
import ProfileStats from '../components/Tabs/profileStats';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const { width, height } = Dimensions.get("window"); // Get screen size
const editButtonMarginTop = 5; // Adjust based on screen size

const Profile = () => {
  const currentUser = FIREBASE_AUTH.currentUser;
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
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<UserData>({ ...userData });
  const [statData, setStatData] = useState<SeriesStats>(defaultSeriesStats)

  useEffect(() => {
    let isMounted = true;

    const getUserData = async () => {
      try {
        console.error("Fetching user data...");
        const stats = await getAllStats();
        console.error(`Stats retrieved: ${JSON.stringify(stats)}`)
        if (isMounted) setStatData(stats);

        const user = await getFromStorage();
        console.error(`User found: ${JSON.stringify(user)}`)
        if (isMounted && user) {
          setProfileImage(getLocalImagePath(`${user.username}.png`));
          setUserData(user);
          setEditedData(user);
        }

        if (!isMounted) return;
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();

    return () => {
      isMounted = false; // Prevent state update after unmount
    };
    
  }, []);

  const getUserData = async ()=> {
    console.error(`Getting Data`)
    const stats = await getAllStats();
    console.error(`Stats retrieved: ${JSON.stringify(stats)}`)
    setStatData(stats)
    const user = await getFromStorage()
    if(user){
      setProfileImage(getLocalImagePath(`${user.username}.png`))
      setUserData(user)
      setEditedData(user)
      console.error(`User found: ${JSON.stringify(user)}`)
    }
    else
      console.error(`User is null`)

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
      console.error("User logged out successfully");
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
        <Suspense fallback={<ActivityIndicator size="large" color="#F24804" />}>
        <Tab.Navigator
          screenOptions={{
            lazy: true, // Lazy load tabs (fixes freezing issues)
            tabBarStyle: { backgroundColor: "#1E293B", borderRadius: 15, marginHorizontal: 10, marginTop: 5 },
            tabBarLabelStyle: { fontSize: 20, fontWeight: "bold", textTransform: "capitalize" },
            tabBarIndicatorStyle: { backgroundColor: "#F24804", height: 4 },
            tabBarActiveTintColor: "#F24804",
            tabBarInactiveTintColor: "white",
          }}
          >
          <Tab.Screen name="Bio">
              {() => <ProfileBio data={userData} editing={editing} onUpdate={handleUserDataChange}/>}
          </Tab.Screen>
          <Tab.Screen name="Total Stats">
          {() => <ProfileStats data={statData}/>}
          </Tab.Screen>
        </Tab.Navigator>
        </Suspense>
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
