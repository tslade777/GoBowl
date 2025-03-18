import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import BioItem from './BioItem'
import { UserData } from '@/app/src/values/types';

const Bio = ({ data, editing}: { data: UserData; editing: boolean}) => {
  return (
      <View className="bg-primary h-full">
        <BioItem label={"Age:"} item={data.age} editing={editing} onChange={function (value: string): void {
        
      } }/>
        <BioItem label="Favorite Ball:" item={data.favoriteBall} editing={editing} onChange={function (value: string): void {
       
      } }/>
        <BioItem label="Years Bowling:" item={data.yearsBowling} editing={editing} onChange={function (value: string): void {
        
      } }/>
        <BioItem label="Hand:" item={data.bowlingHand} editing={editing} onChange={function (value: string): void {
        
      } }/>
     </View>
  )
}
export default Bio