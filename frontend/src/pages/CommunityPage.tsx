import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Bell, Pencil, Heart, MessageCircle, Eye, X } from "lucide-react"
import { useCommunity, SEED_COMMENTS, CATEGORY_STYLES, POST_CATEGORIES, type CommunityPost, type PostCategory } from "../store/CommunityContext"
import { useEngagement } from "../store/EngagementContext"

const AVATAR_PALETTE = ["bg-sky-400", "bg-violet-400", "bg-amber-400", "bg-emerald-400", "bg-rose-400", "bg-indigo-400"]

function avatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length]
}

type SortMode = "latest" | "popular"

export default function CommunityPage() {
  const navigate = useNavigate()
  const { posts, viewCounts } = useCommunity()
  const { getRecord, ensureSeed } = useEngagement()
  const [sortMode, setSortMode] = useState<SortMode>("latest")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<PostCategory | "전체">("전체")

  useEffect(() => {
    posts.forEach((post) => ensureSeed(post.id, post.seedLikes, post.seedDislikes, SEED_COMMENTS[post.id]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts])

  const visiblePosts = useMemo(() => {
    let filtered = searchTerm.trim()
      ? posts.filter(
          (p) => p.title.includes(searchTerm.trim()) || p.content.includes(searchTerm.trim()),
        )
      : posts

    if (categoryFilter !== "전체") filtered = filtered.filter((p) => p.category === categoryFilter)

    if (sortMode === "latest") return filtered
    return [...filtered].sort((a, b) => getRecord(b.id).likes - getRecord(a.id).likes)
  }, [posts, sortMode, searchTerm, categoryFilter, getRecord])

  const openPost = (post: CommunityPost) => navigate("/community/post", { state: { postId: post.id } })

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-surface pb-24 dark:bg-[#0D1B24]">
      <div className="rounded-b-[2rem] bg-gradient-to-b from-brand-500 to-brand-400 px-5 pb-5 pt-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">커뮤니티</h1>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="검색"
              className="-m-2 rounded-full p-2 text-white/80 transition-colors duration-150 hover:text-white"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <button
              type="button"
              onClick={() => navigate("/my/notifications")}
              aria-label="알림"
              className="-m-2 rounded-full p-2 text-white/80 transition-colors duration-150 hover:text-white"
            >
              <Bell size={20} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <input
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="게시글 검색"
            className="neu-inset mt-3 w-full rounded-full bg-white/95 px-4 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        )}

        <div className="mt-6 flex items-center gap-5 border-b border-white/20">
          {([
            { key: "latest", label: "최신글" },
            { key: "popular", label: "인기글" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSortMode(tab.key)}
              className={
                "relative pb-2.5 text-sm font-medium transition-colors duration-150 " +
                (sortMode === tab.key ? "text-white" : "text-white/50 hover:text-white/80")
              }
            >
              {tab.label}
              {sortMode === tab.key && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-white" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-5 pt-4 pb-1">
        {(["전체", ...POST_CATEGORIES] as const).map((c) => {
          const selected = c === categoryFilter
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategoryFilter(c)}
              className={
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 " +
                (selected
                  ? "bg-brand-500 text-white"
                  : "bg-white text-neutral-500 dark:bg-[#1A2E3D] dark:text-neutral-400")
              }
            >
              {c}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 px-5 pt-3">
        {visiblePosts.length === 0 && (
          <p className="py-8 text-center text-sm text-neutral-400 dark:text-neutral-500">게시글이 없어요</p>
        )}
        {visiblePosts.map((post) => {
          const record = getRecord(post.id)
          const categoryStyle = CATEGORY_STYLES[post.category]
          const views = post.seedViews + (viewCounts[post.id] ?? 0)
          return (
            <button
              key={post.id}
              type="button"
              onClick={() => openPost(post)}
              className="neu-sm neu-pressable flex flex-col gap-2.5 rounded-2xl bg-white p-4 text-left dark:bg-[#1A2E3D]"
            >
              <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${categoryStyle.light} ${categoryStyle.dark}`}>
                {post.category}
              </span>

              <div className="flex items-center gap-2">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(post.author)}`}>
                  {post.author.charAt(0)}
                </span>
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{post.author}</span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500">· {post.timeLabel}</span>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{post.title}</h2>
                <p className="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
                  {post.content}
                  {post.content.length > 40 && <span className="ml-1 text-neutral-400 dark:text-neutral-500">더보기</span>}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500">
                <span className="flex items-center gap-1">
                  <Heart size={12} />
                  {record.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={12} />
                  {record.comments.length}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {views}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="sticky bottom-24 z-40 h-0 overflow-visible">
        <div className="flex justify-end px-5">
          <button
            type="button"
            onClick={() => navigate("/community/write")}
            aria-label="글쓰기"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/40 transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            <Pencil size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
