import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"
import { useAuth } from "./AuthContext"
import { useProfile } from "./ProfileContext"
import type { CommentRow, CommentTargetType } from "../lib/database.types"

export interface EngagementComment {
  id: string
  author: string
  text: string
  timeLabel: string
  likes: number
  likedByMe: boolean
  /** null = top-level comment. Otherwise points to the root top-level comment's id (max 2 levels deep). */
  parentId: string | null
  /** Set for replies: who this reply is addressed to, shown as "@닉네임". */
  replyToAuthor: string | null
}

export interface EngagementRecord {
  likes: number
  dislikes: number
  myVote: "like" | "dislike" | null
  comments: EngagementComment[]
}

const EMPTY_RECORD: EngagementRecord = { likes: 0, dislikes: 0, myVote: null, comments: [] }

interface EngagementContextValue {
  getRecord: (id: string) => EngagementRecord
  ensureSeed: (id: string, likes: number, dislikes: number) => void
  vote: (id: string, type: "like" | "dislike") => void
  loadComments: (targetType: CommentTargetType, id: string) => void
  addComment: (targetType: CommentTargetType, id: string, text: string, parentId?: string, replyToAuthor?: string) => void
  toggleCommentLike: (id: string, commentId: string) => void
}

const EngagementContext = createContext<EngagementContextValue | null>(null)

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

type CommentRowWithAuthor = CommentRow & { author: { nickname: string } | null }

function fromRow(row: CommentRowWithAuthor): EngagementComment {
  return {
    id: row.id,
    author: row.author?.nickname ?? "prism_user",
    text: row.content,
    timeLabel: formatRelativeTime(row.created_at),
    likes: 0,
    likedByMe: false,
    parentId: row.parent_comment_id,
    replyToAuthor: row.reply_to_author,
  }
}

export function EngagementProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [records, setRecords] = useState<Record<string, EngagementRecord>>({})
  const loadedRef = useRef<Set<string>>(new Set())

  const ensureSeed = useCallback((id: string, likes: number, dislikes: number) => {
    setRecords((prev) => (prev[id] ? prev : { ...prev, [id]: { likes, dislikes, myVote: null, comments: [] } }))
  }, [])

  const vote = useCallback((id: string, type: "like" | "dislike") => {
    setRecords((prev) => {
      const current = prev[id] ?? EMPTY_RECORD
      let { likes, dislikes, myVote } = current

      if (myVote === type) {
        if (type === "like") likes -= 1
        else dislikes -= 1
        myVote = null
      } else {
        if (myVote === "like") likes -= 1
        if (myVote === "dislike") dislikes -= 1
        if (type === "like") likes += 1
        else dislikes += 1
        myVote = type
      }

      return { ...prev, [id]: { ...current, likes, dislikes, myVote } }
    })
  }, [])

  const loadComments = useCallback((targetType: CommentTargetType, id: string) => {
    if (!isSupabaseConfigured || loadedRef.current.has(id)) return
    loadedRef.current.add(id)

    supabase
      .from("comments")
      .select("*, author:users(nickname)")
      .eq("target_type", targetType)
      .eq("target_id", id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!data) return
        const comments = (data as CommentRowWithAuthor[]).map(fromRow)
        setRecords((prev) => {
          const current = prev[id] ?? EMPTY_RECORD
          return { ...prev, [id]: { ...current, comments } }
        })
      })
  }, [])

  const addComment = useCallback(
    (targetType: CommentTargetType, id: string, text: string, parentId?: string, replyToAuthor?: string) => {
      const trimmed = text.trim()
      if (!trimmed || !user || !isSupabaseConfigured) return

      const tempId = `comment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const optimistic: EngagementComment = {
        id: tempId,
        author: profile.nickname,
        text: trimmed,
        timeLabel: "방금 전",
        likes: 0,
        likedByMe: false,
        parentId: parentId ?? null,
        replyToAuthor: replyToAuthor ?? null,
      }

      setRecords((prev) => {
        const current = prev[id] ?? EMPTY_RECORD
        return { ...prev, [id]: { ...current, comments: [...current.comments, optimistic] } }
      })

      supabase
        .from("comments")
        .insert({
          target_type: targetType,
          target_id: id,
          author_id: user.id,
          content: trimmed,
          parent_comment_id: parentId ?? null,
          reply_to_author: replyToAuthor ?? null,
        })
        .select("id")
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            console.error("comment insert failed", error)
            return
          }
          setRecords((prev) => {
            const current = prev[id] ?? EMPTY_RECORD
            const comments = current.comments.map((c) => (c.id === tempId ? { ...c, id: (data as { id: string }).id } : c))
            return { ...prev, [id]: { ...current, comments } }
          })
        })
    },
    [user, profile.nickname],
  )

  const toggleCommentLike = useCallback((id: string, commentId: string) => {
    setRecords((prev) => {
      const current = prev[id] ?? EMPTY_RECORD
      const comments = current.comments.map((c) => {
        if (c.id !== commentId) return c
        const likedByMe = !c.likedByMe
        return { ...c, likedByMe, likes: c.likes + (likedByMe ? 1 : -1) }
      })
      return { ...prev, [id]: { ...current, comments } }
    })
  }, [])

  const getRecord = useCallback((id: string) => records[id] ?? EMPTY_RECORD, [records])

  return (
    <EngagementContext.Provider value={{ getRecord, ensureSeed, vote, loadComments, addComment, toggleCommentLike }}>
      {children}
    </EngagementContext.Provider>
  )
}

export function useEngagement() {
  const ctx = useContext(EngagementContext)
  if (!ctx) throw new Error("useEngagement must be used within EngagementProvider")
  return ctx
}
