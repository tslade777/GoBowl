import React, { useEffect } from 'react'
import { SplashScreen, Stack } from 'expo-router'
import {useFonts } from 'expo-font'
import "../global.css";
import Toast from 'react-native-toast-message';
import toastConfig from '@/toastConfig';

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
    <>
      <Stack screenOptions={{
        animation: "slide_from_right",
  }}>
        
        <Stack.Screen name="index" options={{headerShown:
          false 
        }} />
        <Stack.Screen 
          name="screens/game" 
          options={{
            
            presentation: 'transparentModal',
            headerShadowVisible:false,
            headerTitleAlign:'center',
            title:"",
            headerStyle: {
              backgroundColor: '#161622'
            },
            headerTintColor: 'white'
          }}/>
          <Stack.Screen 
          name="screens/endSessionStats" 
          options={{
           
            presentation: 'transparentModal',
            headerShadowVisible:false,
            headerTitleAlign:'center',
            title:"",
            headerStyle: {
              backgroundColor: '#161622'
            },
            headerTintColor: 'white'
          }}/>
          <Stack.Screen 
          name="screens/historySessionStats" 
          options={{
           
            presentation: 'transparentModal',
            headerShadowVisible:false,
            headerTitleAlign:'center',
            title:"",
            headerStyle: {
              backgroundColor: '#161622'
            },
            headerTintColor: 'white'
          }}/>
          <Stack.Screen name="screens/statsScreen" options={{
         
          presentation: 'transparentModal',
          headerShadowVisible:false,
          title:"",
          headerStyle: {
            backgroundColor: '#161622'
          },
          headerTintColor: 'white'
          }}/>
          <Stack.Screen name="screens/leagues" options={{
            
            presentation: 'transparentModal',
          headerShadowVisible:false,
          title:"",
          headerStyle: {
            backgroundColor: '#161622'
          },
          headerTintColor: 'white'
          }}/>
          <Stack.Screen name="screens/leagueStats" options={{
            presentation: 'transparentModal',
          headerShadowVisible:false,
          title:"",
          headerStyle: {
            backgroundColor: '#161622'
          },
          headerTintColor: 'white'
          }}/>
          <Stack.Screen name="streamview" options={{
            presentation: 'transparentModal',
          headerShadowVisible:false,
          title:"",
          headerStyle: {
            backgroundColor: '#161622'
          },
          headerTintColor: 'white'
          }}/>
          <Stack.Screen name="screens/statsScreenLeagues" options={{
            presentation: 'transparentModal',
          headerShadowVisible:false,
          title:"",
          headerStyle: {
            backgroundColor: '#161622'
          },
          headerTintColor: 'white'
          }}/>
          <Stack.Screen name="screens/friendProfile" options={{
            presentation: 'transparentModal',
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
              presentation: 'transparentModal',
            headerShadowVisible:false,
            title:"",
            headerStyle: {
              backgroundColor: '#161622'
            },
            headerTintColor: 'white'
          }}/>
          <Stack.Screen name="(auth)" options={{headerShown:
          false,
          presentation: 'transparentModal',
        }} />
        <Stack.Screen name="(tabs)" options={{headerShown:
          false,
          presentation: 'transparentModal',
        }} />
      </Stack>
       <Toast config={toastConfig}/>
    </>
      
  )
}


export default RootLayout