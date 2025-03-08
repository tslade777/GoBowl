import { View, Text, SafeAreaView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import Stream from './components/streamview/Stream';
import icons from '@/constants/icons';
import { checkIfImageExists, getLocalImagePath } from './hooks/ImageFunctions';


const StreamView = () => {
    const params = useLocalSearchParams(); // Get paramaters passed in.
    const id = params.id as string;
    const username = params.username as string
    const isActive = params.active === "true"; // Convert string to boolean
    const [profileImage, setProfileImage] = useState<string | null>(null);


    useEffect(() => {
      const getProfilePic = async () =>{
        if( await checkIfImageExists(`${username}.png`)){
          setProfileImage(getLocalImagePath(`${username}.png`))

        }
        else {
          console.log('📛 Image not found')
          setProfileImage(null)
        }
      }
      getProfilePic()
      
    }, []);

    //console.log(`📸 Image path: ${profilePic}`)
  return (
    <SafeAreaView className="flex-1 bg-primary h-full">
      <View className="items-center">
        <View className="flex-row items-center space-x-3 mb-3">
          <Image
            source={profileImage ? {uri:profileImage} : icons.profile}
            className="w-16 h-16 rounded-full mr-2"
          />
          <Text className="text-white ml-3 text-3xl font-pbold">{username}</Text>
        </View>
        <Stream id={id} username={username} active={isActive}/>
      </View>
    </SafeAreaView>
  )
}

export default StreamView