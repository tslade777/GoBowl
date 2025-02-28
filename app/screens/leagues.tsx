import { View, Text, Animated, TextInput, TouchableOpacity, SafeAreaView, Modal } from 'react-native'
import React, { useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from '@/firebase.config';
import { format } from 'date-fns';


const leagues = () => {
  const args = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current; // Scale animation
  const opacityAnim = useRef(new Animated.Value(0)).current; // Fade animation
  const [inputValue, setInputValue] = useState("");

  const createNewLeauge = async () => {
    if (FIREBASE_AUTH.currentUser != null){
     let uID = FIREBASE_AUTH.currentUser.uid
    const leageRef = collection(db, `leagueSessions`, uID, 'Leagues')
              const docRef = await addDoc(leageRef,{
                title: inputValue==''? format(new Date(), "EEEE, MMMM do, yyyy") : inputValue,
                weeks: [],
                stats:[],
                notes: "",
                image: "",
              })
      console.log(docRef.id) 
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

  return (
    <SafeAreaView className="flex-1 justify-end items-end p-6 bg-primary h-full">
       {/* Floating Button */}
      {/* Floating Button */}
      <TouchableOpacity
        className="w-18 h-18 bg-orange rounded-full shadow-lg justify-center items-center"
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
            className="bg-gray-300 bg-opacity-70 p-6 rounded-3xl w-80 shadow-lg"
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
              className="border border-gray-300 bg-white rounded-xl p-2 mb-4 w-full"
            />

            {/* Buttons */}
            <View className="flex-row justify-between">
              {/* Cancel Button */}
              <TouchableOpacity className="bg-gray-400 px-4 py-2 rounded-xl" onPress={closeModal}>
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>

              {/* Start Button */}
              <TouchableOpacity
                className="bg-blue px-4 py-2 rounded-xl"
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