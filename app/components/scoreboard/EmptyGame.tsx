import { View, Text, TouchableOpacity, ScrollView, Image  } from 'react-native';
import {useEffect, useState } from 'react';
import Frame from './Frame';
import TenthFrame from './TenthFrame';
import { Game } from '@/app/src/values/types';
import icons from '@/constants/icons';

type GameInfo = {
  gameData: Game;
  gameNum: number;
};

const EmptyGame: React.FC<GameInfo> = ({gameData, gameNum}) => {
  const [frames, setFrames] = useState(gameData.game.frames);


  // Game state
  const [currentFrame, setCurrentFrame] = useState(0);
  const [pins, setPins] = useState(frames[0].firstBallPins); // Track knocked-down pins
  const [selectedShot, setSelectedShot] = useState(1); // Track knocked-down pins

  
  // Update frame selection. Call back for frame touch event.
  // Only update if 
  const handleFrameTouch = (index: number) => {
      setCurrentFrame(index);
      setPins(frames[index].firstBallPins)
  }

  useEffect(()=>{
    let pins = [];
    if (selectedShot==1)
      pins = frames[currentFrame].firstBallPins
    else if(selectedShot==2)
      pins = frames[currentFrame].secondBallPins
    else
      pins = frames[currentFrame].thirdBallPins
    setPins(pins)
  },[selectedShot, currentFrame])

  /**
   * Go to the next shot. 
   * 
   * @param game The current game to be updated
   * @returns the new updated game
   */
  const goToNextShot = () => {
    console.log(`Next shot`)
      // If its the first ball, go to next shot of current frame
      if(selectedShot == 1){
          // unless current is a strike.
          if(frames[currentFrame].isStrike && currentFrame != 9){
              setCurrentFrame(currentFrame+1)
              setSelectedShot(1)
          }
          // go to second shot 
          else{
            setSelectedShot(2)
          }
      }
      else if(selectedShot == 2){
          // if it's the tenth frame, go to third shot
          if(currentFrame == 9){
              // TODO: restrict based on score.
              setSelectedShot(3)
          }
          else{
              let newCurrentFrame = currentFrame+1 > 9 ? currentFrame: currentFrame+1;
              setCurrentFrame(newCurrentFrame)
              setSelectedShot(1)
          }
      }
      // else go to first shot of next frame
      else{
        let newCurrentFrame = currentFrame+1 > 9 ? currentFrame:currentFrame+1;
          setCurrentFrame(newCurrentFrame)
          setSelectedShot(1)
      }
  };
  
  /**
   * 
   * @param game The current game to be updated
   * @returns the new updated game
   */
  const goToPrevShot = ()=> {
    // If its the first ball, go to last shot of last frame
    if(selectedShot==1){
      // If last frame is a strike, show the first ball
      if (frames[currentFrame-1].isStrike){
          setCurrentFrame(currentFrame-1)
          setSelectedShot(1)
      }
      else{
        setCurrentFrame(currentFrame-1)
        setSelectedShot(2)
      }
    }
    // else go to first shot of current frame
    else{
        if (selectedShot==3){
          setSelectedShot(2)
        }else{
          setSelectedShot(1)
        }
    }
  };
  
  const changeToFrame = (num:number) => {
    if (currentFrame + num < 0 || currentFrame+num >9) return
    else{
      setSelectedShot(1)
      setCurrentFrame(currentFrame+num)
    }
  };

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
              roll1={frame.roll1} 
              roll2={frame.roll2} 
              total={frame.score}
              isSelected= {currentFrame==index}
              isSplit={frame.isSplit}
              selectedShot={selectedShot}
            />      
          </TouchableOpacity>
        ))}
          
          {/* 10th Frame (Only Displayed, Not Editable) */}
          <TouchableOpacity
            onPressIn={()=>handleFrameTouch(9)}
            delayPressIn={0}
            delayPressOut={0}
            >
                <TenthFrame 
                roll1={frames[9].roll1} 
                roll2={frames[9].roll2} 
                roll3={frames[9].roll3} 
                total={frames[9].score}
                isSelected= {currentFrame==9}  
                selectedShot={selectedShot}
                />
            </TouchableOpacity>
        </View>
        
        </ScrollView>
        <View className=" flex-row  px-4">
          <Text className="text-2xl text-orange pr-10 justify-between font-bold">Game Complete</Text>
          <Text className="text-teal pl-10 text-2xl font-bold ">Game: {gameNum}</Text>
        </View>
        
        
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
        {/* Manual Input Controls */}
              <View className="flex-col mt-4 items-center"> 
                <View className='flex-row justify-evenly items-center' >
                  {/** Previous Frame button */}
                  <TouchableOpacity 
                    onPressIn={()=>{changeToFrame(-1)}}
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
                    onPressIn={()=>{goToPrevShot()}}
                    disabled={currentFrame==0 && selectedShot == 1} 
                    className="mr-5 px-1 py-2 rounded-lg"
                  >
                    <Image source={icons.previousShot}
                      className='w-10 h-10'
                      resizeMode='contain'
                      style={currentFrame==0 && selectedShot == 1 ? {tintColor: "gray"} : {tintColor: "white"}}/>
                  </TouchableOpacity>
        
                  {/** Next shot button */}
                  <TouchableOpacity 
                    onPress={()=>{ console.log('hit')}}
                    onPressIn={()=>{goToNextShot();}}
                    disabled={(currentFrame == 9 && selectedShot == 3) || (currentFrame != 9 && frames[currentFrame+1].roll1 == -1 && selectedShot ==2)} 
                    className="ml-5 px-1 py-2 rounded-lg"
                  >
                    <Image source={icons.nextShot}
                      className='w-10 h-10'
                      resizeMode='contain'
                      style={currentFrame== 9 && selectedShot == 3 ? {tintColor: "gray"} : {tintColor: "white"}}/>
                  </TouchableOpacity>
                  {/** Next Frame button */}
                  <TouchableOpacity 
                    onPressIn={()=>{changeToFrame(1)}} 
                    disabled={currentFrame==9 || (currentFrame != 9 && frames[currentFrame+1].roll1 == -1)}
                    className="m-2  px-4 py-2 rounded-lg"
                  >
                    <Image source={icons.nextFrame}
                      className='w-16 h-16'
                      resizeMode='contain'
                      style={currentFrame== 9 ? {tintColor: "gray"} : {tintColor: "white"}}/>
                  </TouchableOpacity>
                </View>
            </View>
      </View>
    
  );
  };
  
  export default EmptyGame;