import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { MyListItem } from "../mock/data"
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"
import { useAuth } from "./AuthContext"

const MAX_RECENT_SEARCHES = 8
const MAX_VIEWED_PRODUCTS = 20

interface ActivityContextValue {
  recentSearches: string[]
  addSearch: (term: string) => void
  viewedProducts: MyListItem[]
  recordProductView: (title: string, rating: number) => void
  analysisRunCount: number
  incrementAnalysisRun: () => void
}

const ActivityContext = createContext<ActivityContextValue | null>(null)

function formatToday() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}.${m}.${d}`
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [viewedProducts, setViewedProducts] = useState<MyListItem[]>([])
  const [analysisRunCount, setAnalysisRunCount] = useState(0)

  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setRecentSearches([])
      return
    }

    let cancelled = false
    supabase
      .from("search_history")
      .select("query")
      .eq("user_id", user.id)
      .order("searched_at", { ascending: false })
      .limit(MAX_RECENT_SEARCHES * 3)
      .then(({ data }) => {
        if (cancelled || !data) return
        const deduped: string[] = []
        for (const row of data as { query: string }[]) {
          if (!deduped.includes(row.query)) deduped.push(row.query)
          if (deduped.length >= MAX_RECENT_SEARCHES) break
        }
        setRecentSearches(deduped)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const addSearch = (term: string) => {
    const trimmed = term.trim()
    if (!trimmed) return
    setRecentSearches((prev) => [trimmed, ...prev.filter((t) => t !== trimmed)].slice(0, MAX_RECENT_SEARCHES))

    if (user && isSupabaseConfigured) {
      supabase
        .from("search_history")
        .insert({ user_id: user.id, query: trimmed })
        .then(undefined, (err: unknown) => console.error("search_history insert failed", err))
    }
  }

  const recordProductView = (title: string, rating: number) => {
    setViewedProducts((prev) => {
      const existing = prev.find((item) => item.title === title)
      const entry: MyListItem = {
        id: existing?.id ?? `view-${Date.now()}`,
        title,
        date: formatToday(),
        rating,
        reviewCount: existing?.reviewCount,
        aiComment: existing?.aiComment,
      }
      return [entry, ...prev.filter((item) => item.title !== title)].slice(0, MAX_VIEWED_PRODUCTS)
    })
  }

  const incrementAnalysisRun = () => setAnalysisRunCount((c) => c + 1)

  return (
    <ActivityContext.Provider
      value={{ recentSearches, addSearch, viewedProducts, recordProductView, analysisRunCount, incrementAnalysisRun }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const ctx = useContext(ActivityContext)
  if (!ctx) throw new Error("useActivity must be used within ActivityProvider")
  return ctx
}
