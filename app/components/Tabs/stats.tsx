import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import PracticeStatsList from '../PracticeStatsListPage'
import { Series } from '@/app/src/types';
import StatTile from '../StatTile';

interface StatsTabProps {
  sessionData: Series[];
}

interface SerieStats {
  seriesScore: number;
  totalStrikes: number;
  strikePercentage: number;
  totalSpares: number;
  totalShots: number;
  sparePercentage: number;
  singlePinSparePercentage: number;
  openFramePercentage: number;
  singlePinSpares: number;
  singlePinAttempts: number;
  spareOpportunities: number;
  numberOfGames: number;
  openFrames: number;
  average: number;
}

const initialStats: SerieStats = {
  seriesScore: 0,
  totalStrikes: 0,
  strikePercentage: 0,
  totalSpares: 0,
  totalShots: 0,
  sparePercentage: 0,
  singlePinSparePercentage: 0,
  openFramePercentage: 0,
  singlePinSpares: 0,
  singlePinAttempts: 0,
  spareOpportunities: 0,
  numberOfGames: 0,
  openFrames: 0,
  average: 0,
};

const StatsTab: React.FC<StatsTabProps> = ({ sessionData }) => {
  const [statsMap, setStatsMap] = useState(new Map());
  
  let  singlePinSparePercentage = 0
  let  sparePercentage= 0
  let  singlePinSpares= 0
  let  average= 0
  let  totalSpares= 0
  let  spareOpportunities= 0
  let  numberOfGames= 0
  let  totalShots= 0
  let  openFrames= 0
  let  seriesScore= 0
  let  singlePinAttempts= 0
  let  strikePercentage= 0
  let  totalStrikes= 0
  let  openFramePercentage= 0

  let updateMap = statsMap;
  sessionData.forEach((session)=>{
    Object.entries(session.stats).forEach(([key, value]) => {
      switch (key){
        case "singlePinSpares":
          singlePinSpares += value;
          singlePinSparePercentage = (singlePinSpares / singlePinAttempts)*100;
          break;
        case "totalSpares":
          totalSpares += value;
          sparePercentage = (totalSpares / spareOpportunities)*100;
          break;
        case "spareOpportunities":
          spareOpportunities +=value;
          sparePercentage = (totalSpares / spareOpportunities)*100;
          openFramePercentage = (openFrames / spareOpportunities)*100;
          break;
        case "numberOfGames":
          numberOfGames +=value;
          average = (seriesScore/numberOfGames) * 100;
          break;
        case "totalShots":
          totalShots +=value;
          break;
        case "openFrames":
          openFrames +=value;
          openFramePercentage = (openFrames / spareOpportunities)*100;
          break;
        case "seriesScore":
          seriesScore +=value;
          break;
        case "singlePinAttempts":
          singlePinAttempts += value;
          singlePinSparePercentage = (singlePinSpares / singlePinAttempts)*100;
          break;
        case "totalStrikes":
          totalStrikes +=value;
          strikePercentage = (totalStrikes / totalShots)*100;
          break;
        default:
          break;
      }
    });
      
  })

  return (
    <View className="flex-1 bg-primary justify-center items-center">
      <ScrollView>
            <StatTile title="Number of games played" value={numberOfGames}/>
            <StatTile title="Average score per game" value={seriesScore/numberOfGames}/>
            <StatTile title="Strike percentage" value={strikePercentage}/>
            <StatTile title="Spare percentage" value={sparePercentage}/>
            <StatTile title="Total Strikes" value={totalStrikes}/>
            <StatTile title="Opens" value={openFrames}/>
        </ScrollView>
    </View>
  )
}

export default StatsTab