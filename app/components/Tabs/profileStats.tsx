import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { LinearGradient } from "expo-linear-gradient";
import { SeriesStats } from '@/app/src/values/types';



  const maxStat = 300;

const ProfileStats = ({data}:{data:SeriesStats}) => {
    const stats = [
        { label: "Average Score", you: data.average, them: 210 },
        { label: "High Game", you: data.highGame, them: 80 },
        { label: "High Series", you: 0, them: 70 },
        { label: "Games Played", you: data.numberOfGames, them: 45 },
        { label: "Strike %", you: data.strikePercentage, them: 280 },
        { label: "Spare %", you: data.sparePercentage, them: 140 },
        { label: "Single Pin %", you: data.singlePinSparePercentage, them: 200 },
        { label: "Split %", you: data.splitsPercentage, them: 110 },
      ];
  return (
    <View className="flex-1 bg-primary">
        {/* Product Labels */}
        <View className="flex-row justify-between px-4 mt-5 mb-2">
          
         
        </View>
      <ScrollView 
        contentContainerStyle={{ padding: 6, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        

        {stats.map((stat, index) => {
            let percentageA = 0;
            let percentageB = 0;
            if (stat.label.includes('%')){
                percentageA = stat.you;
                percentageB = stat.you;
            }
            else if(stat.label == "High Series"){
                percentageA = (stat.you/900)*100;
                percentageB = (stat.them/900)*100;
            }
            else if (stat.label == "Games Played"){
                percentageA = 100;
                percentageB = 100;
            }
            else{
                percentageA = ((stat.you/300)*100);
                percentageB = (stat.them/300)*100;
            }
          

          return (
            <View key={index} className="mb-6">
              <Text className="text-white text-2xl font-psemibold text-center mb-2">{stat.label}</Text>
              <View className="flex-row items-center justify-evenly">
                {/* Product A Progress Bar (Right to Left) */}
                

                

                {/* Product B Progress Bar (Left to Right) */}
                <Text className=" text-teal text-xl font-bold w-20 text-center">{
                Number.isInteger(stat.you) ? stat.you.toString() : stat.you.toFixed(2)}</Text>
                <View className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                  <LinearGradient
                    colors={["#1bcfcf", "#57FFFF"]}
                    style={{
                      width: `${percentageA}%`,
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

export default ProfileStats