import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { LinearGradient } from "expo-linear-gradient";
import { SeriesStats } from '@/app/src/values/types';

const stats = [
    { label: "Average Score", productA: 190, productB: 210 },
    { label: "Strikes %", productA: 65, productB: 80 },
    { label: "Spares %", productA: 50, productB: 70 },
    { label: "Splits Converted", productA: 30, productB: 45 },
    { label: "High Game", productA: 250, productB: 280 },
    { label: "Games Played", productA: 120, productB: 140 },
    { label: "High Series", productA: 150, productB: 200 },
    { label: "Ten Pin %", productA: 190, productB: 110 },
  ];

  const maxStat = 300;

const StatComparison = () => {
  return (
    <View className="flex-1 bg-primary">
        {/* Product Labels */}
        <View className="flex-row justify-between px-4 mt-5 mb-2">
          <Text className="text-orange font-bold text-2xl text-center flex-1">Them</Text>
          <Text className="text-teal font-bold text-2xl text-center flex-1">You</Text>
        </View>
      <ScrollView 
        contentContainerStyle={{ padding: 6, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        

        {stats.map((stat, index) => {
          let percentageA = 0;
          let percentageB = 0;
          if (stat.label.includes('%')){
              percentageA = stat.productA;
              percentageB = stat.productB;
          }
          else if(stat.label == "High Series"){
              percentageA = (stat.productA/900)*100;
              percentageB = (stat.productB/900)*100;
          }
          else{
              percentageA = (stat.productA/300)*100;
              percentageB = (stat.productB/300)*100;
          }

          return (
            <View key={index} className="mb-6">
              <Text className="text-white text-2xl font-psemibold text-center mb-2">{stat.label}</Text>
              <View className="flex-row items-center">
                {/* Product A Progress Bar (Right to Left) */}
                <View className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden flex-row justify-end">
                  <LinearGradient
                    colors={["#FF5733", "#FF4500"]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    style={{
                      width: `${percentageA}%`,
                      height: "100%",
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12,
                    }}
                  />
                </View>
                <Text className="text-orange text-xl font-bold w-12 text-center">{stat.productA}</Text>

                {/* Spacer */}
                <Text className="text-white font-psemibold text-xl mx-2">VS</Text>

                {/* Product B Progress Bar (Left to Right) */}
                <Text className="text-teal text-xl font-bold w-12 text-center">{stat.productB}</Text>
                <View className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                  <LinearGradient
                    colors={["#1bcfcf", "#57FFFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: `${percentageB}%`,
                      height: "100%",
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                    }}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default StatComparison