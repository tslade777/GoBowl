import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session } from '../values/types';

// import { tGame } from './types'
// import { SeriesStats } from './types'

interface SessionStore {
  session: Session | null;
  isActive: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
}

const useSessionStore = create<SessionStore>()(
    persist(
      (set) => ({
        session: null,
        isActive: false,
        setSession: (session) =>
          set({
            session,
            isActive: session.activeGame, // you could also hardcode to true if preferred
          }),
        clearSession: () =>
          set({
            session: null,
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