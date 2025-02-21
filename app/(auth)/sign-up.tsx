import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from '../../constants'
import FormField from '../components/FormField';
import CustomButton from '../components/buttons/CustomButton';
import { Link, router } from 'expo-router';
import { FIREBASE_AUTH, db } from '../../firebase.config'
import { createUserWithEmailAndPassword} from 'firebase/auth';
import { doc, setDoc} from "firebase/firestore"


const SignUP = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPass: '',
    username: '',
  })

const [passwordsMatch, setPasswordsMatch] = useState(true)
const [isSubmitting, setSubmitting] = useState(false)
const gameState = {
  frames: Array(10).fill(null).map(() => ({ roll1: '', roll2: '', roll3: '' })),
  currentFrame: 0,
  isFirstRoll: true
};
const Submit = async () => {
  setSubmitting(true)
  if (!passwordsMatch) return
  try{
    const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, form.email, form.password)


    await setDoc(doc(db, "users", response.user.uid),{
      username: form.username,
      email: form.email,
      id: response.user.uid,
      active: false,
      currentGame: gameState
    });
    router.replace('/home')
  } catch (error){
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
          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Create Account</Text>
            <FormField
                title="Username"
                value={form.username}
                handleChangeText={(e:any)=> setForm({...form,username: e})}
                oatherstyles="mt-5"
                placeholder=''
              />
            <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e:any)=> setForm({...form,email: e})}
                oatherstyles="mt-5"
                placeholder=''
              />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e:any)=> setForm({...form,password: e})}
              oatherstyles="mt-5"
              placeholder=''
              />
            <FormField
              title="Confirm Password"
              value={form.confirmPass}
              handleChangeText={(e:any)=> {
                setPasswordsMatch(form.password == e)
                setForm({...form,confirmPass: e})}
              }
              oatherstyles="mt-5"
              placeholder=''
            />
            <Text className='text-lg text-red-700 font-pregular'>
              {passwordsMatch ? '': 'Passwords don\'t match'}</Text>
            <CustomButton 
              title="Sign Up"
              handlePress={Submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
            <View className='justify-center pt-5 flex-row gap-2'>
              <Text className='text-lg text-gray-100 font-pregular'>Already have an account?</Text>
              <Link href="/(auth)/sign-in" className='text-lg font-psemibold text-orange'>Sign In</Link>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUP