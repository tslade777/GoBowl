import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import Frame from './Frame';
import TenthFrame from './TenthFrame';

const BowlingGame = () => {
    const [frame1, setFrame1] = useState({ roll1: '', roll2: '' });
    const [isFirstRoll, setIsFirstRoll] = useState(true);
    const [inputRoll, setInputRoll] = useState('');
    const [isFrameComplete, setIsFrameComplete] = useState(false);
  
    const handleManualInput = () => {
      if (isFrameComplete) return; // Stop input if frame 1 is complete
  
      let rollValue = parseInt(inputRoll, 10);
      if (isNaN(rollValue) || rollValue < 0 || rollValue > 10) return; // Validate input
  
      let updatedFrame = { ...frame1 };
  
      if (isFirstRoll) {
        updatedFrame.roll1 = rollValue === 10 ? 'X' : rollValue.toString(); // Strike logic
        if (rollValue === 10) {
          setIsFrameComplete(true); // Stop input after strike
        } else {
          setIsFirstRoll(false); // Move to second roll
        }
      } else {
        updatedFrame.roll2 = parseInt(frame1.roll1) + rollValue === 10 ? '/' : rollValue.toString(); // Spare or normal roll
        setIsFrameComplete(true); // Mark frame complete
      }
  
      setFrame1(updatedFrame);
      setInputRoll('');
    };
  
    return (
      <View className="items-center p-1 bg-gray-200 rounded-lg">
        <Text className="text-lg font-bold mb-2">Bowling Scoreboard</Text>
  
        {/* Frames Display */}
        <View className="flex-row space-x-1">
          {/* Frame 1 (Editable) */}
          <Frame 
            frameNumber={1} 
            roll1={frame1.roll1} 
            roll2={frame1.roll2} 
            total={isFrameComplete ? (frame1.roll1 === 'X' ? '10' : frame1.roll1 + frame1.roll2) : ''} 
          />
          
          {/* Frames 2-9 (Only Displayed, Not Editable) */}
          {[...Array(8)].map((_, index) => (
            <Frame key={index + 2} frameNumber={index + 2} roll1="" roll2="" total="" />
          ))}
  
          {/* 10th Frame (Only Displayed, Not Editable) */}
          <TenthFrame roll1="" roll2="" roll3="" total="" />
        </View>
  
        {/* Manual Input Controls (Only for Frame 1) */}
        {!isFrameComplete && (
          <View className="mt-4 items-center">
            <Text className="text-lg font-bold">Enter Rolls for Frame 1</Text>
            <TextInput 
              className="border border-gray-500 px-4 py-2 w-20 text-center rounded-lg bg-white" 
              keyboardType="numeric" 
              maxLength={2} 
              value={inputRoll} 
              onChangeText={setInputRoll} 
              placeholder="0-10" 
            />
            <TouchableOpacity 
              onPress={handleManualInput} 
              className="mt-2 bg-green-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-bold">Enter Roll</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  
  export default BowlingGame;