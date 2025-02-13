import { View, Text, TouchableOpacity, TextInput, PanResponder  } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Frame from './Frame';
import TenthFrame from './TenthFrame';
import { FIREBASE_AUTH, db } from '../../firebase.config'
import { collection, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';

const BOWLINGSTATE = 'bowlingGameState';
const INPROGRESS = 'gameInProgress'


const BowlingGame = () => {
  const [frames, setFrames] = useState(
    Array(10).fill(null).map(() => ({ roll1: '', roll2: '', roll3: '', pins: Array(10).fill(false) }))
  );
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isFirstRoll, setIsFirstRoll] = useState(true);
  const [inputRoll, setInputRoll] = useState('');
  const [isFrameComplete, setIsFrameComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false)
  const [pins, setPins] = useState(Array(10).fill(false)); // Track knocked-down pins

  
  // Load saved game on startup
  useEffect(() => {
    loadGame();
  }, []);

  // Save game 
  useEffect(()=>{
    saveGame();
  }, [frames, currentFrame])

  // Save game to AsyncStorage
  const saveGame = async () => {
    try {
      const gameState = {
        frames,
        currentFrame,
        isFirstRoll,
      };
      updateFirebaseCurrentGame()
      await AsyncStorage.setItem(BOWLINGSTATE, JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const updateFirebaseCurrentGame = async () =>{
    try{
      if (FIREBASE_AUTH.currentUser != null){
        let result = FIREBASE_AUTH.currentUser.uid
        await updateDoc(doc(db,"users", result),{
          currentGame: {
            currentFrame,
            frames,
            isFirstRoll
          }
        })
      }
    }catch(e){
      console.error(e)
    }
  }
  // Tell firebase that the current user is active
  const setFirebaseActive = async () =>{
    try{
      if (FIREBASE_AUTH.currentUser != null){
        let result = FIREBASE_AUTH.currentUser.uid
        await updateDoc(doc(db,"users", result),{
          active: true
        })
      }
    }catch(e){
      console.error(e)
    }
  }

  // Tell firebase that the current user is No longer active
  const setFirebaseInActive = async () =>{
    try{
      if (FIREBASE_AUTH.currentUser != null){
        let result = FIREBASE_AUTH.currentUser.uid
        await updateDoc(doc(db,"users", result),{
          active: false
        })
      }
    }catch(e){
      console.error(e)
    }
  }

  // Tell AsyncStorage a game is in progress.
  const gameStarted = async () =>{
    try{
      // Update firebase and local storage for game started/active
      updateFirebaseCurrentGame();
      setFirebaseActive();
      await AsyncStorage.setItem(INPROGRESS, JSON.stringify(true));
    }
    catch (error) {
      console.error('Error setting game in progress:', error);
    }
  }

  // Load game from AsyncStorage
  const loadGame = async () => {
    try {
      const savedGame = await AsyncStorage.getItem(BOWLINGSTATE);
      const inProgress = await AsyncStorage.getItem(INPROGRESS);

      // If the game is not in progress, Nothing to load, do nothing.
      if(inProgress && !JSON.parse(inProgress)) return;
       
      // Load the saved game. 
      if (savedGame) {
        const { frames, currentFrame, isFirstRoll } = JSON.parse(savedGame);
        setFrames(frames);
        setCurrentFrame(currentFrame);
        setIsFirstRoll(isFirstRoll);
      }
    } catch (error) {
      console.error('Error loading game:', error);
    }
  };

  // Clear the game to be ready for another set of inputs
  const clearGame = async () => {
    setFirebaseInActive()
    setFrames(Array(10).fill(null).map(() => ({ roll1: '', roll2: '', roll3: '',pins: Array(10).fill(false) })));
    setCurrentFrame(0)
    setGameComplete(false)
    setInputRoll('')
    try{
      await AsyncStorage.setItem(INPROGRESS, JSON.stringify(false));
    }
    catch (error) {
      console.error('Error setting game in progress:', error);
    }
  }

  const handlePinToggle = (index: number) => {
    let updatedPins = [...pins];
    updatedPins[index] = !updatedPins[index];

    // Count the number of pins knocked down
    let count = updatedPins.filter(x => x==true).length
    setInputRoll(count.toString())
    setPins(updatedPins);
  };
  
  // Detect swipes over pins using PanResponder
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const { moveX, moveY } = gestureState;
      handlePinSwipe(moveX, moveY);
    },
  });

  const handlePinSwipe = (x: number, y: number) => {
    // Get the index of the pin being touched
    const pinPositions = [ [6, 7, 8, 9], [3, 4, 5], [1, 2], [0] ];
    let updatedPins = [...pins];

    pinPositions.forEach((row, rowIndex) => {
      row.forEach((index) => {
        // Simple hit detection (approximate based on coordinates)
        if (
          x > index * 30 && x < (index + 1) * 50 && 
          y > rowIndex * 30 && y < (rowIndex + 1) * 50
        ) {
          updatedPins[index] = true; // Mark pin as knocked down
        }
      });
    });

    setPins(updatedPins);
  };
  
  const handleManualInput = () => {
    let rollValue = parseInt(inputRoll);

    // Validate input
    if (isNaN(rollValue) || rollValue < 0 || rollValue > 10) return; 
    
    // Get frame
    let updatedFrames = [...frames];
    let frame = { ...updatedFrames[currentFrame] };
    
    // Set the throw.
    frame.roll1 = rollValue.toString();

    // Update frames
    updatedFrames[currentFrame] = frame;
    setFrames(updatedFrames);

    // Game has been started after successful first throw. 
    if (currentFrame == 0) gameStarted();
    //setInputRoll('');

    if (currentFrame < 9){
      setCurrentFrame(currentFrame+1);
      saveGame();
    }
    else{
      setGameComplete(true)
      console.log(`Current Frame: ${currentFrame}`)
    }
  };
  
    return (
      <View className="items-center p-1 bg-gray-200 rounded-lg " >
        <Text className="text-lg font-bold mb-2">Bowling Scoreboard</Text>
  
        {/* Frames Display */}
        <View className="flex-row space-x-1">
        {frames.slice(0, 9).map((frame, index) => (
          <Frame 
            key={index} 
            frameNumber={index + 1} 
            roll1={frame.roll1 == '10' ? 'X' : frame.roll1} 
            roll2={frame.roll2} 
            total={frame.roll1} 
          />
        ))}
          
  
          {/* 10th Frame (Only Displayed, Not Editable) */}
          <TenthFrame 
          roll1={frames[9].roll1} 
          roll2={frames[9].roll2} 
          roll3={frames[9].roll3} 
          total={frames[9].roll1 && frames[9].roll2 ? (frames[9].roll1 === 'X' ? '10' : frames[9].roll1 + frames[9].roll2) : ''} 
        />
        </View>

        <Text className="text-lg font-bold">Frame {currentFrame+1}</Text>
        
        {/* Select Pins - Arranged in Triangle Formation */}
      <View className="mt-6 items-center">
        {[ [6, 7, 8, 9], [3, 4, 5], [1, 2], [0] ].map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-center">
            {row.map((index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => handlePinToggle(index)} 
                className={`m-2 w-14 h-14 rounded-full items-center justify-center border-2 shadow-lg ${
                  pins[index] ? 'bg-gray-500 border-black-100' : 'bg-white border-gray-500'
                }`}
              >
                <Text className={`${pins[index] ? "text-white" : "text-black"} font-pbold`}>{index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

        {/* Manual Input Controls */}
        <View className="mt-4 items-center">
          
          <View className='flex-row' >
            <TouchableOpacity 
              onPress={handleManualInput} 
              className="m-2 bg-green-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-bold">Enter Roll</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={gameComplete ? clearGame : ()=>{}}
              className={`m-2 ${gameComplete ? 'bg-green-950' : 'bg-red-600'} px-4 py-2 rounded-lg `}
              disabled={!gameComplete}
            >
              <Text className="text-white font-bold">Next Game</Text>
            </TouchableOpacity>
          </View>
          
        </View>
        
      </View>
    );
  };
  
  export default BowlingGame;