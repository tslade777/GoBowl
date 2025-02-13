import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Frame from './Frame';
import TenthFrame from './TenthFrame';

const BOWLINGSTATE = 'bowlingGameState';
const INPROGRESS = 'gameInProgress'


const BowlingGame = () => {
  const [frames, setFrames] = useState(
    Array(10).fill(null).map(() => ({ roll1: '', roll2: '', roll3: '' }))
  );
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isFirstRoll, setIsFirstRoll] = useState(true);
  const [inputRoll, setInputRoll] = useState('');
  const [isFrameComplete, setIsFrameComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false)

  
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

      await AsyncStorage.setItem(BOWLINGSTATE, JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  // Tell AsyncStorage a game is in progress.
  const gameStarted = async () =>{
    try{
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
      if(inProgress && !JSON.parse(inProgress)){
        console.log('Game not in progress');
        return;
      }

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

  const clearGame = async () => {
    setFrames(Array(10).fill(null).map(() => ({ roll1: '', roll2: '', roll3: '' })))
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
      <View className="items-center p-1 bg-gray-200 rounded-lg">
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
  
        {/* Manual Input Controls (Only for Frame 1) */}
        
        <View className="mt-4 items-center">
          <Text className="text-lg font-bold">Enter Rolls for Frame {currentFrame+1}</Text>
          <TextInput 
            className="border border-gray-500 px-4 py-2 w-20 text-center rounded-lg bg-white" 
            keyboardType="numeric" 
            maxLength={2} 
            value={inputRoll} 
            onChangeText={setInputRoll} 
            placeholder="0-10" 
          />
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