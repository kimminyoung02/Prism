import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

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
  ensureSeed: (id: string, likes: number, dislikes: number, comments?: EngagementComment[]) => void
  vote: (id: string, type: "like" | "dislike") => void
  addComment: (id: string, text: string, parentId?: string, replyToAuthor?: string) => void
  toggleCommentLike: (id: string, commentId: string) => void
}

const EngagementContext = createContext<EngagementContextValue | null>(null)

export function EngagementProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<Record<string, EngagementRecord>>({})

  const ensureSeed = useCallback((id: string, likes: number, dislikes: number, comments: EngagementComment[] = []) => {
    setRecords((prev) => (prev[id] ? prev : { ...prev, [id]: { likes, dislikes, myVote: null, comments } }))
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

  const addComment = useCallback((id: string, text: string, parentId?: string, replyToAuthor?: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setRecords((prev) => {
      const current = prev[id] ?? EMPTY_RECORD
      const comment: EngagementComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        author: "prism_user",
        text: trimmed,
        timeLabel: "방금 전",
        likes: 0,
        likedByMe: false,
        parentId: parentId ?? null,
        replyToAuthor: replyToAuthor ?? null,
      }
      return { ...prev, [id]: { ...current, comments: [...current.comments, comment] } }
    })
  }, [])

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
    <EngagementContext.Provider value={{ getRecord, ensureSeed, vote, addComment, toggleCommentLike }}>
      {children}
    </EngagementContext.Provider>
  )
}

export function useEngagement() {
  const ctx = useContext(EngagementContext)
  if (!ctx) throw new Error("useEngagement must be used within EngagementProvider")
  return ctx
}
