import { create } from 'zustand'
import { tGame } from '../values/types'
import { defaultGame } from '../values/defaults'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface GameStore {
  game: tGame;
  isSaved: boolean
  setGame: (game: tGame) => void;
  updateGame: (partial: Partial<tGame>) => void;
  resetGame: () => void;
  markSaved: () => void;
  markUnsaved: () => void;
}

const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      game: defaultGame,
      isSaved: false,
      setGame: (game) => set({ game }),
      updateGame: (partial) =>
        set((state) => ({
          game: { ...state.game, ...partial },
        })),
      resetGame: () => set({ game: defaultGame }),
      markSaved: () => set({ isSaved: true }),
      markUnsaved: () => set({ isSaved: false }),
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

  export default useGameStore