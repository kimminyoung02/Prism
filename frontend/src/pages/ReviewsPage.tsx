import { useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react"
import ScrapButton from "../components/ScrapButton"
import { cons, defaultQuery, keywords, pros, reviewsByChannel } from "../mock/data"

const TABS = [
  { key: "ai", label: "AI 분석 결과" },
  { key: "blog", label: "블로그" },
  { key: "youtube", label: "유튜브" },
  { key: "community", label: "커뮤니티" },
] as const

const SWIPE_THRESHOLD = 50

function openOriginalLink(url: string) {
  const width = window.innerWidth
  const height = window.innerHeight
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height)
  window.open(url, "_blank", `noopener,noreferrer,width=${width},height=${height},left=${left},top=${top}`)
}

export default function ReviewsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const query = (location.state as { query?: string } | null)?.query ?? defaultQuery

  const [activeTab, setActiveTab] = useState(0)
  const touchStartX = useRef<number | null>(null)

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
    <div className="mx-auto flex min-h-svh max-w-md flex-col px-5 pb-24 pt-8">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="rounded-full p-1 text-neutral-500 transition-colors duration-150 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="truncate text-base font-bold text-neutral-900 dark:text-neutral-100">{query} 리뷰</h1>
      </div>

      <div role="tablist" aria-label="리뷰 카테고리" className="relative mb-4 grid grid-cols-4 border-b border-neutral-200 dark:border-neutral-800">
        {TABS.map((tab, i) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={i === activeTab}
            onClick={() => setActiveTab(i)}
            className={
              "py-2.5 text-center text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 " +
              (i === activeTab
                ? "text-neutral-900 dark:text-neutral-100"
                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300")
            }
          >
            {tab.label}
          </button>
        ))}
        <div
          aria-hidden="true"
          className="absolute bottom-0 h-0.5 bg-yellow-400 transition-transform duration-300 ease-out"
          style={{ width: `${100 / TABS.length}%`, transform: `translateX(${activeTab * 100}%)` }}
        />
      </div>

      <div role="tabpanel" className="overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ width: `${TABS.length * 100}%`, transform: `translateX(-${activeTab * (100 / TABS.length)}%)` }}
        >
          <div style={{ width: `${100 / TABS.length}%` }} className="flex flex-col gap-6 pb-8">
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">주요 장점</h2>
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
              <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">주요 단점</h2>
              <ul className="flex flex-col gap-2">
                {cons.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-yellow-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">핵심 키워드</h2>
              <div className="flex flex-wrap gap-2">
                {keywords.map((k) => (
                  <span
                    key={k.word}
                    className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {k.word} <span className="text-neutral-400">{k.count}</span>
                  </span>
                ))}
              </div>
            </section>
          </div>

          {(["blog", "youtube", "community"] as const).map((channel) => (
            <div key={channel} style={{ width: `${100 / TABS.length}%` }} className="flex flex-col gap-3 pb-8">
              {reviewsByChannel[channel].map((review) => (
                <div
                  key={review.id}
                  className="flex flex-col gap-1.5 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
                >
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
                      }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {review.source} · {review.date}
                  </p>
                  <p className="text-xs text-neutral-400">{review.stat}</p>
                  <button
                    type="button"
                    onClick={() => openOriginalLink(review.url)}
                    className="mt-1 flex w-fit items-center gap-1 rounded text-xs font-medium text-neutral-600 transition-colors duration-150 hover:text-neutral-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:text-neutral-300 dark:hover:text-neutral-100"
                  >
                    원문 가기
                    <ExternalLink size={12} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
