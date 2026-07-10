import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"
import { useAuth } from "./AuthContext"

export interface Profile {
  nickname: string
  email: string
  avatarIndex: number
  avatarPhoto?: string
}

interface ProfileContextValue {
  profile: Profile
  updateProfile: (profile: Profile) => Promise<{ error: string | null }>
}

export const DEFAULT_PROFILE: Profile = {
  nickname: "prism_user",
  email: "",
  avatarIndex: 0,
}

export const AVATAR_STYLES = [
  { bg: "bg-brand-50 dark:bg-brand-500/10", fg: "text-brand-500" },
  { bg: "bg-sky-50 dark:bg-sky-500/10", fg: "text-sky-500" },
  { bg: "bg-emerald-50 dark:bg-emerald-500/10", fg: "text-emerald-500" },
  { bg: "bg-pink-50 dark:bg-pink-500/10", fg: "text-pink-500" },
]

function parseAvatarUrl(avatarUrl: string | null): { avatarIndex: number; avatarPhoto?: string } {
  if (!avatarUrl) return { avatarIndex: 0 }
  if (avatarUrl.startsWith("avatar-")) {
    const i = Number(avatarUrl.slice(7))
    return { avatarIndex: Number.isFinite(i) && i >= 0 && i < AVATAR_STYLES.length ? i : 0 }
  }
  return { avatarIndex: 0, avatarPhoto: avatarUrl }
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)

  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setProfile(DEFAULT_PROFILE)
      return
    }

    let cancelled = false
    supabase
      .from("users")
      .select("nickname, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (cancelled || !data) return
        setProfile({ nickname: data.nickname, email: user.email ?? "", ...parseAvatarUrl(data.avatar_url) })
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const updateProfile = async (next: Profile): Promise<{ error: string | null }> => {
    if (!user || !isSupabaseConfigured) return { error: "Supabase 연결 설정이 필요해요" }

    if (next.email && next.email !== (user.email ?? "")) {
      const { error } = await supabase.auth.updateUser({ email: next.email })
      if (error) return { error: error.message }
    }

    const { error } = await supabase
      .from("users")
      .update({
        nickname: next.nickname,
        avatar_url: next.avatarPhoto ?? `avatar-${next.avatarIndex}`,
      })
      .eq("id", user.id)

    if (error) return { error: error.message }

    setProfile(next)
    return { error: null }
  }

  return <ProfileContext.Provider value={{ profile, updateProfile }}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider")
  return ctx
}
