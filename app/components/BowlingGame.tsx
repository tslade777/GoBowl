import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Frame from './Frame'
import TenthFrame from './TenthFrame';

{/* Sample Scores */}
const frames = [
    { roll1: "X", roll2: "", total: "20" },
    { roll1: "9", roll2: "/", total: "38" },
    { roll1: "8", roll2: "1", total: "47" },
    { roll1: "X", roll2: "", total: "66" },
    { roll1: "7", roll2: "2", total: "75" },
    { roll1: "X", roll2: "", total: "101" },
    { roll1: "X", roll2: "", total: "121" },
    { roll1: "6", roll2: "/", total: "141" },
    { roll1: "X", roll2: "", total: "171" }
  ];

const finalFrame = {roll1: "X", roll2: "X", roll3: "X", total: "201"}

const BowlingGame = () => {
  return (
    <View className="flex-row space-x-1 p-2 bg-gray-200 rounded-lg">
    {frames.map((frame, index) => (
      <Frame 
        key={index} 
        frameNumber={index + 1} 
        roll1={frame.roll1} 
        roll2={frame.roll2} 
        total={frame.total} 
      />
    ))}
    {/* Final Frame (10th) */}
    <TenthFrame 
        roll1={finalFrame.roll1} 
        roll2={finalFrame.roll2} 
        roll3={finalFrame.roll3} 
        total={finalFrame.total} 
      />
  </View>
  )
}

export default BowlingGame