// /zustand/userStore.ts
import { create } from 'zustand'

export interface User {
  id: string
  firstName?: string
  lastName?: string
  role?: string
  email?: string
  profileImage?: string
  accessToken?: string
}

interface UserState {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
