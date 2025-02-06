import { View, Text, Button } from 'react-native'
import React from 'react'
import "../../global.css";

const Stats = () => {
  return (
    <View>
      <Button title="Practice stats"/>

      <Button title="League stats"/>

      <Button title="Tournament stats"/>

      <Button title="Ball stats"/>

      <Button title="Spare stats"/>

      <Button title="Combine stats"/>
    </View>
  )
}

export default Stats