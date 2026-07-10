import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"
import { useAuth } from "./AuthContext"
import { useProfile } from "./ProfileContext"
import type { CommentRow, CommentTargetType, VoteTargetType, VoteType } from "../lib/database.types"

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
  myVote: VoteType | null
  comments: EngagementComment[]
}

const EMPTY_RECORD: EngagementRecord = { likes: 0, dislikes: 0, myVote: null, comments: [] }

interface EngagementContextValue {
  getRecord: (id: string) => EngagementRecord
  loadVotes: (targetType: VoteTargetType, id: string) => void
  vote: (targetType: VoteTargetType, id: string, type: VoteType) => void
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
  const recordsRef = useRef<Record<string, EngagementRecord>>({})
  const votesLoadedRef = useRef<Set<string>>(new Set())
  const commentsLoadedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    recordsRef.current = records
  }, [records])

  const loadVotes = useCallback(
    (targetType: VoteTargetType, id: string) => {
      if (!isSupabaseConfigured || votesLoadedRef.current.has(id)) return
      votesLoadedRef.current.add(id)

      supabase
        .from("likes")
        .select("user_id, vote_type")
        .eq("target_type", targetType)
        .eq("target_id", id)
        .then(({ data }) => {
          if (!data) return
          const rows = data as { user_id: string; vote_type: VoteType }[]
          const likes = rows.filter((r) => r.vote_type === "like").length
          const dislikes = rows.filter((r) => r.vote_type === "dislike").length
          const myVote = user ? (rows.find((r) => r.user_id === user.id)?.vote_type ?? null) : null
          setRecords((prev) => {
            const current = prev[id] ?? EMPTY_RECORD
            return { ...prev, [id]: { ...current, likes, dislikes, myVote } }
          })
        })
    },
    [user],
  )

  const vote = useCallback(
    (targetType: VoteTargetType, id: string, type: VoteType) => {
      if (!user || !isSupabaseConfigured) return

      const current = recordsRef.current[id] ?? EMPTY_RECORD
      const nextVote = current.myVote === type ? null : type

      setRecords((prev) => {
        const cur = prev[id] ?? EMPTY_RECORD
        let { likes, dislikes } = cur
        if (cur.myVote === type) {
          if (type === "like") likes -= 1
          else dislikes -= 1
        } else {
          if (cur.myVote === "like") likes -= 1
          if (cur.myVote === "dislike") dislikes -= 1
          if (type === "like") likes += 1
          else dislikes += 1
        }
        return { ...prev, [id]: { ...cur, likes, dislikes, myVote: nextVote } }
      })

      if (nextVote === null) {
        supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("target_type", targetType)
          .eq("target_id", id)
          .then(undefined, (err: unknown) => console.error("vote delete failed", err))
      } else {
        supabase
          .from("likes")
          .upsert(
            { user_id: user.id, target_type: targetType, target_id: id, vote_type: nextVote },
            { onConflict: "user_id,target_type,target_id" },
          )
          .then(undefined, (err: unknown) => console.error("vote upsert failed", err))
      }
    },
    [user],
  )

  const loadComments = useCallback(
    (targetType: CommentTargetType, id: string) => {
      if (!isSupabaseConfigured || commentsLoadedRef.current.has(id)) return
      commentsLoadedRef.current.add(id)

      supabase
        .from("comments")
        .select("*, author:users(nickname)")
        .eq("target_type", targetType)
        .eq("target_id", id)
        .order("created_at", { ascending: true })
        .then(async ({ data }) => {
          if (!data) return
          const rows = data as CommentRowWithAuthor[]
          const commentIds = rows.map((r) => r.id)

          const likeCounts: Record<string, number> = {}
          const myLiked = new Set<string>()
          if (commentIds.length > 0) {
            const { data: likeRows } = await supabase
              .from("likes")
              .select("target_id, user_id")
              .eq("target_type", "comment")
              .in("target_id", commentIds)
            for (const row of (likeRows ?? []) as { target_id: string; user_id: string }[]) {
              likeCounts[row.target_id] = (likeCounts[row.target_id] ?? 0) + 1
              if (user && row.user_id === user.id) myLiked.add(row.target_id)
            }
          }

          const comments = rows.map((r) => ({
            ...fromRow(r),
            likes: likeCounts[r.id] ?? 0,
            likedByMe: myLiked.has(r.id),
          }))

          setRecords((prev) => {
            const current = prev[id] ?? EMPTY_RECORD
            return { ...prev, [id]: { ...current, comments } }
          })
        })
    },
    [user],
  )

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

  const toggleCommentLike = useCallback(
    (id: string, commentId: string) => {
      if (!user || !isSupabaseConfigured) return

      const current = recordsRef.current[id] ?? EMPTY_RECORD
      const comment = current.comments.find((c) => c.id === commentId)
      if (!comment) return
      const nextLiked = !comment.likedByMe

      setRecords((prev) => {
        const cur = prev[id] ?? EMPTY_RECORD
        const comments = cur.comments.map((c) =>
          c.id === commentId ? { ...c, likedByMe: nextLiked, likes: c.likes + (nextLiked ? 1 : -1) } : c,
        )
        return { ...prev, [id]: { ...cur, comments } }
      })

      if (nextLiked) {
        supabase
          .from("likes")
          .upsert(
            { user_id: user.id, target_type: "comment", target_id: commentId, vote_type: "like" },
            { onConflict: "user_id,target_type,target_id" },
          )
          .then(undefined, (err: unknown) => console.error("comment like upsert failed", err))
      } else {
        supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("target_type", "comment")
          .eq("target_id", commentId)
          .then(undefined, (err: unknown) => console.error("comment like delete failed", err))
      }
    },
    [user],
  )

  const getRecord = useCallback((id: string) => records[id] ?? EMPTY_RECORD, [records])

  return (
    <EngagementContext.Provider value={{ getRecord, loadVotes, vote, loadComments, addComment, toggleCommentLike }}>
      {children}
    </EngagementContext.Provider>
  )
}

export function useEngagement() {
  const ctx = useContext(EngagementContext)
  if (!ctx) throw new Error("useEngagement must be used within EngagementProvider")
  return ctx
}
