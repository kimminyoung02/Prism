import { useEffect, useState } from "react"
import { Heart, ArrowUp } from "lucide-react"
import { useEngagement, type EngagementComment } from "../store/EngagementContext"
import type { CommentTargetType } from "../lib/database.types"

interface CommentRowProps {
  id: string
  comment: EngagementComment
  rootId: string
  isReply: boolean
  replyingId: string | null
  replyDraft: string
  onStartReply: (commentId: string) => void
  onChangeDraft: (value: string) => void
  onSubmitReply: (rootId: string, replyToAuthor: string) => void
}

function CommentRow({ id, comment, rootId, isReply, replyingId, replyDraft, onStartReply, onChangeDraft, onSubmitReply }: CommentRowProps) {
  const { toggleCommentLike } = useEngagement()

  return (
    <div className={isReply ? "ml-5 border-l-2 border-neutral-100 pl-3 dark:border-white/10" : ""}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{comment.author}</span>
        <span className="text-[11px] text-neutral-400 dark:text-neutral-500">{comment.timeLabel}</span>
      </div>
      <p className="text-xs text-neutral-600 dark:text-neutral-300">
        {comment.replyToAuthor && <span className="font-medium text-brand-500 dark:text-brand-400">@{comment.replyToAuthor} </span>}
        {comment.text}
      </p>
      <div className="mt-1 flex items-center gap-3">
        <button
          type="button"
          onClick={() => toggleCommentLike(id, comment.id)}
          aria-pressed={comment.likedByMe}
          className={
            "flex items-center gap-1 text-[11px] font-medium transition-colors duration-150 " +
            (comment.likedByMe ? "text-rose-500" : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300")
          }
        >
          <Heart size={11} fill={comment.likedByMe ? "currentColor" : "none"} />
          {comment.likes}
        </button>
        <button
          type="button"
          onClick={() => onStartReply(comment.id)}
          className="text-[11px] font-medium text-neutral-400 transition-colors duration-150 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
        >
          답글 달기
        </button>
      </div>

      {replyingId === comment.id && (
        <div className="mt-2 flex items-center gap-2">
          <input
            value={replyDraft}
            onChange={(e) => onChangeDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmitReply(rootId, comment.author)
            }}
            autoFocus
            placeholder={`@${comment.author}에게 답글`}
            className="min-w-0 flex-1 rounded-full bg-neutral-100 px-3.5 py-1.5 text-xs text-neutral-900 outline-none placeholder:text-neutral-400 dark:bg-white/5 dark:text-neutral-100"
          />
          <button
            type="button"
            onClick={() => onSubmitReply(rootId, comment.author)}
            aria-label="답글 등록"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-colors duration-150 hover:bg-brand-500"
          >
            <ArrowUp size={13} />
          </button>
        </div>
      )}
    </div>
  )
}

export default function CommentsPanel({ id, targetType }: { id: string; targetType: CommentTargetType }) {
  const { getRecord, loadComments, addComment } = useEngagement()
  const [draft, setDraft] = useState("")
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState("")

  useEffect(() => {
    loadComments(targetType, id)
  }, [targetType, id, loadComments])

  const record = getRecord(id)
  const topLevel = record.comments.filter((c) => c.parentId === null)
  const repliesOf = (commentId: string) => record.comments.filter((c) => c.parentId === commentId)

  const submit = () => {
    if (!draft.trim()) return
    addComment(targetType, id, draft)
    setDraft("")
  }

  const startReply = (commentId: string) => {
    setReplyingId((prev) => (prev === commentId ? null : commentId))
    setReplyDraft("")
  }

  const submitReply = (rootId: string, replyToAuthor: string) => {
    if (!replyDraft.trim()) return
    addComment(targetType, id, replyDraft, rootId, replyToAuthor)
    setReplyingId(null)
    setReplyDraft("")
  }

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-100 pt-3 dark:border-white/10">
      {record.comments.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {topLevel.map((comment) => (
            <li key={comment.id} className="flex flex-col gap-2">
              <CommentRow
                id={id}
                comment={comment}
                rootId={comment.id}
                isReply={false}
                replyingId={replyingId}
                replyDraft={replyDraft}
                onStartReply={startReply}
                onChangeDraft={setReplyDraft}
                onSubmitReply={submitReply}
              />
              {repliesOf(comment.id).map((reply) => (
                <CommentRow
                  key={reply.id}
                  id={id}
                  comment={reply}
                  rootId={comment.id}
                  isReply
                  replyingId={replyingId}
                  replyDraft={replyDraft}
                  onStartReply={startReply}
                  onChangeDraft={setReplyDraft}
                  onSubmitReply={submitReply}
                />
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-neutral-400 dark:text-neutral-500">아직 댓글이 없어요</p>
      )}

      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit()
          }}
          placeholder="댓글을 남겨보세요"
          className="min-w-0 flex-1 rounded-full bg-neutral-100 px-4 py-2.5 text-xs text-neutral-900 outline-none placeholder:text-neutral-400 dark:bg-white/5 dark:text-neutral-100"
        />
        <button
          type="button"
          onClick={submit}
          aria-label="댓글 등록"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-colors duration-150 hover:bg-brand-500"
        >
          <ArrowUp size={15} />
        </button>
      </div>
    </div>
  )
}
