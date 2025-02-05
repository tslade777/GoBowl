import { View, Text, Image } from 'react-native'
import React from 'react'
import "../../global.css";
import { Tabs, Redirect} from 'expo-router'
import {icons} from '../../constants'
import { Colors } from 'react-native/Libraries/NewAppScreen';

const TabIcon = ({icon, color, focused}:{icon:any, color:any, focused:any}) => {
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
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#F24804',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            height: 60,
            borderTopColor: '#232533',
            justifyContent: 'center'
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{ 
            title: "Home",
            headerShown: false,
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
            title: "Create",
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
                icon={icons.profile}
                color={color}
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout