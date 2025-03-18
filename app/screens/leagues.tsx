import { View, Text, Animated, TextInput, TouchableOpacity, SafeAreaView, Modal, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from '@/firebase.config';
import { format } from 'date-fns';
import LeagueList from '../components/lists/LeagueList';
import { League } from '../src/values/types';
import subscribeToLeagues from '../hooks/GetLeaguesByID';
import { createNewLeauge, startFirebaseSession } from '../hooks/firebaseFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SESSIONS, SESSIONSTARTED } from '../src/config/constants';



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
    const unsubscribe = subscribeToLeagues((updatedLeagues) => {
      setLeagueData(updatedLeagues);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup when component unmounts
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
   * User has clicked a league to start bowling. give them a heads up before starting a new week for them
   * 
   * @param item League that was clicked
   */
  function handleLeaguePress(item: any): void {
    const weekNum = parseInt(item.weeks) + 1;
    Alert.alert(
      'Start New Week', // Title
      `Ready to start week ${weekNum}?`, // Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel', // Ensures a lighter style on iOS
        },
        {
          text: 'OK',
          onPress: async () => {
            try{
              // Start a new session and add it to the selected league.
              const sessionID = await startFirebaseSession(weekNum.toString(), SESSIONS.league, item.leagueID);
              await AsyncStorage.setItem(SESSIONSTARTED, JSON.stringify(true));
              router.push({
                          pathname: "../screens/game",
                          params: {
                            name: weekNum.toString(),
                            id: sessionID,
                            leagueID: item.leagueID,
                            type: SESSIONS.league
                          }
                  })
            }catch(e){
              console.error(`📛 League Session start error: ${e}`)
            }
          },
        },
      ],
      { cancelable: true } // Prevents dismissing by tapping outside
    );
  }

  if (loading) {
    return <ActivityIndicator size="large" className="mt-10" />;
  }

  return (
    <SafeAreaView className="flex-1 p-6 bg-primary h-full justify-center items-center">
      <Text className="text-white font-psemibold text-5xl">
        Leagues
      </Text>

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
      <TouchableOpacity 
        className="absolute w-full h-full" 
        activeOpacity={1} 
        onPress={closeModal} 
      />
      <Animated.View
        className="bg-white bg-opacity-70 p-6 rounded-3xl w-80 shadow-lg"
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <Text className="text-2xl font-pbold mb-2">League Name:</Text>
        <TextInput
          placeholder="Type here..."
          value={inputValue}
          onChangeText={setInputValue}
          className="border border-gray-300 bg-gray-300 rounded-xl p-2 mb-4 w-full"
        />
        <View className="flex-row justify-between">
          <TouchableOpacity className="bg-red-600 px-4 py-2 rounded-xl" onPress={closeModal}>
            <Text className="text-white font-semibold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-600 px-4 py-2 rounded-xl"
            onPress={() => {
              console.log("Started with:", inputValue);
              createNewLeauge(inputValue);
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