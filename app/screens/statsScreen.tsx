import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text } from "react-native";
import { useNavigation } from "expo-router";
import StatsTab from "../components/Tabs/stats";
import SessionsTab from "../components/Tabs/sessions";
import { LinearGradient } from "expo-linear-gradient";
import { Series } from "@/app/src/types";
import { db, FIREBASE_AUTH } from "@/firebase.config";
import { collection, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";

const Tab = createMaterialTopTabNavigator();



const StatsScreen = () => {
    const [sessionData, setSessionData] = useState<Series[]>([]);
    const navigation = useNavigation();
    
      useEffect(() => {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) {
          console.warn("No user logged in.");
          return;
      }

      // Firestore query to filter by user ID and order by date
      const q = query(
          collection(db, "practiceSessions"),
          where("userID", "==", currentUser.uid),
          orderBy("date", "desc") // Order newest first
      );

      // Subscribe to Firestore updates in real-time
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const sessions: Series[] = querySnapshot.docs.map((doc) => {
              const data = doc.data();

              return {
                  id: doc.id,
                  date: data.date ? (data.date as Timestamp).toDate() : new Date(),
                  games: Array.isArray(data.games) ? data.games : [],
                  notes: data.notes || "",
                  title: data.title || "No Title",
                  userID: data.userID || "",
                  stats: data.stats ? data.stats : [],
              };
          });

          setSessionData(sessions); // Update state with real-time data
          console.log(`Fetched ${sessions.length} practice sessions.`);
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    }, []);

// useEffect (()=>{
//   sessionData.forEach((session)=>{
//     console.log(session.stats)
//   })
// },[sessionData])

    return (
      <View className="flex-1 bg-primary">
        {/* Page Title */}
        <View className="py-4 px-6 bg-blue-500">
          <Text className="text-white text-2xl font-psemibold">Practice Stats and Games</Text>
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