import { View, Text, FlatList, ActivityIndicator,  } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
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
  const navigation = useNavigation();
  const [friends, setFriends] = useState<{ id: string; username: string; active: boolean }[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [selectedItem, setSelectedItem] = useState<User>();
  const [loading, setLoading] = useState(true);
  const currentUser = FIREBASE_AUTH.currentUser;

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      showFriends();

      return () => {
        console.log("❌ Screen unfocused! Cleanup if needed.");
      };
    }, []))

  useEffect(() => {
    
    }, []);
    
    // Retrieve list of possible users to add
     // We must exclude current user from search options. 
    const fetchUserData = async () => {
      try {
        // Get the current userID
        const userID = currentUser == null ? '' : currentUser.uid
        
        const q = query(collection(db, 'users'))
        const querySnapshot = await getDocs(q);
        const usersList: User[] = querySnapshot.docs.map(doc => ({
          id: doc.data().id,
          username: doc.data().username,
          active: doc.data().active
        }));
        setUsersData(usersList);
      } catch (error) {
        console.error("Error fetching userNames: ", error);
      } finally {
        setLoading(false);
      }
    };

  const handleSelection = (item: User) => {
    setSelectedItem(item);
    addFriend(item)
  };

  const addFriend = async (item:User) =>{
    try{
      let updatedFriends = [...friends];
      updatedFriends.push(item)
      setFriends(updatedFriends)
      if (currentUser != null){
        await setDoc(doc(db,"userFriends", currentUser.uid),{
        friendsList: updatedFriends
        })
      }
    }
    catch(e){
      console.error(e)
    }
  };

  const showFriends = async () =>{
    try{
      const userID = currentUser == null ? '' : currentUser.uid
        
      const docRef = doc(db,'userFriends', userID)
      const subscribe = onSnapshot(docRef,(docSnap) =>{
        if(docSnap.exists()){
        const list = docSnap.data().friendsList;
        const sorted = list.sort((a:User,b:User)=>{
          return Number(b.active) - Number(a.active);
        });
        setFriends(sorted)
      }
      else{
        console.log("No such document!");
      }
      });
      
    }
    catch(e){// Assign the data
      console.error(e)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full p-4'>
      <Text className='text-3xl text-center text-white mb-4 font-psemibold'>My Friends</Text>
      <View className='flex flex-row flex-wrap mt-4 items-center justify-center'>
      <SearchBar data={usersData} onSelect={handleSelection} />
      </View>
      {loading ? (
        <ActivityIndicator size='large' color='#F24804' />
      ) : (
        <FlatList
          className='mt-10 border-t border-orange'
          data={friends}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator = {false}
          ItemSeparatorComponent={() => <View className="h-[2px] bg-orange m-1 " />}
          renderItem={({ item, index }) => (
            <View className={`flex-row bg-primary p-4 mb-3 
            rounded-lg shadow-md w-full justify-between items-center 
            `}>
              {/* Left Side (Name + Price) */}
              <View>
                <Text className="text-2xl font-pextrabold text-white">{item.username}</Text>
              </View>
              {/* Right Side (Green Circle) */}
              { item.active && <View className="w-6 h-6 bg-green-500 rounded-full" />}
            </View>
          )}
        />
      )} 
    </SafeAreaView>
  );
};

export default Friends;
