import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import Stream, { StreamRef } from './components/streamview/Stream';
import icons from '@/constants/icons';
import { checkIfImageExists, getLocalImagePath } from './hooks/ImageFunctions';
import { removeFirebaseWatching, setFirebaseWatching } from './hooks/firebaseFunctions';
import { Friend } from './src/values/types';


const StreamView = () => {
    const params = useLocalSearchParams(); // Get paramaters passed in.
    const id = params.id as string;
    const username = params.username as string
    const isActive = params.active === "true"; // Convert string to boolean
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const childRef = useRef<StreamRef>(null);

    /**
     * Get the users Profile picture
     */
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
      setFirebaseWatching(id)

      return ()=>{
        removeFirebaseWatching(id)
      }
      
    }, []);

    const next = () =>{
      console.log(`Next Game`)
      console.log(childRef.current)
      childRef.current?.nextGame()
    }

    const previous = () =>{
      console.log(`Previous Game`)
      console.log(childRef.current)
      childRef.current?.previousGame()
    }

    const showProfile = () =>{
      router.push({
              pathname: "/screens/friendProfile",
              params: {
                id: id,
                profilePic: profileImage,
                username: username,
                friends: 'true',
                live: isActive.toString()
              }
            })
    }

  return (
    <SafeAreaView className="flex-column bg-primary h-full w-full">
      <View className="items-center">
        
          <TouchableOpacity onPress={()=>{showProfile()}}>
            <View className="flex-row items-center space-x-3 mb-3">
              <Image
                source={profileImage ? {uri:profileImage} : icons.profile}
                className="w-16 h-16 rounded-full mr-2"
              />
              <Text className="text-white ml-3 text-3xl font-pbold">{username}</Text>
            </View>
          </TouchableOpacity>
          
          
        
        <View className="h-full">
          <Stream ref={childRef} id={id} username={username} active={isActive}/>
        </View>
        
      </View>
      <TouchableOpacity 
            onPress={next} 
            className="absolute bottom-6 right-6 mr-5 px-1 py-2 rounded-lg"
            >
            <Image source={icons.next}
              className='w-10 h-10'
              resizeMode='contain'
              style={{tintColor: "white"}}/>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={previous} 
            className="absolute bottom-6 left-6 mr-5 px-1 py-2 rounded-lg"
            >
            <Image source={icons.previous}
              className='w-10 h-10'
              resizeMode='contain'
              style={{tintColor: "white"}}/>
          </TouchableOpacity>
    </SafeAreaView>
  )
}

export default StreamView