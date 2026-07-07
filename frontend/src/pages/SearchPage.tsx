import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Camera, Bell, Sparkles, ChevronRight, Shirt, TrendingUp, TrendingDown, Minus } from "lucide-react"
import PrismGraphic from "../components/PrismGraphic"
import StarRating from "../components/StarRating"
import { recentSearches, popularSearchTerms, myReviews, todaysPick } from "../mock/data"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const startSearch = (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    navigate("/collecting", { state: { query: trimmed } })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 px-5 pb-24 pt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-yellow-500">Prism</h1>
        <button
          type="button"
          onClick={() => navigate("/my/notifications")}
          aria-label="알림"
          className="rounded-full p-1.5 text-neutral-400 transition-colors duration-150 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:hover:text-neutral-200"
        >
          <Bell size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold leading-snug text-neutral-900 dark:text-neutral-100">
            좋은 선택은,
            <br />
            좋은 리뷰에서 시작됩니다.
          </h2>
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            수백 개의 리뷰를 Prism이 한눈에 정리해드려요
          </p>
        </div>
        <PrismGraphic />
      </div>

      <div className="flex flex-col gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            startSearch(query)
          }}
          className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white py-2 pl-4 pr-2 shadow-sm transition-colors focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <Search size={20} className="shrink-0 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제품명, 브랜드, 키워드로 검색해보세요"
            className="w-full bg-transparent px-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100"
          />
          <button
            type="button"
            disabled
            title="스마트 렌즈 · Prism Lens (준비중)"
            className="flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-full text-neutral-300 disabled:opacity-60 dark:text-neutral-600"
          >
            <Camera size={18} />
          </button>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-neutral-900 transition-colors duration-150 hover:bg-yellow-500 active:bg-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
          >
            검색
          </button>
        </form>

        <div
          title="준비중"
          className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 opacity-70 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
            <Sparkles size={16} className="text-neutral-500 dark:text-neutral-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Prism Lens</p>
            <p className="truncate text-xs text-neutral-400">사진을 찍으면 AI가 제품을 찾아드려요</p>
          </div>
          <span className="shrink-0 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300">
            준비중
          </span>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">최근 검색</h2>
          <button
            onClick={() => navigate("/search-terms/recent")}
            className="flex items-center text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            전체보기
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((term) => (
            <button
              key={term}
              onClick={() => startSearch(term)}
              className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">최근 분석한 제품</h2>
          <button
            onClick={() => navigate("/my/reviews")}
            className="flex items-center text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            전체보기
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {myReviews.slice(0, 3).map((item) => (
            <button
              key={item.id}
              onClick={() => navigate("/result", { state: { query: item.title } })}
              className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-3 text-left transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                <Shirt size={24} className="text-neutral-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.title}</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <StarRating rating={item.rating} size={12} />
                  <span className="text-xs text-neutral-400">리뷰 {item.reviewCount}개</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-neutral-400">{item.aiComment}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">오늘의 Prism Pick</h2>
        <button
          onClick={() => navigate("/collecting", { state: { query: todaysPick.title } })}
          className="flex items-center gap-4 rounded-2xl bg-yellow-50 p-4 text-left transition-colors duration-150 hover:bg-yellow-100 active:bg-yellow-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:bg-yellow-500/10 dark:hover:bg-yellow-500/15"
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-neutral-900">
            <Shirt size={28} className="text-yellow-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{todaysPick.title}</p>
            <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">{todaysPick.subtitle}</p>
          </div>
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">인기 검색어</h2>
          <button
            onClick={() => navigate("/search-terms/popular")}
            className="flex items-center text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            전체보기
            <ChevronRight size={14} />
          </button>
        </div>
        <ol className="flex flex-col gap-1">
          {popularSearchTerms.map((item, i) => (
            <li key={item.term}>
              <button
                onClick={() => startSearch(item.term)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
              >
                <span className="w-4 text-sm font-semibold text-yellow-500">{i + 1}</span>
                <span className="flex-1 text-sm text-neutral-800 dark:text-neutral-200">{item.term}</span>
                {item.change === "up" && (
                  <span className="flex items-center gap-0.5 text-xs font-medium text-rose-500">
                    <TrendingUp size={14} />
                    {item.diff}
                  </span>
                )}
                {item.change === "down" && (
                  <span className="flex items-center gap-0.5 text-xs font-medium text-blue-500">
                    <TrendingDown size={14} />
                    {item.diff}
                  </span>
                )}
                {item.change === "same" && <Minus size={14} className="text-neutral-300 dark:text-neutral-600" />}
              </button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
