import React, { useEffect } from 'react'
import { SplashScreen, Stack } from 'expo-router'
import {useFonts } from 'expo-font'
import Toast from 'react-native-toast-message';
import toastConfig from '@/toastConfig';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("@/src/assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("@/src/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("@/src/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("@/src/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("@/src/assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("@/src/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("@/src/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("@/src/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("@/src/assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
      if(error) throw error;

      if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

if(!fontsLoaded && !error) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}


export default RootLayout