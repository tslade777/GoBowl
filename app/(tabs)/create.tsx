import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import BowlingGameButton from "../components/BowlingGameButton";
import { Redirect, router, Tabs } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Create = () => {
  useEffect(()=>{
      //clearAll()
    },[])
  const clearAll = async () => {
    try{
      await AsyncStorage.removeItem("BOWLINGSTATE")
    } catch(e){
      console.error(e);
    }
    console.log("DONE")
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className='flex flex-row flex-wrap mt-20 items-center justify-center'>
      <BowlingGameButton
            title="Practice"
            handlePress={() => router.push("/game")}
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
    </SafeAreaView>
    
  )
}

export default Create