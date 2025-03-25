import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session } from '../values/types';
import { defaultSession } from '../values/defaults';

// import { tGame } from './types'
// import { SeriesStats } from './types'

interface SessionStore {
  session: Session;
  isActive: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
}

const useSessionStore = create<SessionStore>()(
    persist(
      (set) => ({
        session: {...defaultSession},
        isActive: false,
        setSession: (session) =>
          set({
            session,
            isActive: session.activeGame, // you could also hardcode to true if preferred
          }),
        clearSession: () =>
          set({
            session: {...defaultSession},
            isActive: false,
          }),
      }),
      {
        name: 'session-storage',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )

export default useSessionStore