import { View, Text, Image, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import "../../global.css";
import { Tabs, Redirect, Stack} from 'expo-router'
import {icons} from '../../constants'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { getLocalImagePath } from '../hooks/ImageFunctions';
import { getFromStorage } from '../hooks/userDataFunctions';

const TabIcon = ({icon, color, focused}:{icon:any, color?:any, focused:any}) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image 
        source = {icon}
        resizeMode='contain'
        tintColor={color}
        className='w-7 h-7'
      />
    </View> 
  )
}
const TabsLayout = () => {

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    getUserData();
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const getUserData = async ()=> {
    const user = await getFromStorage()
    if(user){
      setProfileImage(getLocalImagePath(`${user.username}.png`))
    }
    else
      console.log(`User is null`)
  }

  return (
    <>
      <Stack.Screen name="index" options={{headerShown:false}}/>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#F24804',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            height: 60,
            borderTopColor: '#232533',
            justifyContent: 'center',
            display: isKeyboardVisible ? "none" : "flex"
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{ 
            headerShown: false,
            title: "Home",
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.home}
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{ 
            title: "Stats",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.stats}
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="create"
          options={{ 
            title: "GoBowl",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.plus}
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="friends"
          options={{ 
            title: "Friends",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.friends}
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{ 
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={profileImage ? { uri: profileImage } : icons.profile}
                focused={focused}
                color={profileImage ? null : color}
              />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout