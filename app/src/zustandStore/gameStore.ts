import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tGame, tFrame } from '../values/types';
import { defaultFrame, defaultGame } from '../values/defaults';
import { calculateTotalScore, changeToFrame, goToNextShot, goToPrevShot, setFirstShot, setSecondShot, setTenthSecondShot, setThirdShot, showAll, showHideScores } from './gameHelpers';

interface ScoreboardStore {
  game: tGame;
  gameComplete: boolean;
  setGame: (game: tGame) => void;
  nextShot: () => void;
  prevShot: () => void;
  changeFrame: (num: number) => void;
  setSelectedShot: (shotNum: number) => void;
  setSelectedFrame: (frameNum: number)=> void;
  enterShot: (count: number, pins: boolean[]) => void;
  setPins: (pins:boolean[]) => void;
  setFrame: (frameNum: number) => void;
  editFrame: (frameNum: number, frameData: Partial<tFrame>) => void;
  deleteFrame: (frameNum: number) => void;
  getScore: (frameNum: number) => number;
  updateGame: (partial: Partial<tGame>) => void;
  resetGame: () => void;
  endGame: () => void;
}

const useGameViewStore = create<ScoreboardStore>()(
  persist(
    (set, get) => ({
    game: JSON.parse(JSON.stringify(defaultGame)),
      gameComplete: false,

      setSelectedShot: (shotNum: number) => {
        const updatedGame = get().game;
        updatedGame.selectedShot = shotNum;
        set({ game: updatedGame });
      },
      nextShot: () => {
        console.log(`[40 gameStore.ts]👆 Next Shot`)
        const updatedGame = goToNextShot(get().game);
        set({ game: updatedGame });
      },
      prevShot: () => {
        const updatedGame = goToPrevShot(get().game);
        set({ game: updatedGame });
      },
      changeFrame:(num:number)=>{
        const updatedGame = changeToFrame(get().game, num);
        set({ game: updatedGame });
      },

      setSelectedFrame: (frameNum: number)=>{
        const updatedGame = get().game;
        updatedGame.currentFrame = frameNum;
        updatedGame.selectedShot = 1;
        set({ game: updatedGame });
      },

      setGame: (game) => set({ game }),

      endGame: ()=>{
        const game = get().game;
        
        set({game:game});
      },

      enterShot: (count: number, pins: boolean[]) => {
        
        const game = get().game;

        let updatedGame = { ...game };
        let currFrame = updatedGame.frames[updatedGame.currentFrame];

        // Check if frame has scores, if so, clear them.
        if(currFrame.roll1 != -1 && currFrame.complete && updatedGame.selectedShot == 1){
            currFrame = {...defaultFrame};
            updatedGame.frames[updatedGame.currentFrame] = currFrame;
        }

        // tenth frame is a little different.
        if(updatedGame.currentFrame == 9){
            if(updatedGame.selectedShot == 1){
                updatedGame = setFirstShot(updatedGame, pins)
                updatedGame.selectedShot = 2;
            }
            else if (updatedGame.selectedShot == 2){
                // Normal frame if first ball is not a strike.
                if (!currFrame.isStrike){
                    updatedGame = setSecondShot(updatedGame, pins)
                    updatedGame.selectedShot = 2;
                    updatedGame.gameComplete = !currFrame.isSpare; // Game over if ball 1 isn't strike and ball 2 isn't spare.
                    updatedGame.selectedShot = currFrame.isSpare ? 3:2;
                }
                else{
                    updatedGame = setTenthSecondShot(updatedGame, pins)
                    updatedGame.selectedShot = 3
                }
            }
            else{
                updatedGame = setThirdShot(updatedGame, pins)
                updatedGame.gameComplete = true;
                updatedGame.selectedShot = 3;
            }
        }

        // Handle first shot
        else if (game.selectedShot==1) {
            updatedGame = setFirstShot(updatedGame, pins)

            if(currFrame.isStrike){
                updatedGame.currentFrame += updatedGame.currentFrame < 9 ? 1:0;
            }
            else
                updatedGame.selectedShot = 2;
        } // Handle second shot
        else if (game.selectedShot == 2) {
            updatedGame = setSecondShot(updatedGame, pins)

            // If it's the tenth, go to last roll if allowed. 
            updatedGame.currentFrame +=1;
            updatedGame.selectedShot = 1;
        } else {
            console.log(`Last shot`)
        }
        updatedGame = calculateTotalScore({...updatedGame})
        updatedGame = showHideScores({...updatedGame});

        set({ game: updatedGame });
      },
      setPins: (pins: boolean[]) =>{

      },

      setFrame: (frameNum: number) => {
        const game = get().game;
        set({
          game: {
            ...game,
            currentFrame: frameNum,
            selectedShot: 0,
          },
        });
      },

      editFrame: (frameNum: number, frameData: Partial<tFrame>) => {
        const game = get().game;
        const updatedFrames = [...game.frames];
        updatedFrames[frameNum] = {
          ...updatedFrames[frameNum],
          ...frameData,
        };

        set({
          game: {
            ...game,
            frames: updatedFrames,
            edited: true,
          },
        });
      },

      deleteFrame: (frameNum: number) => {
        const game = get().game;
        const updatedFrames = game.frames.filter((_, index) => index !== frameNum);
        set({
          game: {
            ...game,
            frames: updatedFrames,
            edited: true,
          },
        });
      },

      getScore: (frameNum: number) => {
        const game = get().game;
        const frame = game.frames[frameNum];
        if (!frame) return 0;
        return (
          frame.roll1 +
          frame.roll2 +
          frame.roll3
        );
      },

      updateGame: (partial: Partial<tGame>) => {
        set({ game: { ...get().game, ...partial } });
      },

      resetGame: () => {
        set({ game: JSON.parse(JSON.stringify(defaultGame)), gameComplete: false });
      },
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
)
);

export default useGameViewStore;
