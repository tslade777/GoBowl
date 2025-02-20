import { View, Text, FlatList, ActivityIndicator,  } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
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

  useEffect(() => {
    fetchUserData();
    showFriends();
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
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        setFriends(docSnap.data().friendsList)
      }
      else{
        console.log("No such document!");
      }
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
      {selectedItem  && (
            <Text className="text-4xl mt-4">Selected: {selectedItem.username}</Text>
          )}
      </View>
      {loading ? (
        <ActivityIndicator size='large' color='#F24804' />
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: '#333', padding: 10, margin: 5, borderRadius: 5 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.username}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Friends;
