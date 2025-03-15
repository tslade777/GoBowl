import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import BioItem from './BioItem'
import { UserData } from '@/app/src/values/types';

const Bio = ({ data}: { data: UserData; }) => {
  return (
      <View className="bg-primary h-full">
        <BioItem label={"Age:"} item={data.age}/>
        <BioItem label="Favorite Ball:" item={data.favoriteBall}/>
        <BioItem label="Years Bowling:" item={data.yearsBowling}/>
        <BioItem label="Hand:" item={data.bowlingHand}/>
     </View>
  )
}
export default Bio