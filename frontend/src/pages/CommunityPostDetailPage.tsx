import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Share2 } from "lucide-react"
import { useCommunity, SEED_COMMENTS } from "../store/CommunityContext"
import { useEngagement } from "../store/EngagementContext"
import EngagementBar from "../components/EngagementBar"
import CommentsPanel from "../components/CommentsPanel"
import ShareModal from "../components/ShareModal"

export default function CommunityPostDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const postId = (location.state as { postId?: string } | null)?.postId
  const { getPost } = useCommunity()
  const { ensureSeed } = useEngagement()
  const [shareOpen, setShareOpen] = useState(false)

  const post = postId ? getPost(postId) : undefined

  useEffect(() => {
    if (post) ensureSeed(post.id, post.seedLikes, post.seedDislikes, SEED_COMMENTS[post.id])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id])

  if (!post) {
    return (
      <div className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">게시글을 찾을 수 없어요</p>
        <button onClick={() => navigate("/community")} className="text-sm font-semibold text-brand-600 dark:text-brand-400">
          커뮤니티로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-6 px-5 pb-24 pt-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="-m-3 rounded-full p-3 text-neutral-500 transition-colors duration-150 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-base font-bold text-neutral-900 dark:text-neutral-100">게시글</h1>
        <button
          onClick={() => setShareOpen(true)}
          aria-label="공유"
          className="-m-2 rounded-full p-2 text-neutral-400 transition-colors duration-150 hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          <Share2 size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{post.title}</h2>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {post.author} · {post.timeLabel}
        </span>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{post.content}</p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 dark:border dark:border-white/10 dark:bg-[#1A2E3D]">
        <EngagementBar
          id={post.id}
          seedLikes={post.seedLikes}
          seedDislikes={post.seedDislikes}
          commentsOpen
          onToggleComments={() => {}}
        />
        <CommentsPanel id={post.id} />
      </div>

      {shareOpen && (
        <ShareModal url={`${window.location.origin}/community/post?id=${post.id}`} onClose={() => setShareOpen(false)} />
      )}
    </div>
  )
}
