import { View, Text, TouchableOpacity, ScrollView  } from 'react-native';
import {useState } from 'react';
import Frame from './Frame';
import TenthFrame from './TenthFrame';
import { Game } from '@/app/src/values/types';

type GameInfo = {
  gameData: Game;
  gameNum: number;
};

const EmptyGame: React.FC<GameInfo> = ({gameData, gameNum}) => {
  const [frames, setFrames] = useState(gameData.game);


  // Game state
  const [currentFrame, setCurrentFrame] = useState(0);
  const [pins, setPins] = useState(frames[0].firstBallPins); // Track knocked-down pins

  
  // Update frame selection. Call back for frame touch event.
  // Only update if 
  const handleFrameTouch = (index: number) => {
      setCurrentFrame(index);
      setPins(frames[index].firstBallPins)
  }
    return (
      <View className="items-center p-1 rounded-lg">
        {/* Frames Display */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-1" >
        {frames.slice(0, 9).map((frame, index) => (
          <TouchableOpacity
            onPressIn={()=>handleFrameTouch(index)}
            delayPressIn={0}
            delayPressOut={0}
            key={index}
            onPress={() => {}}>
            <Frame 
              key={index} 
              frameNumber={index + 1} 
              roll1={frame.isStrike ? 'X' : frame.roll1 == '0' ? '-' : frame.roll1} 
              roll2={frame.isSpare ? '/' : frame.roll2 == '0' ? '-' : frame.roll2} 
              total={frame.score.toString()}
              isSelected= {currentFrame==index}
              isSplit={frame.isSplit} 
            />      
          </TouchableOpacity>
        ))}
          
  
          {/* 10th Frame (Only Displayed, Not Editable) */}
          <TenthFrame 
          roll1={frames[9].isStrike ? 'X': frames[9].roll1 == '0' ? '-' : frames[9].roll1} 
          roll2={(frames[9].roll1 == '10' && frames[9].roll2 == '10') ? 'X' : 
            frames[9].isSpare ? '/': frames[9].roll2 == '0' ? '-' :frames[9].roll2} 
          roll3={frames[9].roll3 == '10' ? 'X': (frames[9].roll1 == '10' && frames[9].roll2 != '10'
            && (parseInt(frames[9].roll2) + parseInt(frames[9].roll3)==10)) ? '/':
            frames[9].roll3 == '0' ? '-' : frames[9].roll3} 
          total={frames[9].score.toString()}
          isSelected= {currentFrame==9}  
        />
        </View>
        <View className=" flex-row  px-4">
          <Text className="text-2xl text-orange pr-10 justify-between font-bold">Game Complete</Text>
          <Text className="text-teal pl-10 text-2xl font-bold ">Game: {gameNum}</Text>
        </View>
        </ScrollView>
        
        
        
        {/* Select Pins - Arranged in Triangle Formation */}
        <View className="flex-row ">
          <View className="mt-6 items-center " >
          {[ [6, 7, 8, 9], [3, 4, 5], [1, 2], [0] ].map((row, rowIndex) => (
          <View key={rowIndex}  className="flex-row justify-center" >
            {row.map((index) => (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0}
                onPress={() => {}} 
                className={`m-2 w-14 h-14 rounded-full items-center justify-center border-2 shadow-lg ${
                  pins[index] ? 'bg-gray-600 border-black-100' : 'bg-white border-black-100'
                }`}
              >
                <Text className={`${pins[index] ? "text-white" : "text-black"} font-pbold`}>
                  {index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        </View>
        </View>
      </View>
    
  );
  };
  
  export default EmptyGame;