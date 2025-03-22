import { create } from 'zustand'
import { GameStore } from '../values/types'
import { defaultGame } from '../values/defaults'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

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