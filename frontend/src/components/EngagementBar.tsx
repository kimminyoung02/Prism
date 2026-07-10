import { useEffect } from "react"
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"
import { useEngagement } from "../store/EngagementContext"
import type { CommentTargetType } from "../lib/database.types"

interface EngagementBarProps {
  id: string
  targetType: CommentTargetType
  commentsOpen: boolean
  onToggleComments: () => void
  showDislike?: boolean
}

export default function EngagementBar({ id, targetType, commentsOpen, onToggleComments, showDislike = true }: EngagementBarProps) {
  const { getRecord, loadVotes, loadComments, vote } = useEngagement()

  useEffect(() => {
    loadVotes(targetType, id)
    // 댓글 카드/버튼에 개수를 정확히 보여주려면 펼치기 전에도 미리 불러와둬야 함
    loadComments(targetType, id)
  }, [targetType, id, loadVotes, loadComments])

  const record = getRecord(id)

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => vote(targetType, id, "like")}
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
          onClick={() => vote(targetType, id, "dislike")}
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
