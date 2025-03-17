import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View, Image } from "react-native";
import { Redirect, router, Tabs } from "expo-router";
import "../global.css";
import { images } from '../constants'
import CustomButton from "./components/buttons/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import {onAuthStateChanged, User} from "firebase/auth"
import { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "@/firebase.config";
import { fetchUserData } from "./hooks/firebaseFunctions";
import getAllStats from "./hooks/allStats";

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(()=>{
    clearAll()
  },[])
    const clearAll = async () => {
      try{
        fetchUserData()
        // await AsyncStorage.removeItem("BOWLINGSTATE")
        // await AsyncStorage.clear()
        // const directory = FileSystem.documentDirectory;
        // if (directory) {
        //   const fileList = await FileSystem.readDirectoryAsync(directory);
        //   fileList.forEach((file) =>{
        //     console.log(file)
        //   })
        // }
      } catch(e){
        console.error(e);
      }
  //console.log("DONE")
}
  useEffect(() =>{
    onAuthStateChanged(FIREBASE_AUTH, async (user)=>{
      setUser(user);
      const stats = await getAllStats();
            console.log(`Stats: ${JSON.stringify(stats)}`)
    })
  }, [])
  return (
    
  <SafeAreaView className="bg-primary h-full">
    <ScrollView contentContainerStyle={{height: '100%'}}>
    
      <View className="w-full justify-center items-center min-h-full px-4">
        <Image source={images.logo}
        className="w-[400px] h-[400]"
        resizeMode="contain"/>

        <View className="relative mt-5">
          <Text className="text-3xl text-white text-center">
            Know Your Game with {' '}
            <Text className="text-orange">GoBowl</Text>
          </Text>
          <Text className="text-sm font-plight text-gray-100 mb-5 mt-5 text-center">Statistics made simple</Text>
          <CustomButton
            title="Get Started"
            handlePress={() => {
              user? (router.push("/(tabs)/home")) : (router.push("/(auth)/sign-in"))
              }}
            isLoading={false}
            containerStyles={null}
            
          />
        </View>
      </View>
    </ScrollView>
    <StatusBar backgroundColor="#161622" style='light' />
  </SafeAreaView>);
}


