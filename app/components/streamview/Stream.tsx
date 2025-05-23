import { View, Text, TouchableOpacity, TextInput, Image, Animated, ActivityIndicator  } from 'react-native';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Frame from '../scoreboard/Frame';
import TenthFrame from '../scoreboard/TenthFrame';
import { FIREBASE_AUTH, db } from '../../../firebase.config'
import { collection, query, where, doc, getDoc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { tGame } from '@/app/src/values/types';
import icons from '@/constants/icons';

interface FriendProps {
  id: string;
  username: string;
  active: boolean;
}

export type StreamRef = {
  nextGame: () => void;
  previousGame: () => void;
}

const Stream = forwardRef<StreamRef, FriendProps>(({id,username,active}, ref) => {
  
  const [frames, setFrames] = useState(
    Array(10).fill(null).map(() => ({ roll1: '', roll2: '', roll3: '', score: 0 ,
      firstBallPins: Array(10).fill(false),secondBallPins:Array(10).fill(false), 
      isSpare: false, isStrike: false, visible: false, isSplit: false }))
  );
  const [games, setGames] = useState<tGame[]>([])
  const [currentFrame, setCurrentFrame] = useState(0);
  const [farthestFrame, setFarthestFrame] = useState(0);
  const [isFirstRoll, setIsFirstRoll] = useState(false);
  const [gameComplete, setGameComplete] = useState(false)
  const [pins, setPins] = useState(Array(10).fill(false)); // Track knocked-down pins
  const [index, setIndex] = useState(0);
  const [currGameNum, setCurrGameNum] = useState(0);
  const [gameNum, setGameNum] = useState(0);
  const viewingHistoryRef = useRef(false);

  const [loading, setLoading] = useState(true);


  // 🛑 Ensure Unsubscription When Component Unmounts
  useEffect(() => {
    const unsubscribe = updateFirebaseCurrentGame();

    return () => {
      console.log("🛑 Component Unmounted, Unsubscribing from Firestore");
      unsubscribe(); // Ensure Firestore listener is removed
    };
  }, []); // Runs only once on mount/unmount

  /**
   * Get updates from firebase and display them to the user
   * @returns nul
   */
  const updateFirebaseCurrentGame = () =>{
    const docRef = doc(db, 'activeUsers', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          if(!docSnap.data().active){
            // TODO:
            // Session over, exit screen
            // Show model to warn user that friend is done bowling.
            // Don't kick them out. let them view friends games
          }

          // The user is viewing previous games and shouldn't be pulled to the current game
          if (viewingHistoryRef.current){
            console.log(`📛 Viewing previous game`)
            return
          }
          else{
            const gamesData: tGame[] = docSnap.data().games;
            if (!gamesData) return;
            const currentGame: tGame = gamesData[gamesData.length-1];
            setGames(gamesData||[])
            setCurrGameNum(currentGame.gameNum)
            setFrames(currentGame.frames);
            setCurrentFrame(currentGame.currentFrame);
            setIsFirstRoll(Boolean(currentGame.isFirstRoll));
            setIndex(gamesData.length-1)
            
            // // Possible show pins being knocked down with a small delay? animations?
            const updatedPins = [...currentGame.frames[currentGame.currentFrame].firstBallPins];
            setPins(currentGame.pins);
  
            setGameComplete(Boolean(currentGame.gameComplete));
            setLoading(false);
          }
        }
        
      });
      return () => unsubscribe();
  };


  // Expose methods to the parent
    useImperativeHandle(ref, () => ({
      nextGame,
      previousGame,
    }));

  /**
   * Show the next game in the history or the current game if it's next.
   * @returns null
   */
  const nextGame = () =>{
    
    // Next game will be current game
    if (index == games.length-2){
      console.log(`➡️ Current game`)
      viewingHistoryRef.current = false
      updateFirebaseCurrentGame();
    }
    else if (index < games.length-2){
      console.log(`➡️ Next game`)
      viewingHistoryRef.current = true
      setGame(games[index+1])
      setIndex(index+1)
    }
    else return
  }

  const previousGame = () =>{
    
    // Next game will be current game
    if (index > 0){
      console.log(`⬅️ previous game`)
      viewingHistoryRef.current = true
      setGame(games[index-1])
      setIndex(index-1)
    }
    else return
  }

  /**
   * Set the Game as it's updated from firebase.
   * @param game The game that needs to be displayed. 
   */
  const setGame = (game: tGame) =>{
    setCurrentFrame(game.currentFrame)
    setFarthestFrame(game.farthestFrame)
    setIsFirstRoll(Boolean(game.isFirstRoll))
    setGameComplete(Boolean(game.gameComplete))
    setPins(game.pins)
    setFrames(game.frames)
    setGameNum(game.gameNum)
  }

  
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
              isSplit= {frame.isSplit}
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
          isSplit = {frames[9].isSplit}
          />
          </View>}
         
        <View className=" flex-row  px-4">
          <Text className="text-2xl text-orange pr-10 justify-between font-bold">
          {gameComplete ? "Game Complete" : `Frame ${currentFrame+1}` }
          </Text>
          <Text className="text-teal pl-10 text-2xl font-bold ">Game: {index+1}</Text>
        </View>
        
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
      <View className="">
            
        </View>
      </Animated.View>
    
  
    );
  }
);
  
  export default Stream;