import React from "react";
import { View, Text } from "react-native";

interface StatDisplayProps {
  label: string;
  stat: number | string;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ label, stat }) => {
  return (
    <View className="flex-col justify-center items-center">
      {/* Stat Label */}
      <Text className="text-2xl font-pbold text-orange">
        {label}
      </Text>
      
      {/* Stat Value */}
      <Text className="text-4xl font-bold mt-3 text-white">
        {stat.toString()}
      </Text>
    </View>
  );
};

export default StatDisplay;
