import { View, ScrollView } from 'react-native'
import React from 'react'
import { Series } from '@/app/src/values/types';

import parseTotalSessionStats from '../../hooks/parseTotalSessionStats';
import DonutChart from '../stats/DonutChart';
import StatDisplay from '../stats/StatText';

interface StatsTabProps {
  sessionData: Series[];
}

const StatsTab: React.FC<StatsTabProps> = ({ sessionData }) => {
  const stats = parseTotalSessionStats(sessionData);
  

  return (
    <View className="flex-1 bg-primary justify-center items-center">
      
      <ScrollView
      contentContainerStyle={{paddingBottom: 100}}
      >
      {/* First Row */}
      <View className="flex-row justify-between w-full mt-6 px-10 mb-6">
        <View className="flex-1 items-center">
        <DonutChart percentage={stats.strikePercentage} size={125} 
          strokeWidthFactor={0.15} title='Strike' />
        </View>
        <View className="flex-1 items-center">
        <DonutChart percentage={stats.sparePercentage} size={125} 
          strokeWidthFactor={0.15} title='Spare' />
        </View>
      </View>

      {/* Second Row */}
      <View className="flex-row justify-between w-full px-10 mt-6 mb-6">
        <View className="flex-1 items-center">
        <DonutChart percentage={stats.singlePinSparePercentage} size={125} 
          strokeWidthFactor={0.15} title='Singel Pin' />
        </View>
        <View className="flex-1 items-center">
        <DonutChart percentage={stats.openFramePercentage} size={125} 
          strokeWidthFactor={0.15} title='Open' />
        </View>
      </View>

      {/* Third Row */}
      <View className="flex-row justify-between w-full px-10 mt-6">
        <View className="flex-1 items-center">
        <DonutChart percentage={stats.tenPinPercentage} size={125} 
          strokeWidthFactor={0.15} title='Ten Pins' />
        </View>
        <View className="flex-1 items-center">
        <DonutChart percentage={stats.sevenPinPercentage} size={125} 
          strokeWidthFactor={0.15} title='Seven Pins' />
        </View>
      </View>

      {/* First Stats Row */}
      <View className="flex-row w-full px-10 mt-20">
        <View className="flex-1 items-center">
        <StatDisplay label="Average" stat={stats.average.toFixed(2)}/>
        </View>
        <View className="flex-1 items-center">
        <StatDisplay label="Games" stat={stats.numberOfGames}/>
        </View>
      </View>

      {/* Second Stats Row */}
      <View className="flex-row w-full px-10 mt-10">
        <View className="flex-1 items-center">
        <StatDisplay label="High Game" stat={stats.highGame}/>
        </View>
        <View className="flex-1 items-center">
        <StatDisplay label="High Series" stat={stats.highSeries == 0 ? 'n/a' : stats.highSeries}/>
        </View>
      </View>
      {/* Third Stats Row */}
      <View className="flex-row w-full px-10 mt-10">
        <View className="flex-1 items-center">
        <StatDisplay label="Total Shots" stat={stats.totalShots}/>
        </View>
        <View className="flex-1 items-center">
        <StatDisplay label="Strikes" stat={stats.totalStrikes}/>
        </View>
      </View>
      {/* Fourth Stats Row */}
      <View className="flex-row w-full px-10 mt-10">
        <View className="flex-1 items-center">
        <StatDisplay label="Spares" stat={stats.totalSpares}/>
        </View>
        <View className="flex-1 items-center">
        <StatDisplay label="Opens" stat={stats.openFrames}/>
        </View>
      </View>
      {/* Fifth Stats Row */}
      <View className="flex-row w-full px-10 mt-10">
        <View className="flex-1 items-center">
        <StatDisplay label="Splits" stat={stats.splitsTotal}/>
        </View>
        <View className="flex-1 items-center">
        <StatDisplay label="Misses" stat={stats.splitsTotal-stats.splitsConverted}/>
        </View>
      </View>
      {/* Sixth Stats Row */} 
      <View className="flex-row w-full px-10 mt-10">
        <View className="flex-1 items-center">
        <StatDisplay label="Ten Pins" stat={stats.tenPins}/>
        </View>
        <View className="flex-1 items-center">
        <StatDisplay label="Misses" stat={stats.tenPins-stats.tenPinsConverted}/>
        </View>
      </View>
      {/* Sixth Stats Row */} 
      <View className="flex-row w-full px-10 mt-10">
        <View className="flex-1 items-center">
        <StatDisplay label="Seven Pins" stat={stats.sevenPins}/>
        </View>
        <View className="flex-1 items-center">
        <StatDisplay label="Misses" stat={stats.sevenPins-stats.sevenPinsConverted}/>
        </View>
      </View>
      </ScrollView>
      {/* Triangle at the bottom center */}

    </View>
    
  )
}

export default StatsTab