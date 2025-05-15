import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from '../../constants'
import FormField from "@/src/components/froms/FormField";
import CustomButton from '@/src/components/buttons/CustomButton';
import { Link, router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase.config';




const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

const [isSubmitting, setSubmitting] = useState(false)
const [failedSignin, setFailed] = useState(false)

const Submit = async () => {
  setSubmitting(true)
  try{
    const response = await signInWithEmailAndPassword(FIREBASE_AUTH, form.email, form.password)
    setSubmitting(false)
    router.replace('/home')
  } catch (error){
    setFailed(true)
    setSubmitting(false)
    console.log(`Failed to log in. Error: ${error}`)
  }
}
  return (
    <SafeAreaView className='bg-primary h-full '>
      <ScrollView>
        <View className='w-full justify-center h-full px-4 my-6 '>
          <Image source={images.logo}
          resizeMode='contain' className='w-[200px] h-[200px]'/>
          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Log in to GoBowl</Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e:any)=> setForm({...form,email: e})}
            oatherstyles="mt-7"
            placeholder=''
            />
            
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e:any)=> {
              setFailed(false)
              setForm({...form,password: e})}}
            oatherstyles="mt-7"
            placeholder=''/>
            <Text className='text-lg text-red-700 font-pregular'>{failedSignin ? 'Sign-in failed, try again.': ''}</Text>
            <CustomButton 
              title="Sign In"
              handlePress={Submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
            <View className='justify-center pt-5 flex-row gap-2'>
              <Text className='text-lg text-gray-100 font-pregular'>Dont have account?</Text>
              <Link href="/(auth)/sign-up" className='text-lg font-psemibold text-orange'>Sign Up</Link>
            </View>
            
        </View>
      </ScrollView>
      {isSubmitting ? <ActivityIndicator 
            className='absolute top-1/2 left-1/2' size='large' color='#F24804' /> : <></>}
    </SafeAreaView>
  )
}

export default SignIn