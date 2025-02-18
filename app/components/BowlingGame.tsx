import { View, Text, TouchableOpacity, TextInput, PanResponder  } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Frame from './Frame';
import TenthFrame from './TenthFrame';
import { FIREBASE_AUTH, db } from '../../firebase.config'
import { collection, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';



const BOWLINGSTATE = 'bowlingGameState';
const INPROGRESS = 'gameInProgress'


const BowlingGame = () => {
  const [frames, setFrames] = useState(
    Array(10).fill(null).map(() => ({ roll1: '', roll2: '', roll3: '', score: 0 ,
      firstBallPins: Array(10).fill(false),secondBallPins:Array(10).fill(false), 
      isSpare: false, isStrike: false }))
  );
  const [currentFrame, setCurrentFrame] = useState(0);
  const [farthestFrame, setFarthestFrame] = useState(0);
  const [isFirstRoll, setIsFirstRoll] = useState(true);
  const [isFinalRoll, setIsFinalRoll] = useState(false)
  const [inputRoll, setInputRoll] = useState('0');
  const [isFrameComplete, setIsFrameComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false)
  const [pins, setPins] = useState(Array(10).fill(false)); // Track knocked-down pins
  const [edited, setEdited] = useState(false);

  const pinRefs = useRef<(View | null)[]>([]); // Fix the TypeScript issue
  const [pinPositions, setPinPositions] = useState<{ [key: number]: { x: number; y: number } }>({});

  
  // Load saved game on startup
  useEffect(() => {
    loadGame();
  }, []);

  // Save game 
  useEffect(()=>{
    saveGame();
  }, [frames, currentFrame])

  useEffect(() => {
    setTimeout(() => {
      pinRefs.current.forEach((ref, index) => {
        if (ref) {
          ref.measure((x, y, width, height, pageX, pageY) => {
            setPinPositions((prev) => ({ ...prev, [index]: { x: pageX+width/2, y: pageY+height/2 } }));
          });
        }
      });
    }, 500); // Delay to ensure rendering is complete
  }, []);

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
  };
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
  };

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
  };

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
  };

  // Save game to AsyncStorage
  const saveGame = async () => {
    try {
      const gameState = {
        frames,
        currentFrame,
        isFirstRoll,
        farthestFrame,
        pins,
        edited,
        gameComplete,
      };
      updateFirebaseCurrentGame()
      await AsyncStorage.setItem(BOWLINGSTATE, JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  // Load game from AsyncStorage
  const loadGame = async () => {
    try {
      const savedGame = await AsyncStorage.getItem(BOWLINGSTATE);
      const inProgress = await AsyncStorage.getItem(INPROGRESS);

      // If the game is not in progress, Nothing to load, do nothing.
      if(inProgress && !JSON.parse(inProgress)) return;
       
      // Load the saved game. 
      if (savedGame) {
        const { frames, currentFrame, isFirstRoll, farthestFrame, pins, edited, gameComplete  } = JSON.parse(savedGame);
        setFrames(frames);
        setCurrentFrame(currentFrame);
        setIsFirstRoll(isFirstRoll);
        setPins(pins)
        setFarthestFrame(farthestFrame)
        setEdited(edited)
        setGameComplete(gameComplete)
      }
    } catch (error) {
      console.error('Error loading game:', error);
    }
  };

  // Clear the game to be ready for another set of inputs
  const clearGame = async () => {
    setFirebaseInActive()
    setFrames(Array(10).fill(null).map(() => ({ roll1: '', roll2: '', roll3: '', score: 0, 
      firstBallPins: Array(10).fill(false),secondBallPins: Array(10).fill(false), 
      isSpare: false, isStrike: false })));
    setCurrentFrame(0)
    setPins(Array(10).fill(false))
    setFarthestFrame(0)
    setGameComplete(false)
    setInputRoll('0')
    setEdited(false)
    setIsFirstRoll(true)
    setIsFinalRoll(false)
    try{
      saveGame()
      await AsyncStorage.setItem(INPROGRESS, JSON.stringify(false));
    }
    catch (error) {
      console.error('Error setting game in progress:', error);
    }
  };

  const calculateScore = (frames:any) => {
    var totalScore = 0
    let upToFrame = (gameComplete? 10: farthestFrame)
    for (var i = 0; i < upToFrame; i++){
      let frame = { ...frames[i] };
      let firstThrowScore = parseInt(frame.roll1)
      let secondThrowScore = ((firstThrowScore == 10 || frame.roll2 == '')? 0 : parseInt(frame.roll2))
      let thirdThrowScore = ((i==9 && frame.roll3 != '')? parseInt(frame.roll3): 0)
      totalScore += (firstThrowScore + secondThrowScore + thirdThrowScore)
      frame.score = totalScore;
      frames[i] = frame;
    }
    return frames
  }

  const frameComplete = () =>{
    setPins(Array(10).fill(false))
    setInputRoll("0")
    setCurrentFrame(currentFrame+1);
    setIsFirstRoll(true)
    if (currentFrame >= farthestFrame)setFarthestFrame(currentFrame+1)
  }

  // It's important to only toggle pins that are still standing after the first throw.
  const handlePinToggle = (index: number) => {
    let updatedPins = [...pins];
    if (isFirstRoll){
      updatedPins[index] = !updatedPins[index];

      // Count the number of pins knocked down
      let count = updatedPins.filter(x => x==true).length
      setInputRoll(count.toString())
      setPins(updatedPins);
    }
    else{
      const firstBallPins = frames[currentFrame].firstBallPins
      const firstBallCount = firstBallPins.filter(x => x==true).length
      if (firstBallPins[index]) return;
      else{
        updatedPins[index] = !updatedPins[index];
        let count = (updatedPins.filter(x => x==true).length-firstBallCount)
        setInputRoll(count.toString())
        setPins(updatedPins)
      }
    }
  };
  
  // Handle unique pin toggle of tenth frame
  function tenthFramePinToggle(index: number){
    let updatedPins = [...pins];

    if (isFirstRoll){
      updatedPins[index] = !updatedPins[index];

      // Count the number of pins knocked down
      let count = updatedPins.filter(x => x==true).length
      setInputRoll(count.toString())
      setPins(updatedPins);
    }
    else{
      if(!frames[9].isStrike && !isFinalRoll){
        const firstPins = frames[9].firstBallPins
        const firstBallCount = firstPins.filter(x => x==true).length
        if (firstPins[index]) return;
        else{
          updatedPins[index] = !updatedPins[index];
          let count = (updatedPins.filter(x => x==true).length-firstBallCount)
          setInputRoll(count.toString())
          setPins(updatedPins)
        }
      }
      else{
        if (isFinalRoll && frames[9].roll2 != '10' && !frames[9].isSpare){
          const secondPins = frames[9].secondBallPins
          const secondBallCount = secondPins.filter(x => x==true).length
          if (secondPins[index]) return;
          else{
            updatedPins[index] = !updatedPins[index];
            let count = (updatedPins.filter(x => x==true).length-secondBallCount)
            setInputRoll(count.toString())
            setPins(updatedPins)
          }
        }
        else{
          updatedPins[index] = !updatedPins[index];

          // Count the number of pins knocked down
          let count = updatedPins.filter(x => x==true).length
          setInputRoll(count.toString())
          setPins(updatedPins);
        }
      }
    }
  }

  // Detect swipes over pins using PanResponder
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const { moveX, moveY } = gestureState;
      handlePinSwipe(moveX, moveY);
      //console.log("Moves: ", moveX, moveY)
    },
  });

  // Later in life
  const handlePinSwipe = (swipe_x: number, swipe_y: number) => {
    const padding = 14;
    for (var i = 0; i <10; i++){
      const x = pinPositions[i].x
      const y = pinPositions[i].y

      if(swipe_x < x +padding && swipe_x > x-padding && swipe_y < (y + padding) && swipe_y > (y-padding)){
        console.log(`Pin: ${i+1} has been hit`)
      }
    }
  };
  
  // Update frame selection. Call back for frame touch event.
  // Only update if 
  const handleFrameTouch = (index: number) => {
    if (farthestFrame >= index) {
      setCurrentFrame(index);
      setIsFirstRoll(true)
      setPins(frames[index].firstBallPins)
      setEdited(true)
    }
  }

  // Complete the edit a previous frame
  const completeEdit = () => {
    
    setCurrentFrame(gameComplete? 10:farthestFrame);
    setPins(Array(10).fill(false));
    setInputRoll("0");
    setIsFirstRoll(true);
    setEdited(false);
  }
  // Handle editing a previous frame.
  const handleEdit = () =>{
    // Get information for first ball
    let rollValue = parseInt(inputRoll)
    let updatedFrames = [...frames];
    let frame = { ...updatedFrames[currentFrame] };
    
    // Modify Frame for first and second ball
    if(isFirstRoll){
      frame.firstBallPins = pins;
      frame.isStrike = rollValue == 10;
      frame.roll1 = inputRoll
      setIsFirstRoll(false)
    }else{
      frame.roll2 = inputRoll
      frame.isSpare = rollValue + parseInt(frame.roll1) == 10;
      frame.secondBallPins = pins;
      completeEdit()
    }
    // On strike, clear second ball and pins, mark frame complete.
    if (frame.isStrike){
      frame.roll2 = '';
      frame.secondBallPins = (Array(10).fill(true));
      completeEdit()
    }
    
    // Update frame and future scores. 
    updatedFrames[currentFrame] = frame;
    setFrames(calculateScore(updatedFrames));
    //calculateScore()
    return
  }

  // Handle Tenth Frame Unique frame scoring and visuals.
  function handleLastFrame() {
    let rollValue = parseInt(inputRoll);

    // Validate input
    if (isNaN(rollValue) || rollValue < 0 || rollValue > 10 || gameComplete) {
      return};

    // Get frame
    let updatedFrames = [...frames];
    let frame = { ...updatedFrames[currentFrame] };
    
    if(isFinalRoll){
      frame.roll3 = rollValue.toString();
      frame.score = rollValue + frame.score;
      updatedFrames[currentFrame] = frame;
      setFrames(updatedFrames);
      setGameComplete(true)
      return
    }

    if(isFirstRoll){
      // Set the throw.
      frame.roll1 = rollValue.toString();
      frame.firstBallPins = pins;
      frame.isStrike = rollValue == 10;
      frame.score = rollValue + updatedFrames[currentFrame-1].score;
      updatedFrames[currentFrame] = frame;
      if (frame.isStrike) setPins(Array(10).fill(false))
      setFrames(updatedFrames);
      setInputRoll('0')
      setIsFirstRoll(false);
    }
    // Second shot of tenth frame
    else{
      frame.roll2 = rollValue.toString()
      frame.secondBallPins = pins
      frame.isSpare = (parseInt(frame.roll1) + parseInt(frame.roll2) == 10 && (!frame.isStrike))
      frame.score = frame.score + rollValue;
      updatedFrames[currentFrame] = frame;
      setFrames(updatedFrames);
      // User gets an extra shot if spare or strike
      if(frame.isSpare || frame.roll2 == '10'){
        setIsFinalRoll(true)
        setPins(Array(10).fill(false))
        setInputRoll("0")
      }
      else if(frame.isStrike){
        setIsFinalRoll(true)
        setInputRoll("0")
      }
      else{
        setGameComplete(true)
      }
    }
  }

  // This will hold game logic like moving to the next frame on a strike or spare. 
  const handleManualInput = () => {
    // Don't edit unless first ball has been thrown. 
    if (frames[0].roll1 == '' && currentFrame != 0) return
 
    let rollValue = parseInt(inputRoll);

    // Validate input
    if (isNaN(rollValue) || rollValue < 0 || rollValue > 10) {
      console.log(rollValue)
      return};

    // Get frame
    let updatedFrames = [...frames];
    let frame = { ...updatedFrames[currentFrame] };
    
    if(isFirstRoll){
      // Set the throw.
      frame.roll1 = rollValue.toString();
      frame.firstBallPins = pins;
      frame.isStrike = rollValue == 10;
      frame.score = currentFrame != 0 ? rollValue + updatedFrames[currentFrame-1].score : rollValue;
      updatedFrames[currentFrame] = frame;
      setFrames(updatedFrames);
      setInputRoll('0')
 
      // Game has been started after successful first throw. 
      if (currentFrame == 0) gameStarted();

      setIsFirstRoll(false);

      if (rollValue == 10 && currentFrame != 9) {
        frameComplete();
      }
    }
    else{
      frame.roll2 = rollValue.toString()
      frame.secondBallPins = pins
      frame.isSpare = (parseInt(frame.roll1) + parseInt(frame.roll2) == 10)
      frame.score = frame.score + rollValue;
      updatedFrames[currentFrame] = frame;
      setFrames(updatedFrames);
      frameComplete()
    }
    saveGame();  
  };

    return (
      <View className="items-center p-1  rounded-lg " {...panResponder.panHandlers} >
  
        {/* Frames Display */}
        <View className="flex-row space-x-1">
        {frames.slice(0, 9).map((frame, index) => (
          <TouchableOpacity key={index} onPress={() => handleFrameTouch(index)}>
            <Frame 
            key={index} 
            frameNumber={index + 1} 
            roll1={frame.isStrike ? 'X' : frame.roll1 == '0' ? '-' : frame.roll1} 
            roll2={frame.isSpare ? '/' : frame.roll2 == '0' ? '-' : frame.roll2} 
            total={farthestFrame > index ? frame.score.toString() : ''}
            isSelected= {currentFrame==index} 
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
          total={(!gameComplete) ? '' : frames[9].score.toString()}
          isSelected= {currentFrame==9}  
        />
        </View>

        <Text className="text-lg text-orange font-bold">
          {gameComplete ? "Game Complete" : `Frame ${currentFrame+1}` }</Text>
        
        {/* Select Pins - Arranged in Triangle Formation */}
      <View className="mt-6 items-center" >
        {[ [6, 7, 8, 9], [3, 4, 5], [1, 2], [0] ].map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-center" >
            {row.map((index) => (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0}
                ref={(el) => (pinRefs.current[index] = el)}
                onPress={() => currentFrame==9 ? tenthFramePinToggle(index) : handlePinToggle(index)} 
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

        {/* Manual Input Controls */}
        <View className="mt-4 items-center">
          
          <View className='flex-row' >
            <TouchableOpacity 
              onPress={edited?handleEdit:(currentFrame==9)?handleLastFrame:handleManualInput} 
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
            <TouchableOpacity 
              onPress={clearGame}
              className={"m-2 bg-orange px-4 py-2 rounded-lg"}
            >
              <Text className="text-white font-bold">Reset Game</Text>
            </TouchableOpacity>
          </View>
          
        </View>
        
      </View>
    );
  };
  
  export default BowlingGame;