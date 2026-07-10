import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, ThumbsUp, MessageCircle } from "lucide-react"
import { useCommunity, SEED_COMMENTS } from "../store/CommunityContext"
import { useEngagement } from "../store/EngagementContext"

export default function CommunityPage() {
  const navigate = useNavigate()
  const { posts } = useCommunity()
  const { getRecord, ensureSeed } = useEngagement()

  useEffect(() => {
    posts.forEach((post) => ensureSeed(post.id, post.seedLikes, post.seedDislikes, SEED_COMMENTS[post.id]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts])

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-surface pb-24 dark:bg-[#0D1B24]">
      <div className="rounded-b-[2rem] bg-gradient-to-b from-brand-500 to-brand-400 px-5 pb-7 pt-7">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">커뮤니티</h1>
          <button
            type="button"
            onClick={() => navigate("/community/write")}
            aria-label="글쓰기"
            className="neu-sm neu-pressable flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-500"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-5">
        {posts.map((post) => {
          const record = getRecord(post.id)
          return (
            <button
              key={post.id}
              type="button"
              onClick={() => navigate("/community/post", { state: { postId: post.id } })}
              className="neu-sm neu-pressable flex flex-col gap-2 rounded-2xl bg-white p-4 text-left dark:bg-[#1A2E3D]"
            >
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{post.title}</h2>
              <p className="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">{post.content}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                  {post.author} · {post.timeLabel}
                </span>
                <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={12} />
                    {record.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={12} />
                    {record.comments.length}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
