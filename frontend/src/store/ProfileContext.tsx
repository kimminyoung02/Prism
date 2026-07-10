import { createContext, useContext, useState, type ReactNode } from "react"

export interface Profile {
  nickname: string
  email: string
  avatarIndex: number
  avatarPhoto?: string
}

interface ProfileContextValue {
  profile: Profile
  updateProfile: (profile: Profile) => void
}

export const DEFAULT_PROFILE: Profile = {
  nickname: "prism_user",
  email: "user@example.com",
  avatarIndex: 0,
}

export const AVATAR_STYLES = [
  { bg: "bg-brand-50 dark:bg-brand-500/10", fg: "text-brand-500" },
  { bg: "bg-sky-50 dark:bg-sky-500/10", fg: "text-sky-500" },
  { bg: "bg-emerald-50 dark:bg-emerald-500/10", fg: "text-emerald-500" },
  { bg: "bg-pink-50 dark:bg-pink-500/10", fg: "text-pink-500" },
]

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)

  return <ProfileContext.Provider value={{ profile, updateProfile: setProfile }}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider")
  return ctx
}
