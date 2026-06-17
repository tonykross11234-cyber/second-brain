import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfileState {
  name: string
  weightKg: number | null
  heightCm: number | null
  age: number | null
  pinEnabled: boolean
  pinCode: string | null
  pinSetupOffered: boolean
  setName: (name: string) => void
  setBiometrics: (fields: { weightKg?: number | null; heightCm?: number | null; age?: number | null }) => void
  enablePin: (code: string) => void
  disablePin: () => void
  markPinSetupOffered: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: '',
      weightKg: null,
      heightCm: null,
      age: null,
      pinEnabled: false,
      pinCode: null,
      pinSetupOffered: false,
      setName: (name) => set({ name }),
      setBiometrics: (fields) => set((state) => ({ ...state, ...fields })),
      enablePin: (code) => set({ pinEnabled: true, pinCode: code, pinSetupOffered: true }),
      disablePin: () => set({ pinEnabled: false, pinCode: null }),
      markPinSetupOffered: () => set({ pinSetupOffered: true }),
    }),
    { name: 'second-brain:profile' }
  )
)
