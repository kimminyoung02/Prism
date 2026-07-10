import { useEffect } from "react"
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"
import { useEngagement } from "../store/EngagementContext"

interface EngagementBarProps {
  id: string
  seedLikes?: number
  seedDislikes?: number
  commentsOpen: boolean
  onToggleComments: () => void
  showDislike?: boolean
}

export default function EngagementBar({ id, seedLikes = 0, seedDislikes = 0, commentsOpen, onToggleComments, showDislike = true }: EngagementBarProps) {
  const { getRecord, ensureSeed, vote } = useEngagement()

  useEffect(() => {
    ensureSeed(id, seedLikes, seedDislikes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const record = getRecord(id)

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => vote(id, "like")}
        aria-pressed={record.myVote === "like"}
        aria-label="도움돼요"
        className={
          "flex items-center gap-1 text-xs font-medium transition-colors duration-150 " +
          (record.myVote === "like"
            ? "text-emerald-500"
            : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300")
        }
      >
        <ThumbsUp size={14} fill={record.myVote === "like" ? "currentColor" : "none"} />
        {record.likes}
      </button>
      {showDislike && (
        <button
          type="button"
          onClick={() => vote(id, "dislike")}
          aria-pressed={record.myVote === "dislike"}
          aria-label="별로예요"
          className={
            "flex items-center gap-1 text-xs font-medium transition-colors duration-150 " +
            (record.myVote === "dislike"
              ? "text-rose-500"
              : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300")
          }
        >
          <ThumbsDown size={14} fill={record.myVote === "dislike" ? "currentColor" : "none"} />
          {record.dislikes}
        </button>
      )}
      <button
        type="button"
        onClick={onToggleComments}
        aria-expanded={commentsOpen}
        className="flex items-center gap-1 text-xs font-medium text-neutral-400 transition-colors duration-150 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
      >
        <MessageCircle size={14} />
        댓글 {record.comments.length}개
      </button>
    </div>
  )
}
