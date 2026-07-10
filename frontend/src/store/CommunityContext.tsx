import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"
import { useAuth } from "./AuthContext"
import { useProfile } from "./ProfileContext"
import type { PostRow } from "../lib/database.types"

export type PostCategory = "자유수다" | "코디 추천" | "질문"

export const POST_CATEGORIES: PostCategory[] = ["자유수다", "코디 추천", "질문"]

export const CATEGORY_STYLES: Record<PostCategory, { light: string; dark: string }> = {
  "자유수다": { light: "bg-sky-100 text-sky-700", dark: "dark:bg-sky-500/15 dark:text-sky-300" },
  "코디 추천": { light: "bg-violet-100 text-violet-700", dark: "dark:bg-violet-500/15 dark:text-violet-300" },
  "질문": { light: "bg-amber-100 text-amber-700", dark: "dark:bg-amber-500/15 dark:text-amber-300" },
}

export interface CommunityPost {
  id: string
  category: PostCategory
  title: string
  content: string
  author: string
  timeLabel: string
  seedLikes: number
  seedDislikes: number
  seedViews: number
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return "방금 전"
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days === 1) return "어제"
  if (days < 7) return `${days}일 전`
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
}

type PostRowWithAuthor = PostRow & { author: { nickname: string } | null }

function fromRow(row: PostRowWithAuthor): CommunityPost {
  return {
    id: row.id,
    category: row.category as PostCategory,
    title: row.title,
    content: row.content,
    author: row.author?.nickname ?? "prism_user",
    timeLabel: formatRelativeTime(row.created_at),
    seedLikes: 0,
    seedDislikes: 0,
    seedViews: row.view_count,
  }
}

interface CommunityContextValue {
  posts: CommunityPost[]
  loading: boolean
  addPost: (title: string, content: string, category: PostCategory) => Promise<CommunityPost | null>
  getPost: (id: string) => CommunityPost | undefined
  viewCounts: Record<string, number>
  recordView: (id: string) => void
}

const CommunityContext = createContext<CommunityContextValue | null>(null)

export function CommunityProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    let cancelled = false
    supabase
      .from("posts")
      .select("*, author:users(nickname)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return
        setPosts(((data ?? []) as PostRowWithAuthor[]).map(fromRow))
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const addPost = async (title: string, content: string, category: PostCategory): Promise<CommunityPost | null> => {
    if (!user || !isSupabaseConfigured) return null

    const { data, error } = await supabase
      .from("posts")
      .insert({ author_id: user.id, category, title: title.trim(), content: content.trim() })
      .select("*")
      .single()

    if (error || !data) {
      console.error("post insert failed", error)
      return null
    }

    const post = fromRow({ ...(data as PostRow), author: { nickname: profile.nickname } })
    setPosts((prev) => [post, ...prev])
    return post
  }

  const getPost = (id: string) => posts.find((p) => p.id === id)

  const recordView = (id: string) => {
    setViewCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
    if (isSupabaseConfigured) {
      supabase.rpc("increment_post_view", { post_id: id }).then(undefined, (err: unknown) => console.error("view increment failed", err))
    }
  }

  return (
    <CommunityContext.Provider value={{ posts, loading, addPost, getPost, viewCounts, recordView }}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const ctx = useContext(CommunityContext)
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider")
  return ctx
}
