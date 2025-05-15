import { View, Text, TouchableOpacity, Image, PanResponder, Animated, ScrollView, Dimensions, Pressable  } from 'react-native';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import Frame from './Frame';
import TenthFrame from './TenthFrame';
import icons from '@/src/constants/icons';
import { tGame } from '@/src/values/types';
import useGameViewStore from '@/src/zustandStore/gameStore';
import game from '@/src/screens/game';

const { width } = Dimensions.get('window');
const pinSize = width * 0.5; // About 12% of screen width
const frameButtonSize = width * 0.10;
const frameWidth = width / 10; // or /12 to leave margin


type ChildComponentProps = {
  sessionGameComplete: () => void;
  toggleBowling: (inProgress: boolean) => void;
  updateCurrentGame: () => void;
  isHistory: boolean;
};

export type GameRef = {
  setGameNumber: (gameNum: number) => void;
  clearGame: () => void;
}

const FrameView = forwardRef<GameRef, ChildComponentProps>(
  ({ sessionGameComplete, toggleBowling, updateCurrentGame, isHistory }, ref) => {
  // Game state
  const [pins, setPins] = useState(Array(10).fill(false)); // Track knocked-down pins
  const [count, setCount] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const [gameNum, setGameNum] = useState(1);

  // Zustand store 
  const currentFrame = useGameViewStore(state => state.game.currentFrame);
  const currGame = useGameViewStore(state => state.game);
  const selectedShot = useGameViewStore(state => state.game.selectedShot);
  const frames = useGameViewStore((state) => state.game.frames);
  const gameComplete = useGameViewStore(state => state.game.gameComplete);
  const setCurrentFrame = useGameViewStore(state=> state.setSelectedFrame)
  const nextShot = useGameViewStore(state => state.nextShot);
  const prevShot = useGameViewStore(state => state.prevShot);
  const changeFrame = useGameViewStore(state => state.changeFrame);
  const enterShot = useGameViewStore(state => state.enterShot);
  const resetGame = useGameViewStore(state => state.resetGame);
  const endGame = useGameViewStore(state => state.endGame);


  useImperativeHandle(ref, () => ({
    setGameNumber: (num: number) => {
      setGameNum(num);
    },
    clearGame: () => {
      // logic to clear the game
    },
  }));
  
  useEffect(() => {
    if (currentFrame >= 6) {
      const scrollToX = currentFrame * frameWidth;
      scrollRef.current?.scrollTo({ x: scrollToX, animated: true });
    }
  }, [currentFrame]);

  useEffect(() => {
    setPins(frames[currentFrame].firstBallPins)
  }, [currentFrame]);

  useEffect(()=>{
    if(selectedShot==1)
      setPins(frames[currentFrame].firstBallPins)
    else if (selectedShot==2 && frames[currentFrame].roll2!=-1)
      setPins(frames[currentFrame].secondBallPins)
    else if (selectedShot==3)
      setPins(frames[currentFrame].thirdBallPins)
  },[selectedShot])

  /**
   * Game is finished, mark it as so.
   */
  useEffect(()=>{
    if(gameComplete){
      sessionGameComplete();
      endGame();
    }
  },[gameComplete])
  
  /**
   * Update the current game on firebase. 
   */
  useEffect(()=>{
    updateCurrentGame();
  },[currGame])

  /**
   * 
   * @param index 
   */
  const handleFrameTouch = (index: number) => {
    const touchedFrame = frames[index];
    if(touchedFrame.roll1 == -1 && index != 0 && frames[index-1].roll1 == -1)
        return;

    setCurrentFrame(index)
  }

  // It's important to only toggle pins that are still standing after the first throw.
  const handlePinToggle = (index: number) => {
    if (isHistory) return; // 🚫 Block changes while viewing history
    let updatedPins = [...pins];
    if (selectedShot == 1){
      updatedPins[index] = !updatedPins[index];
      
      // Count the number of pins knocked down
      let count = updatedPins.filter(x => x==true).length
      setCount(count);
      setPins(updatedPins);
    }
    else{
      const firstBallPins = frames[currentFrame].firstBallPins
      const firstBallCount = firstBallPins.filter(x => x==true).length
      if (firstBallPins[index]) return;
      else{
        updatedPins[index] = !updatedPins[index];
        let count = (updatedPins.filter(x => x==true).length-firstBallCount)
        setCount(count);
        setPins(updatedPins);
      }
    }
  };

  // Handle unique pin toggle of tenth frame
  function tenthFramePinToggle(index: number){
    if (isHistory) return;
    let updatedPins = [...pins];
    let tenth = frames[9];

    switch(selectedShot){
      case 1:{
        updatedPins[index] = !updatedPins[index];
        // Count the number of pins knocked down
        setPins(updatedPins);
        break;
      }
      case 2:{
        // first ball is not strike.
        if(tenth.roll1 != 10){
          const firstPins = tenth.firstBallPins
          if (firstPins[index]) return;
          else{
            updatedPins[index] = !updatedPins[index];
            setPins(updatedPins)
          }
        }
        // first ball is a strike
        else{
          updatedPins[index] = !updatedPins[index];
          // Count the number of pins knocked down
          setPins(updatedPins);
        }
        break;
      }
      case 3:{
        // need to restrict 3rd ball pins to only pins left standing after second shot.
        // X | 6 | ?
        if(tenth.roll2 != 10 && tenth.roll1 == 10){
          const pinsHIt = tenth.secondBallPins
          if (pinsHIt[index]) return;
          else{
            updatedPins[index] = !updatedPins[index];
            setPins(updatedPins)
          }
        }
        // X | X | ? or 9 | / | ?
        else{
          updatedPins[index] = !updatedPins[index];
          // Count the number of pins knocked down
          setPins(updatedPins);
        }
        break;
      }
    }
  }

  const handleZeroQuickSelect = () =>{
    if (isHistory) return;
    if(selectedShot == 1)
        enterShot(10, Array(10).fill(false))
    else if(selectedShot == 2){
        if(currentFrame==9 && frames[9].roll1==10)
            enterShot(10, Array(10).fill(false))
        else
          enterShot(0, frames[9].firstBallPins);
    }
    else{
        if (frames[9].roll2 != 10 && frames[9].isStrike)
            enterShot(0, frames[9].secondBallPins);
        else
          enterShot(0, Array(10).fill(false));
    }
  }

  const resetPins = () =>{
    setPins(Array(10).fill(false))
  }
    return (
      <Animated.View className="items-center p-1  rounded-lg bg-primary"  >
        {/* Frames Display */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollRef}>
        <View className="flex-row space-x-1 mx-1" >
        {frames.slice(0, 9).map((frame, index) => (
          <TouchableOpacity key={index} onPress={() => handleFrameTouch(index)}>
            <Frame 
              key={index} 
              frameNumber={index + 1} 
              roll1={frame.roll1} 
              roll2={frame.roll2} 
              total={frame.visible ? frame.score :  -1}
              isSelected= {currentFrame==index}
              isSplit = {frame.isSplit} 
              selectedShot = {selectedShot}
            />      
          </TouchableOpacity>
        ))}
          
          {/* 10th Frame  */}
          <TouchableOpacity  onPress={() => handleFrameTouch(9)}>
            <TenthFrame 
            roll1={frames[9].roll1} 
            roll2={frames[9].roll2} 
            roll3={frames[9].roll3} 
            total={(!gameComplete) ? -1 : frames[9].score}
            isSelected= {currentFrame==9}
            isSplit = {frames[9].isSplit}
            selectedShot={selectedShot}
            />
          </TouchableOpacity>
        </View>
        </ScrollView>
        
        <View className=" flex-row  px-4">
          <Text className="text-2xl text-orange pr-10 justify-between font-bold">
          {gameComplete ? "Game Complete" : `Frame ${currentFrame+1}` }
          </Text>
          <Text className="text-teal pl-10 text-2xl font-bold ">Game: {gameNum}</Text>
        </View>
        
        
        {/* Select Pins - Arranged in Triangle Formation */}
        <View className="flex-row ">
          <View className="mt-6 items-center " >
          {[ [6, 7, 8, 9], [3, 4, 5], [1, 2], [0] ].map((row, rowIndex) => (
          <View key={rowIndex}  className="flex-row justify-center" >
            {row.map((index) => (
              <Pressable
              key={index}
              onPress={() => {
                currentFrame === 9
                  ? tenthFramePinToggle(index)
                  : handlePinToggle(index);
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
              className={`w-14 h-14 m-2 rounded-full items-center justify-center border-2 shadow-lg ${
                pins[index] ? 'bg-gray-600 border-black-100' : 'bg-white border-black-100'
              }`}
            >
              <Text className={`${pins[index] ? 'text-white' : 'text-black'} font-pbold`}>
                {index + 1}
              </Text>
            </Pressable>
            ))}
          </View>
        ))}
        </View>
        {/* Quick Select Buttons */}
        <View className="flex-col mt-10 items-center ">
          <TouchableOpacity 
            disabled={selectedShot != 1 &&currentFrame!=9}
            onPress={()=>{enterShot(10, Array(10).fill(true)); resetPins();
              }}
            className="mx-5 pr-4 pl-2 py-2 rounded-lg items-center"
          >
            <Text className={`text-5xl ${selectedShot != 1 && currentFrame!=9 ? "text-gray-500" : "text-white"} font-pextrabold`}>X</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            disabled={selectedShot == 1}
            onPress={()=>{enterShot(10, Array(10).fill(true)); resetPins();}} 
            className="mx-5 mt-4 pr-4 pl-2 py-2 rounded-lg items-center"
          >
            <Text className={`text-5xl ${selectedShot == 1 ? "text-gray-500" : "text-white"} font-pextrabold`}>/</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>{handleZeroQuickSelect()} }
            className="mx-5 mt-5 pr-4 pl-2 py-2 rounded-lg items-center"
          >
            <Text className="text-5xl text-white font-pextrabold">-</Text>
          </TouchableOpacity>
        </View>
        </View>
      
      {/* Manual Input Controls */}
      <View className="flex-col mt-4 items-center"> 
        <View className='flex-row justify-evenly items-center' >
          {/** Previous Frame button */}
          <TouchableOpacity 
            onPress={()=>{changeFrame(-1)}}
            className="m-2  px-4 py-2 rounded-lg"
            disabled={currentFrame==0} 
          >
            <Image source={icons.previousFrame}
              className='w-16 h-16'
              resizeMode='contain'
              style={currentFrame>0 ? {tintColor: "white"} : {tintColor: "gray"}}/>
          </TouchableOpacity>
          {/** Previous shot button */}
          <TouchableOpacity 
            onPress={()=>{prevShot()}}
            disabled={currentFrame==0 && selectedShot == 1} 
            className="mr-5 px-1 py-2 rounded-lg"
          >
            <Image source={icons.previousShot}
              className='w-10 h-10'
              resizeMode='contain'
              style={currentFrame==0 && selectedShot == 1 ? {tintColor: "gray"} : {tintColor: "white"}}/>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isHistory} 
            onPress={()=>{enterShot(count, pins); updateCurrentGame();}} 
            className=" px-1 py-2 rounded-lg"
          >
            <Image source={icons.enter}
              className='w-14 h-14'
              resizeMode='contain'
              />
          </TouchableOpacity>

          {/** Next shot button */}
          <TouchableOpacity 
            onPress={()=>{nextShot();}}
            disabled={(currentFrame == 9 && selectedShot == 3) || 
              (currentFrame != 9 && frames[currentFrame+1].roll1 == -1 && selectedShot ==2) || (frames[currentFrame].roll1 == -1)} 
            className="ml-5 px-1 py-2 rounded-lg"
          >
            <Image source={icons.nextShot}
              className='w-10 h-10'
              resizeMode='contain'
              style={currentFrame== 9 && selectedShot == 3 ? {tintColor: "gray"} : {tintColor: "white"}}/>
          </TouchableOpacity>
          {/** Next Frame button */}
          <TouchableOpacity 
            onPress={()=>{changeFrame(1)}} 
            disabled={currentFrame==9 || (currentFrame != 9 && frames[currentFrame+1].roll1 == -1 && frames[currentFrame].roll1==-1)}
            className="m-2  px-4 py-2 rounded-lg"
          >
            <Image source={icons.nextFrame}
              className='w-16 h-16'
              resizeMode='contain'
              style={currentFrame== 9 ? {tintColor: "gray"} : {tintColor: "white"}}/>
          </TouchableOpacity>

        </View>
        
    </View>
    
    </Animated.View>
    
  
    );
}
);
  
  export default FrameView;