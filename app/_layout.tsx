import React, { useEffect } from 'react'
import { SplashScreen, Stack } from 'expo-router'
import {useFonts } from 'expo-font'
import "../global.css";



SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
      if(error) throw error;

      if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

if(!fontsLoaded && !error) return null;

  return (
      <Stack>
        <Stack.Screen name="index" options={{headerShown:
          false 
        }} />
        <Stack.Screen 
          name="screens/game" 
          options={{
            headerShadowVisible:false,
            headerTitleAlign:'center',
            title:"",
            headerStyle: {
              backgroundColor: '#161622'
            },
            headerTintColor: 'white'
          }}/>
          <Stack.Screen name="screens/statsScreen" options={{
          headerShadowVisible:false,
          title:"",
          headerStyle: {
            backgroundColor: '#161622'
          },
          headerTintColor: 'white'
          }}/>
          <Stack.Screen name="screens/leagues" options={{
          headerShadowVisible:false,
          title:"",
          headerStyle: {
            backgroundColor: '#161622'
          },
          headerTintColor: 'white'
          }}/>
          <Stack.Screen name="screens/leagueStats" options={{
          headerShadowVisible:false,
          title:"",
          headerStyle: {
            backgroundColor: '#161622'
          },
          headerTintColor: 'white'
          }}/>
          <Stack.Screen name="streamview" options={{
          headerShadowVisible:false,
          title:"",
          headerStyle: {
            backgroundColor: '#161622'
          },
          headerTintColor: 'white'
          }}/>
          <Stack.Screen name="screens/statsScreenLeagues" options={{
          headerShadowVisible:false,
          title:"",
          headerStyle: {
            backgroundColor: '#161622'
          },
          headerTintColor: 'white'
          }}/>
          <Stack.Screen name="screens/friendProfile" options={{
          headerShadowVisible:false,
          title:"",
          headerStyle: {
            backgroundColor: '#161622'
          },
          headerTintColor: 'white'
          }}/>
          <Stack.Screen 
            name="screens/previousGame" 
            options={{
            headerShadowVisible:false,
            title:"",
            headerStyle: {
              backgroundColor: '#161622'
            },
            headerTintColor: 'white'
          }}/>
          <Stack.Screen name="(auth)" options={{headerShown:
          false 
        }} />
        <Stack.Screen name="(tabs)" options={{headerShown:
          false 
        }} />
      </Stack>
  )
}


export default RootLayout