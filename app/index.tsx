import { StatusBar } from "expo-status-bar";
import {SafeAreaView, ScrollView, Text, View, Image } from "react-native";
import { Redirect, router, Tabs } from "expo-router";
import "../global.css";
import { images } from '../constants'
import CustomButton from "./components/CustomButton";

export default function RootLayout() {
  return (
  <SafeAreaView className="bg-primary h-full">
    <ScrollView contentContainerStyle={{height: '100%'}}>
      <View className="w-full justify-center items-center h-full px-4">
        <Image source={images.logo}
        className="w-[400px] h-[400]"
        resizeMode="contain"/>

        <View className="relative mt-5">
          <Text className="text-3xl text-white font-pblack text-center">
            Know Your Game with {' '}
            <Text className="text-orange">GoBowl</Text>
          </Text>
          <Text className="text-sm font-plight text-gray-100 mb-5 mt-5 text-center">Statistics made simple</Text>
          <CustomButton
            title="Get Started"
            handlePress={() => router.push("/(tabs)/home")}
          />
        </View>
      </View>
    </ScrollView>
    <StatusBar backgroundColor="#161622" style='light' />
  </SafeAreaView>);
}


