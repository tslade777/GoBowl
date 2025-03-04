import { View, Text, Animated, TextInput, TouchableOpacity, SafeAreaView, Modal, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from '@/firebase.config';
import { format } from 'date-fns';
import LeagueList from '../components/lists/LeagueList';
import { League } from '../src/constants/types';
import subscribeToLeagues from '../hooks/GetLeaguesByID';
import { startFirebaseSession } from '../hooks/firebaseFunctions';



const leagues = () => {
  const args = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current; // Scale animation
  const opacityAnim = useRef(new Animated.Value(0)).current; // Fade animation
  const [inputValue, setInputValue] = useState("");
  const [leagueData, setLeagueData] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
  }, []);
  /**
   * Get collection of leagues for this user
   * @returns 
   */
  const fetchData = async () =>{
    console.log('Fetching leagues')
    
    const unsubscribe = subscribeToLeagues((updatedLeagues) => {
      setLeagueData(updatedLeagues);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup when component unmounts
  }
  
  /**
   * Insert a new league into the users League collection, then take the newly generated
   * document id and update the league to hold this id value. It will make it much easier to 
   * get this league doc later. 
   */
  const createNewLeauge = async () => {
    try{
      if (FIREBASE_AUTH.currentUser != null){
        let uID = FIREBASE_AUTH.currentUser.uid
        const leageRef = collection(db, `leagueSessions`, uID, 'Leagues')
        const docRef = await addDoc(leageRef,{
          title: inputValue==''? format(new Date(), "EEEE, MMMM do, yyyy") : inputValue,
          weeks: 0,
          stats:[],
          notes: "",
          image: "",
          dateModified: new Date()
        })
        const newDocRef = doc(db, 'leagueSessions', uID, 'Leagues', docRef.id);
        await updateDoc(newDocRef,{
          leagueID: docRef.id
        })
        }
    }catch(e){
      console.error(e);
    }
  }

  const openModal = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false)); // Close modal after animation
  };

  /**
   * 
   * @param item League that was clicked
   */
  function handleLeaguePress(item: any): void {
    Alert.alert(
      'Start New Week', // Title
      `Ready to start week ${item.weeks+1}?`, // Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel', // Ensures a lighter style on iOS
        },
        {
          text: 'OK',
          onPress: async () => {
            // Start a new session and add it to the selected league.
            const sessionID = await startFirebaseSession(item.weeks+1, 'league', item.leagueID)
            router.push({
                        pathname: "../screens/game",
                        params: {
                          name: item.weeks+1,
                          id: sessionID,
                          leagueID: item.leagueID,
                          type: 'league'
                        }
                })
            console.log(`🔥 Session started ${sessionID}`)
          },
        },
      ],
      { cancelable: true } // Prevents dismissing by tapping outside
    );
    console.log(`League clicked: ${item.leagueID}`)
  }

  if (loading) {
    return <ActivityIndicator size="large" className="mt-10" />;
  }

  return (
    <SafeAreaView className="flex-1 justify-end items-end p-6 bg-primary h-full">
       {/* Floating Button */}
      {/* Floating Button */}
      <LeagueList data={leagueData} onItemPress={handleLeaguePress} />
      <TouchableOpacity
        className="absolute bottom-5 right-5 w-18 h-18 bg-orange rounded-full shadow-lg justify-center items-center"
        onPress={openModal}
      >
        <Ionicons name="add" size={70} color="white" />
      </TouchableOpacity>
      

      {/* Popup Modal */}
      <Modal transparent visible={modalVisible} onRequestClose={closeModal}>
        <View className="flex-1 justify-center items-center">
          {/* Background Overlay (Transparent Clickable Area) */}
          <TouchableOpacity 
            className="absolute w-full h-full" 
            activeOpacity={1} 
            onPress={closeModal} 
          />

          {/* Animated Popup */}
          <Animated.View
            className="bg-white bg-opacity-70 p-6 rounded-3xl w-80 shadow-lg"
            style={{
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }}
          >
            <Text className="text-2xl font-pbold mb-2">League Name:</Text>

            {/* User Input */}
            <TextInput
              placeholder="Type here..."
              value={inputValue}
              onChangeText={setInputValue}
              className="border border-gray-300 bg-gray-300 rounded-xl p-2 mb-4 w-full"
            />

            {/* Buttons */}
            <View className="flex-row justify-between">
              {/* Cancel Button */}
              <TouchableOpacity className="bg-red-600 px-4 py-2 rounded-xl" onPress={closeModal}>
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>

              {/* Start Button */}
              <TouchableOpacity
                className="bg-green-600 px-4  py-2 rounded-xl"
                onPress={() => {
                  console.log("Started with:", inputValue);
                  createNewLeauge();
                  closeModal();
                }}
              >
                <Text className="text-white font-semibold">Start</Text>
              </TouchableOpacity>
              
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
    
  );
};

export default leagues