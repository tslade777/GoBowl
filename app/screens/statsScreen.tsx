import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text } from "react-native";
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
        fetchData()
    }, []);

    const fetchData = async () =>{
      const sessions = await getSessions(type);
      setSessionData(sessions)
    }

    return (
      <View className="flex-1 bg-primary">
        {/* Page Title */}
        <View className="py-4 px-6 justify-center items-center bg-blue-500">
          <Text className="text-orange text-3xl font-pbold">{title} Stats</Text>
        </View>
  
        {/* Nested Top Tabs */}
        <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#1E293B",
            borderRadius: 15,
            marginHorizontal: 10,
            marginTop: 5,
            borderTopLeftRadius: 20, // Rounded top-left corner
            borderTopRightRadius: 20, // Rounded top-right corner
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          },
          tabBarLabelStyle: {
            fontSize: 20,
            fontWeight: "bold",
            textTransform: "capitalize", // Makes text look cleaner
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#F24804", // Active tab indicator color
            height: 4, // Thicker indicator for better visibility
          },
          tabBarActiveTintColor: "#F24804", // Active tab text color
          tabBarInactiveTintColor: "white", // Inactive tab text color
        }}
      >
          <Tab.Screen name="Stats">
              {() => <StatsTab sessionData={sessionData} />}
          </Tab.Screen>
          <Tab.Screen name="Sessions">
          {() => <SessionsTab sessionsData={sessionData} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    );
  };

export default StatsScreen