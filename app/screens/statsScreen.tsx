import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import StatsTab from "../components/Tabs/stats";
import SessionsTab from "../components/Tabs/sessions";
import { Series } from "@/app/src/values/types";
import {getSessions} from "../hooks/firebaseFunctions";
import { SESSIONS } from "../src/config/constants";

const Tab = createMaterialTopTabNavigator();

const StatsScreen = () => {
    const params = useLocalSearchParams();
    const type = params.type as string;
    let title = type.slice(0, -8);
    title = title.charAt(0).toUpperCase() + title.slice(1);
    const [sessionData, setSessionData] = useState<Series[]>([]);
    
      useEffect(() => {
        // TODO: Create loading for fetching data
        fetchData()
    }, []);

    const fetchData = async () =>{
      const sessions = await getSessions(type);
      setSessionData(sessions)
    }
  
    if (!sessionData) {
      return <ActivityIndicator size="large" color="#F24804" />;
    }

    return (
      <SafeAreaView className="flex-1 bg-primary h-full">
        <View className="flex-1 bg-primary">
        {/* Page Title */}
        <View className="py-4 px-6 justify-center items-center bg-blue-500">
          <Text className="text-orange text-3xl font-pbold">{title} Stats</Text>
        </View>
  
        {/* Nested Top Tabs */}
        <Tab.Navigator
          screenOptions={{
            lazy: true, // Lazy load tabs (fixes freezing issues)
            tabBarStyle: { backgroundColor: "#1E293B", borderRadius: 15, marginHorizontal: 10, marginTop: 5 },
            tabBarLabelStyle: { fontSize: 20, fontWeight: "bold", textTransform: "capitalize" },
            tabBarIndicatorStyle: { backgroundColor: "#F24804", height: 4 },
            tabBarActiveTintColor: "#F24804",
            tabBarInactiveTintColor: "white",
          }}
        >
          <Tab.Screen name="Stats">{() => <StatsTab sessionData={sessionData} />}</Tab.Screen>
          <Tab.Screen name="Sessions">{() => <SessionsTab sessionsData={sessionData} type={type} leagueID={""}/>}</Tab.Screen>
        </Tab.Navigator>
      </View>
      </SafeAreaView>
    );
  };

export default StatsScreen