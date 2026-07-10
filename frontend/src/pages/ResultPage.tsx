import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Search,
  Newspaper,
  Clapperboard,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Share2,
} from "lucide-react"
import ScrapButton from "../components/ScrapButton"
import StarRating from "../components/StarRating"
import ProductThumbnail from "../components/ProductThumbnail"
import EngagementBar from "../components/EngagementBar"
import CommentsPanel from "../components/CommentsPanel"
import ShareModal from "../components/ShareModal"
import {
  aiConclusion,
  analyzedDate,
  cons,
  defaultQuery,
  keywords,
  pros,
  reviewSources,
  totalReviewCount,
  type ReviewItem,
} from "../mock/data"
import { useActivity } from "../store/ActivityContext"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001"

const icons = {
  blog: Newspaper,
  youtube: Clapperboard,
}

const TABS = [
  { key: "analysis", label: "AI 분석 결과" },
  { key: "blog", label: "블로그" },
  { key: "youtube", label: "유튜브" },
] as const

const SWIPE_THRESHOLD = 50

function openOriginalLink(url: string) {
  const width = window.innerWidth
  const height = window.innerHeight
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height)
  window.open(url, "_blank", `noopener,noreferrer,width=${width},height=${height},left=${left},top=${top}`)
}

export default function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const query = (location.state as { query?: string } | null)?.query ?? defaultQuery
  const { recordProductView, incrementAnalysisRun } = useActivity()

  const [activeTab, setActiveTab] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const recordedQueryRef = useRef<string | null>(null)

  const [blogReviews, setBlogReviews] = useState<ReviewItem[]>([])
  const [blogStatus, setBlogStatus] = useState<"loading" | "error" | "success">("loading")

  const [youtubeReviews, setYoutubeReviews] = useState<ReviewItem[]>([])
  const [youtubeStatus, setYoutubeStatus] = useState<"loading" | "error" | "success">("loading")

  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const toggleComments = (id: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  useEffect(() => {
    if (recordedQueryRef.current === query) return
    recordedQueryRef.current = query
    recordProductView(query, aiConclusion.rating)
    incrementAnalysisRun()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    let cancelled = false
    setBlogStatus("loading")

    fetch(`${API_BASE_URL}/api/search/blog?query=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error("request failed")
        return res.json() as Promise<{ items: ReviewItem[] }>
      })
      .then((data) => {
        if (cancelled) return
        setBlogReviews(data.items)
        setBlogStatus("success")
      })
      .catch(() => {
        if (cancelled) return
        setBlogStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [query])

  useEffect(() => {
    let cancelled = false
    setYoutubeStatus("loading")

    fetch(`${API_BASE_URL}/api/search/youtube?query=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error("request failed")
        return res.json() as Promise<{ items: ReviewItem[] }>
      })
      .then((data) => {
        if (cancelled) return
        setYoutubeReviews(data.items)
        setYoutubeStatus("success")
      })
      .catch(() => {
        if (cancelled) return
        setYoutubeStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [query])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta > SWIPE_THRESHOLD && activeTab > 0) {
      setActiveTab((t) => t - 1)
    } else if (delta < -SWIPE_THRESHOLD && activeTab < TABS.length - 1) {
      setActiveTab((t) => t + 1)
    }
    touchStartX.current = null
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-surface pb-24 dark:bg-[#0D1B24]">
      <div className="bg-gradient-to-b from-brand-500 to-brand-400 px-5 pb-1 pt-8">
        <div className="mb-2 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
            className="-m-3 rounded-full p-3 text-white/80 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="flex-1 text-base font-bold text-white">분석 결과</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="검색"
              className="-m-2 rounded-full p-2 text-white/80 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500"
            >
              <Search size={20} />
            </button>
            <ScrapButton
              size={22}
              item={{
                id: `product:${query}`,
                type: "product",
                title: query,
                subtitle: `리뷰 ${totalReviewCount}개 · 분석일 ${analyzedDate}`,
                query,
                rating: aiConclusion.rating,
              }}
            />
            <button
              type="button"
              onClick={() => setShareUrl(`${window.location.origin}/?shared=product&query=${encodeURIComponent(query)}`)}
              aria-label="공유"
              className="-m-2 rounded-full p-2 text-white/80 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div role="tablist" aria-label="분석 결과 카테고리" className="relative grid grid-cols-3 border-b border-white/20">
          {TABS.map((tab, i) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={i === activeTab}
              onClick={() => setActiveTab(i)}
              className={
                "py-2.5 text-center text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500 " +
                (i === activeTab ? "text-white" : "text-white/50 hover:text-white/80")
              }
            >
              {tab.label}
            </button>
          ))}
          <div
            aria-hidden="true"
            className="absolute bottom-0 h-0.5 bg-white transition-transform duration-300 ease-out"
            style={{ width: `${100 / TABS.length}%`, transform: `translateX(${activeTab * 100}%)` }}
          />
        </div>
      </div>

      <div
        role="tabpanel"
        className="touch-pan-y overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ width: `${TABS.length * 100}%`, transform: `translateX(-${activeTab * (100 / TABS.length)}%)` }}
        >
          <div style={{ width: `${100 / TABS.length}%` }} className="flex shrink-0 flex-col gap-6 overflow-hidden pb-8">
            <div className="flex flex-col overflow-hidden">
              <div className="flex flex-col items-center gap-3 bg-gradient-to-b from-brand-500 to-brand-400 px-5 pb-14 pt-5 text-center">
                <ProductThumbnail title={query} className="h-28 w-28 rounded-3xl bg-white/15" iconClassName="text-white" iconSize={48} />
                <h2 className="text-lg font-bold text-white">{query}</h2>
                <p className="text-sm text-brand-100">
                  리뷰 {totalReviewCount}개 · 분석일 {analyzedDate}
                </p>
              </div>

              <div className="-mt-8 flex flex-col gap-3 rounded-t-[28px] bg-white px-5 py-5 shadow-xl shadow-black/15 dark:border dark:border-white/10 dark:bg-[#1A2E3D] dark:shadow-black/50">
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">Prism AI 한줄 결론</span>
                <StarRating rating={aiConclusion.rating} />
                <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">{aiConclusion.summary}</p>
              </div>
            </div>

            <div className="mx-5 grid grid-cols-2 gap-3">
              {reviewSources.map((source) => {
                const Icon = icons[source.key]
                return (
                  <button
                    key={source.key}
                    type="button"
                    onClick={() => setActiveTab(TABS.findIndex((tab) => tab.key === source.key))}
                    className="neu-sm neu-pressable flex flex-col items-center gap-2 rounded-2xl bg-white py-4 transition-transform duration-150 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-[#1A2E3D]"
                  >
                    <Icon size={20} className="text-neutral-500" />
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{source.label}</span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {source.count}건
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mx-5 flex flex-col gap-5 rounded-2xl bg-white p-4 shadow-sm dark:border dark:border-white/10 dark:bg-[#1A2E3D] dark:shadow-none">
              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">주요 장점</h3>
                <ul className="flex flex-col gap-2">
                  {pros.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">주요 단점</h3>
                <ul className="flex flex-col gap-2">
                  {cons.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                      <XCircle size={16} className="mt-0.5 shrink-0 text-rose-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">핵심 키워드</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((k) => (
                    <span
                      key={k.word}
                      className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {k.word} <span className="text-neutral-500 dark:text-neutral-400">{k.count}</span>
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {(["blog", "youtube"] as const).map((channel) => {
            const Icon = icons[channel]
            const channelReviews = channel === "blog" ? blogReviews : youtubeReviews
            const status = channel === "blog" ? blogStatus : youtubeStatus
            const channelLabel = channel === "blog" ? "블로그" : "유튜브"
            return (
              <div key={channel} style={{ width: `${100 / TABS.length}%` }} className="flex shrink-0 flex-col gap-3 overflow-hidden px-5 pb-8 pt-5">
                {status === "loading" && (
                  <p className="py-8 text-center text-sm text-neutral-400 dark:text-neutral-500">{channelLabel} 리뷰를 불러오는 중이에요...</p>
                )}
                {status === "error" && (
                  <p className="py-8 text-center text-sm text-neutral-400 dark:text-neutral-500">{channelLabel} 리뷰를 불러오지 못했어요</p>
                )}
                {status === "success" && channelReviews.length === 0 && (
                  <p className="py-8 text-center text-sm text-neutral-400 dark:text-neutral-500">관련 {channelLabel} 리뷰가 없어요</p>
                )}
                {channelReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#1A2E3D] dark:shadow-none"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                      {review.thumbnail ? (
                        <img src={review.thumbnail} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Icon size={24} className="text-neutral-400" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{review.title}</h3>
                        <ScrapButton
                          size={18}
                          className="mt-0.5"
                          item={{
                            id: review.id,
                            type: "review",
                            title: review.title,
                            subtitle: `${review.source} · ${review.date}`,
                            url: review.url,
                            source: channel,
                          }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {review.source} · {review.date}
                      </p>
                      <p className="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">{review.stat}</p>

                      <div className="flex items-center justify-between gap-2 border-t border-neutral-100 pt-2.5 dark:border-white/10">
                        <EngagementBar
                          id={review.id}
                          showDislike={false}
                          commentsOpen={expandedComments.has(review.id)}
                          onToggleComments={() => toggleComments(review.id)}
                        />
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openOriginalLink(review.url)}
                            className="flex w-fit items-center gap-1 rounded text-xs font-medium text-neutral-600 transition-colors duration-150 hover:text-neutral-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:text-neutral-300 dark:hover:text-neutral-100"
                          >
                            원문 가기
                            <ExternalLink size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShareUrl(review.url)}
                            aria-label="공유"
                            className="-m-1.5 rounded-full p-1.5 text-neutral-400 transition-colors duration-150 hover:text-neutral-600 dark:hover:text-neutral-200"
                          >
                            <Share2 size={14} />
                          </button>
                        </div>
                      </div>
                      {expandedComments.has(review.id) && <CommentsPanel id={review.id} />}
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {shareUrl && <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />}
    </div>
  )
}
