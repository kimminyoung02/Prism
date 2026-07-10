import { useEffect } from "react"
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"
import { useEngagement } from "../store/EngagementContext"

interface EngagementBarProps {
  id: string
  seedLikes?: number
  seedDislikes?: number
  commentsOpen: boolean
  onToggleComments: () => void
}

export default function EngagementBar({ id, seedLikes = 0, seedDislikes = 0, commentsOpen, onToggleComments }: EngagementBarProps) {
  const { getRecord, ensureSeed, vote } = useEngagement()

  useEffect(() => {
    ensureSeed(id, seedLikes, seedDislikes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const record = getRecord(id)

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => vote(id, "like")}
        aria-pressed={record.myVote === "like"}
        aria-label="도움돼요"
        className={
          "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-150 " +
          (record.myVote === "like"
            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
            : "bg-neutral-100 text-neutral-500 hover:text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200")
        }
      >
        <ThumbsUp size={13} fill={record.myVote === "like" ? "currentColor" : "none"} />
        {record.likes}
      </button>
      <button
        type="button"
        onClick={() => vote(id, "dislike")}
        aria-pressed={record.myVote === "dislike"}
        aria-label="별로예요"
        className={
          "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-150 " +
          (record.myVote === "dislike"
            ? "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
            : "bg-neutral-100 text-neutral-500 hover:text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200")
        }
      >
        <ThumbsDown size={13} fill={record.myVote === "dislike" ? "currentColor" : "none"} />
        {record.dislikes}
      </button>
      <button
        type="button"
        onClick={onToggleComments}
        aria-expanded={commentsOpen}
        className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 transition-colors duration-150 hover:text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        <MessageCircle size={13} />
        댓글 {record.comments.length}개
      </button>
    </div>
  )
}
