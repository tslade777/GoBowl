import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from '../../constants'
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';
import { Link } from 'expo-router';




const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

const [isSubmitting, setSubmitting] = useState(false)

const Submit = () => {

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
            handleChangeText={(e:any)=> setForm({...form,password: e})}
            oatherstyles="mt-7"
            placeholder=''/>
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
    </SafeAreaView>
  )
}

export default SignIn