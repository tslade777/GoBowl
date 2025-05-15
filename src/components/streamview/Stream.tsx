import { View, Text, TouchableOpacity, TextInput, Image, Animated, ActivityIndicator  } from 'react-native';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Frame from '@/src/components/scoreboard/Frame';
import TenthFrame from '@/src/components/scoreboard/TenthFrame';
import { db } from '@/firebase.config'
import { doc, onSnapshot } from 'firebase/firestore';
import { Game, tFrame, tGame } from '@/src/values/types';
import icons from '@/src/constants/icons';
import { defaultFrame } from '@/src/values/defaults';
import Toast from 'react-native-toast-message';

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
  
  const [frames, setFrames] = useState<tFrame[]>(Array(10).fill({ ...defaultFrame }));
  const [games, setGames] = useState<Game[]>([])
  const [currentFrame, setCurrentFrame] = useState(0);
  const [farthestFrame, setFarthestFrame] = useState(0);
  const [gameComplete, setGameComplete] = useState(false)
  const [pins, setPins] = useState(Array(10).fill(false)); // Track knocked-down pins
  const [index, setIndex] = useState(0);
  const [currGameNum, setCurrGameNum] = useState(0);
  const [gameNum, setGameNum] = useState(0);
  const [selectedShot, setSelectedShot] = useState(1)
  const viewingHistoryRef = useRef(false);

  const [loading, setLoading] = useState(true);


  // 🛑 Ensure Unsubscription When Component Unmounts
  useEffect(() => {
    
    const unsubscribe = updateFirebaseCurrentGame();

    return () => {
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
            Toast.show({
              type: 'customInfo',
              text1: `${username} is no longer live!`,
              text2: `Stay and reveiw their games or leave if you'd like`,
              position: 'bottom',
              bottomOffset: 100,
              visibilityTime: 4000,
            });
          }

          // The user is viewing previous games and shouldn't be pulled to the current game
          if (viewingHistoryRef.current){
            return
          }
          else{
            
            const gamesData: Game[] = docSnap.data().games;
            if (!gamesData) return;
            const currentGame: tGame = gamesData[gamesData.length-1].game;
            setGames(gamesData||[])
            setCurrGameNum(currentGame.gameNum)
            setFrames(currentGame.frames);
            setCurrentFrame(currentGame.currentFrame);
            setFarthestFrame(currentGame.currentFrame)
            setIndex(gamesData.length-1)
            setSelectedShot(currentGame.selectedShot)
            
            
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
      viewingHistoryRef.current = false
      updateFirebaseCurrentGame();
    }
    else if (index < games.length-2){
      viewingHistoryRef.current = true
      setGame(games[index+1].game)
      setIndex(index+1)
    }
    else return
  }

  const previousGame = () =>{
    
    // Next game will be current game
    if (index > 0){
      viewingHistoryRef.current = true
      setGame(games[index-1].game)
      setIndex(index-1)
    }
    else return
  }

  /**
   * Go to the next shot. 
   * 
   * @param game The current game to be updated
   * @returns the new updated game
   */
  const goToNextShot = () => {
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

  /**
   * Set the Game as it's updated from firebase.
   * @param game The game that needs to be displayed. 
   */
  const setGame = (game: tGame) =>{
    console.warn(`Setting game`)
    setCurrentFrame(game.currentFrame)
    setFarthestFrame(game.farthestFrame)
    setGameComplete(Boolean(game.gameComplete))
    setPins(game.pins)
    setFrames(game.frames)
    setGameNum(game.gameNum)
    setSelectedShot(game.selectedShot)
  }
  
  // Update frame selection. Call back for frame touch event.
  // Only update if 
  const handleFrameTouch = (index: number) => {
    const touchedFrame = frames[index];
    if(touchedFrame.roll1 == -1 && index != 0 && frames[index-1].roll1 == -1)
        return;
    setSelectedShot(1)
    setCurrentFrame(index)
  }

    return (
      <Animated.View className="items-center p-1 bg-primary  rounded-lg "  >
        {/* Frames Display */}
        {loading ?<ActivityIndicator size='large' color='#F24804' /> : <View className="flex-row space-x-1" >

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
        
        {/* Manual Input Controls */}
          <View className="flex-col mt-4 items-center"> 
            <View className='flex-row justify-evenly items-center' >
              {/** Previous Frame button */}
              <TouchableOpacity 
                onPress={()=>{changeToFrame(-1)}}
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
                onPress={()=>{goToPrevShot()}}
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
                onPress={()=>{goToNextShot();}}
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
                onPress={()=>{changeToFrame(1)}} 
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
      <View className="">
            
        </View>
      </Animated.View>
    
  
    );
  }
);
  
  export default Stream;