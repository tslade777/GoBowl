import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import {icons, images} from '../../constants'

const FormField = ({title, value, placeholder, handleChangeText, oatherstyles, ...props}:
    {title:any, value:any, placeholder:any, handleChangeText:any, oatherstyles:any}) => {

const [showPassword, setShowPass] = useState(false)
  return (
    <View className={`space-y-2 ${oatherstyles}`}>
      <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>
        <View className='w-full h-16 px-4 bg-black-100 border-2 black-200
            rounded-2xl focus:border-secondary-100 items-center flex-row'>
            <TextInput 
                className='flex-1 text-white font-psemibold text-base'
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#7b7b8b"
                onChangeText={handleChangeText}
                secureTextEntry={(title === 'Password' || title === 'Confirm Password') && !showPassword}
                />

            {(title === 'Password'|| title === 'Confirm Password') && (
                <TouchableOpacity onPress={() => 
                setShowPass(!showPassword)}>
                    <Image source={!showPassword ? icons.eye : icons.eyeHide} 
                    className='w-6 h-6' 
                    resizeMode='contain'/>
                </TouchableOpacity>
            )}
        </View>
    </View>
  )
}

export default FormField