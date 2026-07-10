import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"

interface AuthResult {
  error: string | null
  needsEmailConfirm?: boolean
}

export type OAuthProvider = "google" | "kakao"

interface AuthContextValue {
  isLoggedIn: boolean
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, nickname: string) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signInWithOAuth: (provider: OAuthProvider) => Promise<AuthResult>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않아요"
  if (message.includes("User already registered")) return "이미 가입된 이메일이에요"
  if (message.includes("Password should be at least")) return "비밀번호는 6자 이상이어야 해요"
  if (message.includes("Unable to validate email address")) return "이메일 형식이 올바르지 않아요"
  if (message.toLowerCase().includes("provider is not enabled")) return "아직 Supabase에 이 로그인 방식이 설정되지 않았어요"
  return message
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, nickname: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) return { error: "Supabase 연결 설정이 필요해요" }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    })

    if (error) return { error: translateAuthError(error.message) }
    if (!data.session) return { error: null, needsEmailConfirm: true }
    return { error: null }
  }

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) return { error: "Supabase 연결 설정이 필요해요" }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: translateAuthError(error.message) }
    return { error: null }
  }

  const signInWithOAuth = async (provider: OAuthProvider): Promise<AuthResult> => {
    if (!isSupabaseConfigured) return { error: "Supabase 연결 설정이 필요해요" }

    // 성공 시 Supabase가 이 주소로 세션을 담아 돌려보냄(전체 페이지 리다이렉트)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/my` },
    })
    if (error) return { error: translateAuthError(error.message) }
    return { error: null }
  }

  const logout = async () => {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: session !== null,
        user: session?.user ?? null,
        loading,
        signUp,
        signIn,
        signInWithOAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
