import { View, Text, TouchableOpacity, TextInput, PanResponder, Animated, ActivityIndicator  } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Frame from '../scoreboard/Frame';
import TenthFrame from '../scoreboard/TenthFrame';
import { FIREBASE_AUTH, db } from '../../../firebase.config'
import { collection, query, where, doc, getDoc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';

interface FriendProps {
  id: string;
  username: string;
  active: boolean;
}

const Stream: React.FC<FriendProps> = ({id,username,active}) => {
  
  const [frames, setFrames] = useState(
    Array(10).fill(null).map(() => ({ roll1: '', roll2: '', roll3: '', score: 0 ,
      firstBallPins: Array(10).fill(false),secondBallPins:Array(10).fill(false), 
      isSpare: false, isStrike: false, visible: false }))
  );
  const [currentFrame, setCurrentFrame] = useState(0);
  const [farthestFrame, setFarthestFrame] = useState(0);
  const [isFirstRoll, setIsFirstRoll] = useState(false);
  const [gameComplete, setGameComplete] = useState(false)
  const [pins, setPins] = useState(Array(10).fill(false)); // Track knocked-down pins

  const [loading, setLoading] = useState(true);



  // Load fire base game on start up
  useEffect(() => {
    console.log(`👍 User info gathered ${id}, user activity: ${active}`)

    updateFirebaseCurrentGame()
  }, []);

  const updateFirebaseCurrentGame = async () =>{
    const docRef = doc(db, 'users', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const currentGame = docSnap.data().currentGame;
            
            setFrames(currentGame.frames);
            setCurrentFrame(currentGame.currentFrame);
            setIsFirstRoll(currentGame.isFirstRoll);
            
            // Possible show pins being knocked down with a small delay? animations?
            const updatedPins = [...currentGame.frames[currentGame.currentFrame].firstBallPins];

            setPins(updatedPins);
            setGameComplete(currentGame.gameComplete);
          }
          setLoading(false);
        });
        return () => unsubscribe();
  };

  // Calculate and return the total score that will go into the frame provided.
  const calculateTotalScore = (frames:any) => {
    let totalScore = 0;
    for (var i = 0; i < 10; i++){
      let frame = { ...frames[i] };
      let firstThrowScore = frame.roll1 == '' ? 0 : parseInt(frame.roll1);
      let secondThrowScore = ((firstThrowScore == 10 || frame.roll2 == '')? 0 : parseInt(frame.roll2));

      // The 9th frame will always depend solely on the tenth frame.
      if(i==8){
        totalScore += firstThrowScore + secondThrowScore;
        // BONUS: Use the first two rolls of the tenth frame.
        if (frame.isStrike){
          let bonus = frames[9].roll1 == '' ? 0 : parseInt(frames[9].roll1);
          bonus += frames[9].roll2 == '' ? 0 : parseInt(frames[9].roll2);
          totalScore += bonus;
        }
        // BONUS: Use the first roll of the tenth frame
        else if(frame.isSpare){
          totalScore += frames[9].roll1 == '' ? 0 : parseInt(frames[9].roll1);
        }
        // Score is just total plus current frame. NO BONUS
        else totalScore += firstThrowScore + secondThrowScore
      }
      // Tenth frame will only depend on itself. NO BONUS
      else if (i==9){
        totalScore += frames[9].roll1 == '' ? 0 : parseInt(frames[9].roll1);
        totalScore += frames[9].roll2 == '' ? 0 : parseInt(frames[9].roll2);
        totalScore += frames[9].roll3 == '' ? 0 : parseInt(frames[9].roll3);
      }
      // Case when current shot is a strike
      else if(frame.isStrike){
        totalScore +=10;
        // BONUS: If next shot is strike, take the first ball from two frames ahead
        if (frames[i+1].isStrike){
          totalScore += 10; 
          totalScore += frames[i+2].roll1 == '' ? 0:parseInt(frames[i+2].roll1);
        }
        // BONUS: Next frame is not a strike but current is
        else {
          let nextRoll1 = frames[i+1].roll1 == '' ? 0 : parseInt(frames[i+1].roll1);
          let nextRoll2 = frames[i+1].roll2 == '' ? 0 : parseInt(frames[i+1].roll2);
          totalScore += (nextRoll1 + nextRoll2);
        }
      }
      // BONUS: Current frame is a spare
      else if (frame.isSpare){
        let nextRoll1 = frames[i+1].roll1 == '' ? 0 : parseInt(frames[i+1].roll1);
        totalScore += nextRoll1 + firstThrowScore + secondThrowScore;
      }
      // Current frame is an open, just use current frame scores only. No bonus
      else{
        totalScore += firstThrowScore + secondThrowScore;
      }
      // update the frame score.
      frame.score = totalScore;
      frames[i] = frame;
    }
    return frames
  }
  
  // Update frame selection. Call back for frame touch event.
  // Only update if 
  const handleFrameTouch = (index: number) => {
    setCurrentFrame(index);
    setPins(frames[index].firstBallPins)
  }
    return (
      <Animated.View className="items-center p-1  rounded-lg "  >
        {/* Frames Display */}
        {loading ?<ActivityIndicator size='large' color='#F24804' /> : <View className="flex-row space-x-1" >

          {frames.slice(0, 9).map((frame, index) => (
            <TouchableOpacity key={index} onPress={() => handleFrameTouch(index)}>
              <Frame 
              key={index} 
              frameNumber={index + 1} 
              roll1={frame.isStrike ? 'X' : frame.roll1 == '0' ? '-' : frame.roll1} 
              roll2={frame.isSpare ? '/' : frame.roll2 == '0' ? '-' : frame.roll2} 
              total={frame.visible ? '' : currentFrame > index ? frame.score.toString() : ''}
              isSelected= {currentFrame==index} 
              />      
            </TouchableOpacity>
          ))}

          {/* 10th Frame */}
          <TenthFrame 
          roll1={frames[9].isStrike ? 'X': frames[9].roll1 == '0' ? '-' : frames[9].roll1} 
          roll2={(frames[9].roll1 == '10' && frames[9].roll2 == '10') ? 'X' : 
            frames[9].isSpare ? '/': frames[9].roll2 == '0' ? '-' :frames[9].roll2} 
          roll3={frames[9].roll3 == '10' ? 'X': (frames[9].roll1 == '10' && frames[9].roll2 != '10'
            && (parseInt(frames[9].roll2) + parseInt(frames[9].roll3)==10)) ? '/':
            frames[9].roll3 == '0' ? '-' : frames[9].roll3} 
            total={(!gameComplete) ? '' : frames[9].score.toString()}
          isSelected= {currentFrame==9}  
          />
          </View>}
         
        <Text className="text-lg text-orange font-bold">
          {gameComplete ? "Game Complete" : `Frame ${currentFrame+1}` }</Text>
        
        {/* Select Pins - Arranged in Triangle Formation */}
        <View className="">
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
        {/* Quick Select Buttons */}
        <View className="flex-row mt-10 items-center ">
          <TouchableOpacity 
            onPress={()=>{}}
            className="mx-5 pr-4 pl-2 py-2 rounded-lg items-center"
          >
            <Text className="text-5xl text-white font-pextrabold">X</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>{}} 
            className="mx-5 mt-4 pr-4 pl-2 py-2 rounded-lg items-center"
          >
            <Text className="text-5xl text-white font-pextrabold">/</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>{}} 
            className="mx-5 mt-5 pr-4 pl-2 py-2 rounded-lg items-center"
          >
            <Text className="text-5xl text-white font-pextrabold">-</Text>
          </TouchableOpacity>
        </View>
      </View>
      </Animated.View>
    
  
  );
  };
  
  export default Stream;