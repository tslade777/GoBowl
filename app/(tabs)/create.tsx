import { View, Text, StyleSheet, Platform, ActionSheetIOS, Modal, TouchableWithoutFeedback, Animated, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import BowlingGameButton from "../components/buttons/BowlingGameButton";
import { Redirect, router, Tabs } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { db, FIREBASE_AUTH, firestore } from '@/firebase.config';
import { addDoc, collection, doc, Firestore, setDoc } from 'firebase/firestore';
import { format } from "date-fns";



const Create = () => {

const scale = useSharedValue(0);
const opacity = useSharedValue(0);
const [isRendered, setIsRendered] = useState(false);
const [isModalVisible, setIsModalVisible] = useState(false);

const [sessionType, setSessionType] = useState("Session");
const [sessionName, setSessionName] = useState("")
const [sessionDoc, setSessionDoc] = useState("")

// 🔹 Animated styles (Fixes direct value access in JSX)
const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  };
});

/**
 * Show options for either Practice, Open or Tournament modes.
 * 
 * @param type is the type of session being started. 
 */
  const showOptions = (type:string) => {
    console.log("🚀 Modal opening");
    setSessionType(type)
    setIsRendered(true);
    
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "View Profile", "Remove Friend"],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            //viewProfile(friend);
          } else if (buttonIndex === 2) {
            //removeFriend(friend);
          }
        }
      );
    } else {
      scale.value = 0.8;
      opacity.value = 0;
      setTimeout(() => {
        setIsModalVisible(true);
        scale.value = withSpring(1);
        opacity.value = withTiming(1);
      }, 50);
    }
  }

  /**
   * Close the popup window.
   */
  const closeModal = () => {

    console.log("🚀 Closing modal...");

    // ✅ Instantly hide the modal
    setIsModalVisible(false);
    setIsRendered(false);
  };

  const startFirebaseSession = async (): Promise<string> =>{
    console.log("📤 Session started on firebase")
    try{
      if (FIREBASE_AUTH.currentUser != null){
        let uID = FIREBASE_AUTH.currentUser.uid
        const docRef = await addDoc(collection(db, `${sessionType}Sessions`),{
          title: sessionName==''? format(new Date(), "EEEE, MMMM do, yyyy") : sessionName,
          date: new Date(),
          userID: uID, 
          games: [],
          stats:[],
          notes: "",
        })
        console.log(`🔴ID: ${docRef.id}🔴`)
        return docRef.id
      }
    }catch(e){
      console.log(e)
      return ''
    }
    return ''
  }

  /**
   * Either start a practice session or open session depending on the Session type
   * 
   * The 
   *
   */
  const startSession = async () =>{
    closeModal();
    console.log(`🎳 Going bowling! Session name=${sessionName}`)
    const id = await startFirebaseSession();
    console.log(`❄️ID: ${id}❄️`)
    router.push({
            pathname: "/game",
            params: {
              name: sessionName,
              id: id
            }
    })
  }
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className='flex flex-row flex-wrap mt-20 items-center justify-center'>
      <BowlingGameButton
            title="Practice"
            handlePress={() => showOptions("practice")}
          />
      <BowlingGameButton
            title="Open"
            handlePress={() => router.push("/(tabs)/home")}
          />
      <BowlingGameButton
            title="League"
            handlePress={() => router.push("/(tabs)/home")}
          />
      <BowlingGameButton
            title="Tournament"
            handlePress={() => router.push("/(tabs)/home")}
          />

      </View>
      {/* 📌 Modern Animated Modal for Android */}
        {isRendered &&  (
          <Modal visible={isModalVisible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={closeModal}>
              <View className="flex-1 justify-center items-center">
                <Animated.View 
                  className="bg-gray-300 p-6 opacity-2 rounded-3xl shadow-lg w-80"
                  style={animatedStyle}
                >
                  <Text className="text-3xl font-pbold text-center mb-4 text-black">
                  {`${sessionType} Session`}  {/* ✅ Prevents crash */}
                  </Text>
                  <TextInput
                          className="h-12 mb-2 border border-gray-300 rounded-2xl px-3 bg-white"
                          placeholder="Name the session? (optional)"
                          value={sessionName}
                          onChangeText={(newText)=>{setSessionName(newText)}}
                  />
                  <TouchableOpacity
                    className="bg-green-600 p-3 mb-2 rounded-xl"
                    onPress={startSession}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white text-center font-psemibold text-xl">Go Bowl!!</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-gray-700 p-3 rounded-xl"
                    onPress={closeModal}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white text-center font-psemibold text-lg">Cancel</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
    </SafeAreaView>
    
  )
}

export default Create