import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tGame, tFrame } from '../values/types';
import { defaultGame } from '../values/defaults';
import { changeToFrame, goToNextShot, goToPrevShot, setFirstShot, setSecondShot } from './gameHelpers';

interface ScoreboardStore {
  game: tGame;
  gameComplete: boolean;
  setGame: (game: tGame) => void;
  nextShot: () => void;
  prevShot: () => void;
  changeFrame: (num: number) => void;
  setSelectedShot: (shotNum: number) => void;
  setCurrentFrame: (frameNum: number)=> void;
  enterShot: (count: number, pins: boolean[]) => void;
  setPins: (pins:boolean[]) => void;
  setFrame: (frameNum: number) => void;
  editFrame: (frameNum: number, frameData: Partial<tFrame>) => void;
  deleteFrame: (frameNum: number) => void;
  getScore: (frameNum: number) => number;
  updateGame: (partial: Partial<tGame>) => void;
  resetGame: () => void;
}

const useGameViewStore = create<ScoreboardStore>()(
  persist(
    (set, get) => ({
      game: defaultGame,
      gameComplete: false,

      setSelectedShot: (shotNum: number) => {
        const updatedGame = get().game;
        updatedGame.selectedShot = shotNum;
        set({ game: updatedGame });
      },
      nextShot: () => {
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

      setCurrentFrame: (frameNum: number)=>{
        console.log(`✅ frame changed`)
        const updatedGame = get().game;
        updatedGame.currentFrame = frameNum;
        updatedGame.selectedShot = 1;
        set({ game: updatedGame });
      },

      setGame: (game) => set({ game }),

      enterShot: (count: number, pins: boolean[]) => {
        
        const game = get().game;
        const currentFrameIndex = game.currentFrame;
        const frame = game.frames[currentFrameIndex] || {
          roll1: -1,
          roll2: -1,
          roll3: -1,
          firstBallPins: [],
          secondBallPins: [],
          thirdBallPins: [],
          isSpare: false,
          isStrike: false,
          score: 0,
          visible: true,
          isSplit: false,
        };

        let updatedGame = { ...game };

        if (game.selectedShot==1) {
            console.log(`First ball`)
            updatedGame = setFirstShot(updatedGame, pins)
            let currFrame = updatedGame.frames[updatedGame.currentFrame];

            if(currFrame.isStrike)
                updatedGame.currentFrame += updatedGame.currentFrame < 9 ? 1:0;
            else
                updatedGame.selectedShot = 2;
          
        } 
        else if (game.selectedShot == 2) {
            console.log(`second ball`)
            updatedGame = setSecondShot(updatedGame, pins)
            updatedGame.currentFrame +=1;
            updatedGame.selectedShot = 1;
        } else {
          frame.roll3 = count;
          frame.thirdBallPins = pins;
          updatedGame.isFinalRoll = false;
          updatedGame.isFirstRoll = true;
        }

        updatedGame.frames[currentFrameIndex] = frame;
        updatedGame.pins = pins;
        updatedGame.edited = true;

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
        set({ game: defaultGame, gameComplete: false });
      },
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
)
);

export default useGameViewStore;
