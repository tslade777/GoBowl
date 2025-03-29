// toastConfig.js
import React from "react";
import { View, Text } from "react-native";
import { BaseToastProps, ToastConfig } from "react-native-toast-message";

const toastConfig = {
    customInfo: ({ text1 = "", text2 = ""}) => (
    <View style={{
      backgroundColor: '#facc15', // Tailwind bg-yellow-500
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      width: '60%',
      alignSelf: 'center',
    }}>
      <Text className="text-black font-bold text-lg">{text1}</Text>
      <Text className="text-black mt-1">{text2}</Text>
    </View>
  ),

  successToast: ({ text1 = "", text2 = "" }) => (
    <View className="bg-green-600 rounded-xl px-4 py-3 shadow-md w-[90%] self-center">
      <Text className="text-white font-bold">{text1}</Text>
      <Text className="text-white">{text2}</Text>
    </View>
  ),

  errorToast: ({ text1 = "", text2 = "" }) => (
    <View className="bg-red-600 rounded-xl px-4 py-3 shadow-md w-[90%] self-center">
      <Text className="text-white font-bold">{text1}</Text>
      <Text className="text-white">{text2}</Text>
    </View>
  ),
};

export default toastConfig;
