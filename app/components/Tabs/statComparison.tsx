import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import { SeriesStats } from '@/app/src/values/types';
import getAllStats from '@/app/hooks/allStats';
import getAllStatsByID from '@/app/hooks/allStatsByID';
import { defaultSeriesStats } from '@/app/src/values/defaults';

const StatComparison = ({friendID}:{friendID:string}) => {
  const [myStats,setMyStats] = useState<SeriesStats>(defaultSeriesStats)
  const [friendStats,setFriendStats] = useState<SeriesStats>(defaultSeriesStats)

  useEffect(()=>{
    // TODO: add loading icon for getStats
    getStats();
  },[])
  
  const getStats = async ()=>{
    let stats = await getAllStats();
    setMyStats(stats)
    let friendStats = await getAllStatsByID(friendID)
    setFriendStats(friendStats)
  }

  const stats = [
    { label: "Average Score", you: myStats.average, them: friendStats.average },
    { label: "High Game", you: myStats.highGame, them: friendStats.highGame },
    { label: "High Series", you: myStats.highSeries, them: friendStats.highSeries },
    { label: "Games Played", you: myStats.numberOfGames, them: friendStats.numberOfGames },
    { label: "Strike %", you: myStats.strikePercentage, them: friendStats.strikePercentage },
    { label: "Spare %", you: myStats.sparePercentage, them: friendStats.sparePercentage },
    { label: "Single Pin %", you: myStats.singlePinSparePercentage, them: friendStats.singlePinSparePercentage },
    { label: "Split %", you: myStats.splitsPercentage, them: friendStats.splitsPercentage },
  ];
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
              percentageA = stat.you;
              percentageB = stat.them;
          }
          else if(stat.label == "High Series"){
              percentageA = (stat.you/900)*100;
              percentageB = (stat.them/900)*100;
          }
          else if (stat.label == "Games Played"){
            const divisor = stat.you > stat.them ? stat.you : stat.them;
            percentageA = (stat.you/divisor)*100;
            percentageB = (stat.them/divisor)*100;
        }
          else{
              percentageA = (stat.you/300)*100;
              percentageB = (stat.them/300)*100;
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
                      width: `${percentageB}%`,
                      height: "100%",
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12,
                    }}
                  />
                </View>
                <Text className="text-orange text-xl font-bold w-16 mx-1 text-center">
                  {Number.isInteger(stat.them) ? stat.them.toString() : stat.them.toFixed(2)}</Text>

                {/* Spacer */}
                <Text className="text-white font-psemibold text-xl mx-1">VS</Text>

                {/* Product B Progress Bar (Left to Right) */}
                <Text className="text-teal text-xl font-bold w-16 mx-1 text-center">
                  {Number.isInteger(stat.you) ? stat.you.toString() : stat.you.toFixed(2)}</Text>
                <View className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                  <LinearGradient
                    colors={["#1bcfcf", "#57FFFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
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

export default StatComparison