import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import PracticeStatsList from '../PracticeStatsListPage'
import { Series } from '@/app/src/types';
import StatTile from '../StatTile';
import parseTotalSessionStats from '../../hooks/parseStats';
import DonutChart from '../stats/DonutChart';

interface StatsTabProps {
  sessionData: Series[];
}

const StatsTab: React.FC<StatsTabProps> = ({ sessionData }) => {
  const stats = parseTotalSessionStats(sessionData);
  const widthAndHeight = 150; // Size of the donut chart
  const series = [stats.sparePercentage, 100 - stats.sparePercentage]; // Data for the chart
  const sliceColor = ["#4CAF50", "#E0E0E0"]; // Colors for filled and unfilled parts
  
  

  return (
    <View className="flex-1 bg-primary justify-center items-center">
      
      <ScrollView>
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
      <View className="flex-row justify-between w-full px-10 mt-6">
        <View className="flex-1 items-center">
        <DonutChart percentage={stats.singlePinSparePercentage} size={125} 
          strokeWidthFactor={0.15} title='Singel Pin' />
        </View>
        <View className="flex-1 items-center">
        <DonutChart percentage={stats.openFramePercentage} size={125} 
          strokeWidthFactor={0.15} title='Open' />
        </View>
      </View>


      
      </ScrollView>
    </View>
    
  )
}

export default StatsTab