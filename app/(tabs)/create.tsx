import { View, Text, StyleSheet, Platform, ActionSheetIOS, Modal, TouchableWithoutFeedback, Animated, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import BowlingGameButton from "../components/buttons/BowlingGameButton";
import { Redirect, router, Tabs } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import {startFirebaseSession} from "@/app/hooks/firebaseFunctions"
import { ACTIVESESSION, INPROGRESS, SESSIONS, SESSIONSTARTED } from '../src/config/constants';
import { images } from '@/constants';



const Create = () => {

const scale = useSharedValue(0);
const opacity = useSharedValue(0);
const [isRendered, setIsRendered] = useState(false);
const [isModalVisible, setIsModalVisible] = useState(false);

const [sessionType, setSessionType] = useState("Session");
const [sessionName, setSessionName] = useState("")
const [requiredName, setRequiredName] = useState(false)

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
  const showOptions = async (stype:string) => {
    setSessionType(stype)
    const sessionStarted = await AsyncStorage.getItem(SESSIONSTARTED);
    const savedSession = await AsyncStorage.getItem(ACTIVESESSION);
    const started = sessionStarted ? JSON.parse(sessionStarted) : false;
      
    if(savedSession && started){
      const { sessionID,leagueID,name,type,numGames,gamesData,activeGame, seriesStats,localHighGame,localLowGame, } = JSON.parse(savedSession);
      // The session type clicked, is the currently active session, load it.
      console.log(`${stype} == ${type}`)
      if(stype == type){
        router.push({
          pathname: "../screens/game",
          params: {
            name: sessionName,
            id: sessionID,
            leagueID: leagueID,
            type: type
          }
        })
      }
      // The user is trying to start a new session while a different type is active.
      else{
        Alert.alert(
          'Resume', // Title
          `You've already started a ${type}! Resume?`, // Message
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel', // Ensures a lighter style on iOS
            },
            {
              text: 'Resume',
              onPress: async () => {
                router.push({
                  pathname: "../screens/game",
                  params: {
                    name: sessionName,
                    id: sessionID,
                    leagueID: leagueID,
                    type: type
                  }
                })
              },
            },
          ],
          { cancelable: true } // Prevents dismissing by tapping outside
        );
      }
    }
    else{
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
  }

  /**
   * Close the popup window.
   */
  const closeModal = () => {
    // ✅ Instantly hide the modal
    setSessionName("")
    setIsModalVisible(false);
    setIsRendered(false);
  };

  const handleRequired = () =>{
    console.log("checking required")
    if (sessionType==SESSIONS.league && sessionName==""){
      console.log("name required")
      setRequiredName(true);
    }
    else{
      console.log("Starting session")
      setRequiredName(false);
      startSession();
    }
  }

  const startLeagueSession = async () => {
    const sessionStarted = await AsyncStorage.getItem(SESSIONSTARTED);
    const savedSession = await AsyncStorage.getItem(ACTIVESESSION);
    const started = sessionStarted ? JSON.parse(sessionStarted) : false;
      
    if(savedSession && started){
      const { sessionID,leagueID,name,type,numGames,gamesData,activeGame,
        seriesStats,localHighGame,localLowGame, } = JSON.parse(savedSession);
        console.log(`${SESSIONS.league} == ${type}`)
        if(type == SESSIONS.league)
          router.push({
            pathname: "../screens/game",
            params: {
              name: name.toString(),
              id: sessionID,
              leagueID: leagueID,
              type: SESSIONS.league
            }
          })
        else{
          Alert.alert(
            'Resume', // Title
            `You've already started a ${type}! Resume?`, // Message
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel', // Ensures a lighter style on iOS
              },
              {
                text: 'Resume',
                onPress: async () => {
                  router.push({
                    pathname: "../screens/game",
                    params: {
                      name: sessionName,
                      id: sessionID,
                      leagueID: leagueID,
                      type: type
                    }
                  })
                },
              },
            ],
            { cancelable: true } // Prevents dismissing by tapping outside
          );
        }
    }
    else{
      router.push("../screens/leagues")
    }
  }
  /**
   * Either start a practice session or open session depending on the Session type
   *
   */
  const startSession = async () =>{
    await AsyncStorage.setItem(SESSIONSTARTED, JSON.stringify(true));
    closeModal();
    const id = await startFirebaseSession(sessionName, sessionType, '');
    console.log(`❄️ID: ${id}❄️`)
    router.push({
            pathname: "../screens/game",
            params: {
              name: sessionName,
              id: id,
              leagueID: '',
              type: sessionType
            }
    })
    setSessionName("")
  }
  
  return (
    <SafeAreaView className={"bg-primary h-full"}>
      <View className={'flex flex-row flex-wrap mt-20 items-center justify-center'}>
      <BowlingGameButton
            title="Practice"
            image={images.practice}
            handlePress={() => showOptions(SESSIONS.practice)}
          />
      <BowlingGameButton
            title="Open"
            image={images.practice}
            handlePress={() => showOptions(SESSIONS.open)}
          />
      <BowlingGameButton
            title="League"
            image={images.practice}
            handlePress={() => startLeagueSession()}
          />
      <BowlingGameButton
            title="Tournament"
            image={images.practice}
            handlePress={() => showOptions(SESSIONS.tournament)}
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
                  {`${sessionType}`}  {/* ✅ Prevents crash */}
                  </Text>
                  <TextInput
                          className="h-12 mb-2 border border-gray-300 rounded-2xl px-3 bg-white"
                          placeholder={`Name the session? ${sessionType==SESSIONS.tournament ? "(REQUIRED)" : "(optional)"}`}
                          value={sessionName}
                          placeholderTextColor={requiredName ? 'red' : 'grey'}
                          onChangeText={(newText)=>{setSessionName(newText)}}
                  />
                  <TouchableOpacity
                    className="bg-green-600 p-3 mb-2 rounded-xl"
                    onPress={handleRequired}
                    disabled={requiredName}
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
