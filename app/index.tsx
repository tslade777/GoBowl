import { StatusBar } from "expo-status-bar";
import {Text, View } from "react-native";
import { Link } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-4xl font-pblack"> GoBowl </Text>
            <StatusBar style='auto'/>
            <Link href="/home" style={{color: 'blue'}}>Go Home</Link>
          </View>;
}


