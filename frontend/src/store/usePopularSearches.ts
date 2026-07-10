import { useEffect, useState } from "react"
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"

export interface PopularSearchTerm {
  term: string
  count: number
}

export function usePopularSearches(limit = 10): PopularSearchTerm[] {
  const [terms, setTerms] = useState<PopularSearchTerm[]>([])

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false
    supabase
      .from("popular_searches")
      .select("query, search_count")
      .order("search_count", { ascending: false })
      .limit(limit)
      .then(({ data }) => {
        if (cancelled || !data) return
        setTerms((data as { query: string; search_count: number }[]).map((row) => ({ term: row.query, count: row.search_count })))
      })

    return () => {
      cancelled = true
    }
  }, [limit])

  return terms
}
