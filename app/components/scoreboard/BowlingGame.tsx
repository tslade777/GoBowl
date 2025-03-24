import { View, Text, TouchableOpacity, Image, PanResponder, Animated, ScrollView, Dimensions  } from 'react-native';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Frame from './Frame';
import TenthFrame from './TenthFrame';
import { BOWLINGSTATE, INPROGRESS, SPLITS } from '@/app/src/config/constants';
import icons from '@/constants/icons';
import { defaultFrame } from '@/app/src/values/defaults';
import { tFrame, tGame } from '@/app/src/values/types';
import useGameStore from '@/app/src/zustandStore/store';

const { width } = Dimensions.get('window');
const pinSize = width * 0.11; // About 12% of screen width
const frameButtonSize = width * 0.10;
const frameWidth = width / 10; // or /12 to leave margin



type ChildComponentProps = {
  sendDataToParent: (data: any) => void; // Define the function type
  toggleBowling: (inProgress: boolean) => void;
  updateCurrentGame: (data: any) => void;
};

export type BowlingGameRef = {
  setGame: (game: tGame) => void;
  clearGame: () => void;
}

const BowlingGame = forwardRef<BowlingGameRef, ChildComponentProps>(
  ({ sendDataToParent, toggleBowling, updateCurrentGame }, ref) => {
    const [frames, setFrames] = useState<tFrame[]>(
      Array.from({ length: 10 }, () => JSON.parse(JSON.stringify(defaultFrame)))
    );

  // Game state
  const [currentFrame, setCurrentFrame] = useState(0);
  const [farthestFrame, setFarthestFrame] = useState(0);
  const [isFirstRoll, setIsFirstRoll] = useState<boolean>(true);
  const [isFinalRoll, setIsFinalRoll] = useState<boolean>(false)
  const [inputRoll, setInputRoll] = useState(0);
  const [striking, setStriking] = useState<boolean>(false);
  const [gameComplete, setGameComplete] = useState<boolean>(false)
  const [pins, setPins] = useState(Array(10).fill(false)); // Track knocked-down pins
  const [edited, setEdited] = useState<boolean>(false);
  const [quickSelection, setQuickSelection] = useState('');

  const scrollRef = useRef<ScrollView>(null);

  // Swiping feature
  const pinRefs = useRef<(View | null)[]>([]); // Fix the TypeScript issue
  const [pinPositions, setPinPositions] = useState<{ [key: number]: { x: number; y: number } }>({});
  const [pinSwipedOn, setPinSwipedOn] = useState(-1)

  // Zustand store 
  const saveGameState = useGameStore((state) => state.setGame)
  const isSaved = useGameStore((state) => state.isSaved)
  const markSaved = useGameStore((state) => state.markSaved)
  
  const game = useGameStore((state)=>state.game)

  // Number of games
  const [numGames, setNumGames] = useState(1);

  useEffect(() => {
    if (currentFrame >= 6) {
      const scrollToX = currentFrame * frameWidth;
      scrollRef.current?.scrollTo({ x: scrollToX, animated: true });
    }
  }, [currentFrame]);
  
  /**
   * 
   * @param game The game that needs to be displayed. 
   */
  const setGame = (game: tGame) =>{
    setCurrentFrame(game.currentFrame)
    setFarthestFrame(game.farthestFrame)
    setIsFirstRoll(Boolean(game.isFirstRoll))
    setIsFinalRoll(Boolean(game.isFinalRoll))
    setStriking(Boolean(game.striking))
    setGameComplete(Boolean(game.gameComplete))
    setPins(game.pins)
    setEdited(Boolean(game.edited))
    setFrames(game.frames)
    setNumGames(game.gameNum)
    saveGameState(game)
  }

  // Expose methods to the parent
  useImperativeHandle(ref, () => ({
    setGame,
    clearGame,
  }));

  // Load saved game on startup
  useEffect(() => {
    loadGame();
  }, []);

  useEffect(() => {
    if(quickSelection == 'X'){
      setQuickSelection('')
      quickSelect();
    }
    else if(quickSelection == '/'){
      setQuickSelection('')
      quickSelect();
    }
    else if(quickSelection == '-'){
      setQuickSelection('')
      quickSelect();
    }
  }, [inputRoll]);

  // Save game 
  useEffect(()=>{
    saveGame();
    updateGame();
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

  /**
   * 
   */
  const gameStarted = async () =>{
    try{
      // Update firebase and local storage for game started/active
      toggleBowling(true);
    }
    catch (error) {
      console.error('📛 Error setting game in progress:', error);
    }
  };

  // Save game to Zustand
  const saveGame = async () => {
    try {
      const game:tGame = {
        frames: frames, // start with an empty array or pre-filled with tFrame objects
        pins: pins, // example: all pins standing
        currentFrame: currentFrame,
        farthestFrame: farthestFrame,
        isFirstRoll: isFirstRoll,
        isFinalRoll: isFinalRoll,
        striking: striking,
        gameComplete: gameComplete,
        edited: edited,
        gameNum: numGames,
        finalScore: frames[9].score
      }
      saveGameState(game);
      markSaved();
    } catch (error) {
      console.error('📛 Error saving game:', error);
    }
  };

  // Load game from Zustand
  const loadGame = async () => {
    try {
      if(isSaved)
        setGame(game)
    } catch (error) {
      console.error('📛 Error loading game:', error);
    }
  };

  // Clear the game to be ready for another set of inputs
  const clearGame = async () => {
    
    if (gameComplete){
      setNumGames(numGames+1)
    }
    setFrames(Array.from({ length: 10 }, () => ({ ...defaultFrame })));
    setCurrentFrame(0)
    setPins(Array(10).fill(false))
    setFarthestFrame(0)
    setGameComplete(false)
    setInputRoll(0)
    setEdited(false)
    setIsFirstRoll(true)
    setIsFinalRoll(false)
    
    try{
      saveGame()
    }
    catch (error) {
      console.error('📛 Error setting game in progress:', error);
    }
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
        // BONUS: Use the first two rolls of the tenth frame.
        if (frame.isStrike){
          totalScore += 10
          let bonus = frames[9].roll1 == '' ? 0 : parseInt(frames[9].roll1);
          bonus += frames[9].roll2 == '' ? 0 : parseInt(frames[9].roll2);
          totalScore += bonus;
        }
        // BONUS: Use the first roll of the tenth frame
        else if(frame.isSpare){
          totalScore += firstThrowScore + secondThrowScore
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

  const frameComplete = () =>{
    setPins(Array(10).fill(false))
    setInputRoll(0)
    setCurrentFrame(currentFrame+1);
    setIsFirstRoll(true)
    if (currentFrame >= farthestFrame)setFarthestFrame(currentFrame+1)
  }

  /**
   * 
   * @param frames 
   * @returns 
   */
  const showFrames = (frames:any) => {
    let upToFrame = (gameComplete? 10: farthestFrame)
    for (var i = 0; i < upToFrame; i++){
      let frame = { ...frames[i] };
      frame.visible = frame.visble ? true: false
      frames[i] = frame;
    }
    return frames
  }

  /**
   * 
   * @param frames 
   * @returns 
   */
  const showFramesToHere = (frames:any, num:number) => {
    let upToFrame = num
    for (var i = 0; i <= upToFrame; i++){
      let frame = { ...frames[i] };
      frame.visible = frame.visble ? true: false
      frames[i] = frame;
    }
    return frames
  }

  //
  const instantSpareToggle = () =>{
    let updatedPins = [...pins];
    const firstBallPins = frames[currentFrame].firstBallPins;
    const firstBallCount = firstBallPins.filter(x => x==true).length;
    for (let i = 0; i <=9; i++){
      if (firstBallPins[i]) continue;
      else{
        updatedPins[i] = !updatedPins[i];
      }
      
    }
    let count = (updatedPins.filter(x => x==true).length-firstBallCount)
    setInputRoll(count)
    setPins(updatedPins)
    
  }
  // It's important to only toggle pins that are still standing after the first throw.
  const handlePinToggle = (index: number) => {
    let updatedPins = [...pins];
    if (isFirstRoll){
      updatedPins[index] = !updatedPins[index];
      
      // Count the number of pins knocked down
      let count = updatedPins.filter(x => x==true).length
      setInputRoll(count)
      setPins(updatedPins);
    }
    else{
      const firstBallPins = frames[currentFrame].firstBallPins
      const firstBallCount = firstBallPins.filter(x => x==true).length
      if (firstBallPins[index]) return;
      else{
        updatedPins[index] = !updatedPins[index];
        let count = (updatedPins.filter(x => x==true).length-firstBallCount)
        setInputRoll(count)
        setPins(updatedPins)
      }
    }
  };

  /**
   * 
   * @param pins the knocked down pins
   * @returns true if a split is detected.
   */
  const checkIsSplit = (pins: boolean[]) =>{
    if (pins[0] === false) return false; // If the headpin (#1) is still standing, it's not a split

    // Convert standing pins into a sorted index string
    const standingPinIndices = pins
      .map((pin, index) => (!pin ? index : null))
      .filter(index => index !== null)
      .join("");
  
    return SPLITS.has(standingPinIndices);
  };
  
  // Handle unique pin toggle of tenth frame
  function tenthFramePinToggle(index: number){
    let updatedPins = [...pins];

    if (isFirstRoll){
      updatedPins[index] = !updatedPins[index];

      // Count the number of pins knocked down
      let count = updatedPins.filter(x => x==true).length
      setInputRoll(count)
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
          setInputRoll(count)
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
            setInputRoll(count)
            setPins(updatedPins)
          }
        }
        else{
          updatedPins[index] = !updatedPins[index];

          // Count the number of pins knocked down
          let count = updatedPins.filter(x => x==true).length
          setInputRoll(count)
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
    },
  });

  // Later in life
  const handlePinSwipe = (swipe_x: number, swipe_y: number) => {
    const padding = 14;

    // Check each pin to see if pin has been swiped on
    for (var i = 0; i <10; i++){
      const x = pinPositions[i].x
      const y = pinPositions[i].y
      
      // Enters if a pin has been swipped on. 
      if(swipe_x < x +padding && swipe_x > x-padding && swipe_y < (y + padding) && swipe_y > (y-padding)){
        // No pin has previously been swipped on. 
        if(pinSwipedOn == -1){
          setPinSwipedOn(i)
          if(currentFrame == 9) {tenthFramePinToggle(i)}
          else {
            handlePinToggle(i)}
        }
        // Pin has already been swipped on. Don't do anything. 
        // This avoids flickering of pins
        else if(pinSwipedOn == i){
          return;
        }
      }
      // This marks a swipe exiting a pin
      else if(pinSwipedOn == i){
        setPinSwipedOn(-1)
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
    else {
      setEdited(false)
    }
  }

  // Complete the edit a previous frame
  const completeEdit = () => {
    setCurrentFrame(gameComplete? 10:farthestFrame);
    setPins(Array(10).fill(false));
    setInputRoll(0);
    setIsFirstRoll(true);
    setEdited(false);
  }

  /**
   * Reset the current frame 
   */
  const frameDelete = (frame:tFrame): tFrame =>{
    frame.firstBallPins = Array(10).fill(false);
    frame.isSpare = false
    frame.isSplit = false
    frame.isStrike = false
    frame.roll1 = ''
    frame.roll2 = ''
    frame.roll3 = ''
    frame.score = 0
    frame.secondBallPins = Array(10).fill(false);
    frame.thirdBallPins = Array(10).fill(false);
    frame.visible = true
    return frame
  }

  /**
   * 
   * @returns 
   */
  const handleEdit = () =>{
    // Get information for first ball
    let rollValue = inputRoll
    let updatedFrames = [...frames];
   
    let frame = updatedFrames[currentFrame];

    
    // Modify Frame for first and second ball
    if(isFirstRoll){
      let newFrame:tFrame = frameDelete(frame);
      newFrame.firstBallPins = pins;
      newFrame.isStrike = rollValue == 10;
      newFrame.roll1 = inputRoll.toString()
      // On strike, clear second ball and pins, mark frame complete.
      if (newFrame.isStrike){
        newFrame.roll2 = '';
        newFrame.secondBallPins = (Array(10).fill(true));
        newFrame.visible = false
        completeEdit()
         // Update frame and future scores. 
        updatedFrames[currentFrame] = newFrame;
        setFrames(calculateTotalScore(updatedFrames));
        return
      }
       // Update frame and future scores. 
      updatedFrames[currentFrame] = newFrame;
      setFrames(calculateTotalScore(updatedFrames));
      setIsFirstRoll(false)
    }else{
      frame.roll2 = inputRoll.toString()
      frame.isSpare = rollValue + parseInt(frame.roll1) == 10;
      frame.secondBallPins = pins;
      frame.visible = true;
      completeEdit()
      updatedFrames[currentFrame] = frame;
      updatedFrames = showFramesToHere(updatedFrames, currentFrame);
      setFrames(calculateTotalScore(updatedFrames));
    }
   
    //calculateScore()
    return
  }

  /**
   * Packs and sends game data to parent
   */
  const updateGame = () =>{
    const game: tGame = {
      frames: frames,
      currentFrame: currentFrame,
      farthestFrame: farthestFrame,
      isFirstRoll: isFirstRoll,
      isFinalRoll: isFinalRoll,
      striking: striking,
      gameComplete: gameComplete,
      edited: edited,
      gameNum: numGames,
      pins: pins,
      finalScore: frames[9].score
    }
    updateCurrentGame(game)
  }

  // Handle Tenth Frame Unique frame scoring and visuals.
  function handleLastFrame() {
    let rollValue = inputRoll;

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
      updatedFrames = showFrames(updatedFrames)
      setFrames(updatedFrames);
      setGameComplete(true)
      toggleBowling(false);
      
      setStriking(false)
      sendDataToParent(updatedFrames);
      return
    }

    if(isFirstRoll){
      // Set the throw.
      frame.roll1 = rollValue.toString();
      frame.firstBallPins = pins;
      frame.isStrike = rollValue == 10;
      frame.isSplit = checkIsSplit(pins)
      frame.score = rollValue + updatedFrames[currentFrame-1].score;
      updatedFrames[currentFrame] = frame;
      
      if (frame.isStrike){
        setPins(Array(10).fill(false));
        setStriking(true);
      }
      else{
        updatedFrames = showFrames(updatedFrames)
        setStriking(false);}
      
      setFrames(calculateTotalScore(updatedFrames));
      setInputRoll(0)
      setIsFirstRoll(false);
    }
    // Second shot of tenth frame
    else{
      frame.roll2 = rollValue.toString()
      frame.secondBallPins = pins
      frame.isSpare = (parseInt(frame.roll1) + parseInt(frame.roll2) == 10 && (!frame.isStrike))
      frame.score = frame.score + rollValue;
      updatedFrames[currentFrame] = frame;
      if (frame.roll2 != '10'){
        updatedFrames = showFrames(updatedFrames)
        setStriking(false);
      }
      if(!frame.isSplit)
        frame.isSplit = checkIsSplit(pins) && frame.roll1 == '10'
      
      setFrames(calculateTotalScore(updatedFrames));
      // User gets an extra shot if spare or strike
      if(frame.isSpare || frame.roll2 == '10'){
        setIsFinalRoll(true)
        setPins(Array(10).fill(false))
        setInputRoll(0)
        setStriking(frame.roll2 == '10');
      }
      else if(frame.isStrike){
        setIsFinalRoll(true)
        setInputRoll(0)
      }
      else{
        toggleBowling(false);
        setGameComplete(true)
        setStriking(false);
      }
    }
  }

  const quickSelect = ()=>{
    if (edited)
      handleEdit();
    else if(currentFrame == 9)
      handleLastFrame();
    else{
      handleManualInput();
    }
  }

  const handleNextShot = () =>{
    // If its the first ball, go to last shot of current frame
    if(isFirstRoll){
      if(frames[currentFrame].isStrike){
        handleNextFrame();
        return;
      }
      setIsFirstRoll(false)
      setPins(frames[currentFrame].secondBallPins)
      setEdited(true)
    }
    // else go to first shot of next frame
    else{
      setIsFirstRoll(true)
      setCurrentFrame(currentFrame+1)
      setPins(frames[currentFrame+1].firstBallPins)
    }
  }
  const handlePreviousShot = () =>{
    // If its the first ball, go to last shot of last frame
    if(isFirstRoll){
      // If last frame is a strike, show the first ball
      if (frames[currentFrame-1].isStrike){
        setCurrentFrame(currentFrame-1);
        setPins(frames[currentFrame-1].firstBallPins)
      }
      else{
        setIsFirstRoll(false)
        setCurrentFrame(currentFrame-1);
        setPins(frames[currentFrame-1].secondBallPins)
      }
    }
    // else go to first shot of current frame
    else{
      setIsFirstRoll(true)
      setPins(frames[currentFrame].firstBallPins)
    }
  }
  const handleNextFrame = () =>{
    setCurrentFrame(currentFrame+1);
    setIsFirstRoll(true)
    setPins(frames[currentFrame+1].firstBallPins)
  }
  const handlePreviousFrame = () =>{
    setCurrentFrame(currentFrame-1);
    setIsFirstRoll(true)
    setPins(frames[currentFrame-1].firstBallPins)
  }

  // This will hold game logic like moving to the next frame on a strike or spare. 
  const handleManualInput = () => {
    // handle editing a different way
    if(edited) 
    // Don't edit unless first ball has been thrown. 
    if (frames[0].roll1 == '' && currentFrame != 0) return
    
    // Get roll value
    let rollValue = inputRoll;

    // Validate input
    if (isNaN(rollValue) || rollValue < 0 || rollValue > 10) {
      console.log(rollValue)
      return};

    // Get frame
    let updatedFrames = [...frames];
    let frame = { ...updatedFrames[currentFrame] };
    
    // If it's the first shot
    if(isFirstRoll){
      // Set the throw.
      frame.roll1 = rollValue.toString();
      frame.firstBallPins = pins;
      frame.isSplit = checkIsSplit(pins)
      frame.isStrike = rollValue == 10;
      
      // Update the frame
      updatedFrames[currentFrame] = frame;
      // Calculate the score
      updatedFrames = calculateTotalScore(updatedFrames)
      if(rollValue!=10 && (striking)) {
        // Show scores of previous frames.
        updatedFrames = showFrames(updatedFrames) 
        setStriking(false)
      }
      if (currentFrame != 0 && updatedFrames[currentFrame-1].isSpare){
        updatedFrames = showFrames(updatedFrames) 
      }
    
      frame.visible = frame.isStrike; // Frames with strikes shouldn't show score
      setFrames(updatedFrames);
      setInputRoll(0)
 
      // Game has been started after successful first throw. 
      if (currentFrame == 0) gameStarted();

      setIsFirstRoll(false);

      if (rollValue == 10 && currentFrame != 9) {
        frameComplete();
        setStriking(true);
      }
    }
    else{
      frame.roll2 = rollValue.toString()
      frame.secondBallPins = pins
      frame.isSpare = (parseInt(frame.roll1) + parseInt(frame.roll2) == 10)
      
      frame.visible = frame.isSpare;
      frame.score = frame.score + rollValue;
      updatedFrames[currentFrame] = frame;
      setFrames(calculateTotalScore(updatedFrames));
      frameComplete()
    }
    saveGame(); 
  };

    return (
      <Animated.View className="items-center p-1  rounded-lg"  >
        {/* Frames Display */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollRef}>
        <View className="flex-row space-x-1 mx-1" >
        {frames.slice(0, 9).map((frame, index) => (
          <TouchableOpacity key={index} onPress={() => handleFrameTouch(index)}>
            <Frame 
            key={index} 
            frameNumber={index + 1} 
            roll1={0} 
            roll2={0} 
            total={frame.visible ? frame.score :  -1}
            isSelected= {currentFrame==index}
            isSplit = {frame.isSplit} 
            selectedShot = {(currentFrame==index && isFirstRoll) ? 'roll1' : (currentFrame==index && !isFirstRoll) ? 'roll2':''}
            />      
          </TouchableOpacity>
        ))}
          
  
          {/* 10th Frame (Only Displayed, Not Editable) */}
          <TenthFrame 
          roll1={0} 
          roll2={0} 
          roll3={0} 
          total={(!gameComplete) ? -1 : frames[9].score}
          isSelected= {currentFrame==9}
          isSplit = {frames[9].isSplit}
          selectedShot={(currentFrame==9 && isFirstRoll) ? 'roll1' : (currentFrame==9 && !isFirstRoll && !isFinalRoll) ? 'roll2': (currentFrame==9 && isFinalRoll) ?
            'roll3' : ''
          }
        />
        </View>
        </ScrollView>
        
        <View className=" flex-row  px-4">
          <Text className="text-2xl text-orange pr-10 justify-between font-bold">
          {gameComplete ? "Game Complete" : `Frame ${currentFrame+1}` }
          </Text>
          <Text className="text-teal pl-10 text-2xl font-bold ">Game: {numGames}</Text>
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
                ref={(el) => (pinRefs.current[index] = el)}
                onPress={() => currentFrame==9 ? tenthFramePinToggle(index) : handlePinToggle(index)} 
                style={{ width: pinSize, height: pinSize, margin: 6, borderRadius: pinSize / 2 }}
                className={`m-2 rounded-full items-center justify-center border-2 shadow-lg ${
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
        <View className="flex-col mt-10 items-center ">
          <TouchableOpacity 
            disabled={!isFirstRoll&&currentFrame!=9}
            onPress={()=>{setInputRoll(10); setPins(Array(10).fill(true)); setQuickSelection('X');
              }}
            className="mx-5 pr-4 pl-2 py-2 rounded-lg items-center"
          >
            <Text className={`text-5xl ${!isFirstRoll&&currentFrame!=9 ? "text-gray-500" : "text-white"} font-pextrabold`}>X</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            disabled={isFirstRoll}
            onPress={()=>{instantSpareToggle(); setQuickSelection('/');}} 
            className="mx-5 mt-4 pr-4 pl-2 py-2 rounded-lg items-center"
          >
            <Text className={`text-5xl ${isFirstRoll ? "text-gray-500" : "text-white"} font-pextrabold`}>/</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>{setInputRoll(0);quickSelect();} }
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
            onPress={handlePreviousFrame} 
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
            onPress={handlePreviousShot}
            disabled={currentFrame==0 && isFirstRoll} 
            className="mr-5 px-1 py-2 rounded-lg"
          >
            <Image source={icons.previousShot}
              className='w-10 h-10'
              resizeMode='contain'
              style={currentFrame==0 && isFirstRoll? {tintColor: "gray"} : {tintColor: "white"}}/>
          </TouchableOpacity>

          {/** Next shot button */}
          <TouchableOpacity 
            onPress={handleNextShot}
            disabled={currentFrame == farthestFrame} 
            className="ml-5 px-1 py-2 rounded-lg"
          >
            <Image source={icons.nextShot}
              className='w-10 h-10'
              resizeMode='contain'
              style={currentFrame== farthestFrame ? {tintColor: "gray"} : {tintColor: "white"}}/>
          </TouchableOpacity>
          {/** Next Frame button */}
          <TouchableOpacity 
            onPress={edited?handleEdit:(currentFrame==9)?handleLastFrame:(currentFrame==farthestFrame)?
              handleManualInput:handleNextFrame} 
            className="m-2  px-4 py-2 rounded-lg"
          >
            <Image source={icons.nextFrame}
              className='w-16 h-16'
              resizeMode='contain'
              style={{tintColor: "white"}}/>
          </TouchableOpacity>

        </View>
        
    </View>
    
    </Animated.View>
    
  
    );
  }
);
  
  export default BowlingGame;