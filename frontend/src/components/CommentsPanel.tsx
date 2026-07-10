import { useState } from "react"
import { Send } from "lucide-react"
import { useEngagement } from "../store/EngagementContext"

export default function CommentsPanel({ id }: { id: string }) {
  const { getRecord, addComment } = useEngagement()
  const [draft, setDraft] = useState("")
  const record = getRecord(id)

  const submit = () => {
    if (!draft.trim()) return
    addComment(id, draft)
    setDraft("")
  }

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-100 pt-3 dark:border-white/10">
      {record.comments.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {record.comments.map((comment) => (
            <li key={comment.id} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{comment.author}</span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500">{comment.timeLabel}</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300">{comment.text}</p>
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
          className="neu-inset min-w-0 flex-1 rounded-full bg-white px-3.5 py-2 text-xs text-neutral-900 outline-none placeholder:text-neutral-400 dark:bg-[#1A2E3D] dark:text-neutral-100"
        />
        <button
          type="button"
          onClick={submit}
          aria-label="댓글 등록"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-colors duration-150 hover:bg-brand-600"
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  )
}
