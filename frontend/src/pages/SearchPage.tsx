import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Camera,
  Bell,
  ChevronRight,
  Star,
  Clock,
  BarChart2,
  MapPin,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { popularSearchTerms, todaysPick } from "../mock/data"
import { useActivity } from "../store/ActivityContext"
import ProductThumbnail from "../components/ProductThumbnail"
import prismLogo from "../assets/prism-logo.svg"
import prismWordmark from "../assets/prism-wordmark.png"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const { recentSearches, viewedProducts } = useActivity()

  const startSearch = (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    navigate("/collecting", { state: { query: trimmed } })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-surface pb-20 dark:bg-[#0D1B24]">
      <div className="rounded-b-[2rem] bg-gradient-to-b from-brand-500 to-brand-400 px-5 pb-7 pt-7 shadow-lg shadow-brand-500/20">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2">
            <img src={prismLogo} alt="" className="h-8 w-8" />
            <img src={prismWordmark} alt="Prism" className="h-6 w-auto" />
          </h1>
          <button
            type="button"
            onClick={() => navigate("/my/notifications")}
            aria-label="알림"
            className="-m-3 rounded-full p-3 text-white/80 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500"
          >
            <Bell size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            startSearch(query)
          }}
          className="neu mt-6 flex items-center gap-1 rounded-full bg-white py-2 pl-4 pr-2 focus-within:ring-2 focus-within:ring-white/60"
        >
          <Search size={18} className="shrink-0 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제품명, 브랜드, 키워드를 검색해보세요"
            className="w-full bg-transparent px-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          <button
            type="button"
            onClick={() => navigate("/lens")}
            aria-label="스마트 렌즈 · Prism Lens"
            title="스마트 렌즈 · Prism Lens"
            className="neu-sm neu-pressable flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-500 transition-colors duration-150 hover:text-brand-600"
          >
            <Camera size={15} />
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-5 px-5 pt-4">
        <button
          type="button"
          onClick={() => navigate("/lens")}
          className="neu neu-pressable flex items-center gap-3 rounded-2xl bg-brand-50 p-3 text-left transition-colors duration-150 dark:bg-brand-500/10"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/20">
            <Camera size={16} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Prism Lens</p>
            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
              사진을 찍으면 AI가 제품을 찾아드려요
            </p>
          </div>
          <ChevronRight size={16} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
        </button>

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              <Flame size={14} className="text-brand-500" />
              인기 검색어
            </h2>
            <button
              onClick={() => navigate("/search-terms/popular")}
              className="flex items-center text-xs text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              전체보기
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {popularSearchTerms.slice(0, 6).map((item, i) => (
              <button
                key={item.term}
                onClick={() => startSearch(item.term)}
                className="neu-sm neu-pressable flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-2 text-left transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-[#1A2E3D]"
              >
                <span
                  className={
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold " +
                    (i < 3
                      ? "bg-brand-500 text-white"
                      : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400")
                  }
                >
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-[11px] text-neutral-800 dark:text-neutral-200">{item.term}</span>
                {item.change === "up" && (
                  <span className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-rose-500">
                    <TrendingUp size={11} />
                  </span>
                )}
                {item.change === "down" && (
                  <span className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-blue-500">
                    <TrendingDown size={11} />
                  </span>
                )}
                {item.change === "same" && (
                  <Minus size={11} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              <BarChart2 size={14} className="text-neutral-400" />
              최근 분석한 제품
            </h2>
            <button
              onClick={() => navigate("/my/reviews")}
              className="flex items-center text-xs text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              전체보기
              <ChevronRight size={14} />
            </button>
          </div>
          {viewedProducts.length > 0 ? (
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
              {viewedProducts.slice(0, 10).map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate("/result", { state: { query: item.title } })}
                  className="neu neu-pressable flex w-28 shrink-0 flex-col gap-1.5 rounded-2xl bg-white p-2 text-left transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-[#1A2E3D]"
                >
                  <ProductThumbnail title={item.title} className="h-20 w-full rounded-xl bg-neutral-100 dark:bg-neutral-800" />
                  <p className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">{item.title}</p>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <Star size={10} className="text-brand-400" fill="currentColor" stroke="none" />
                    <span>{item.rating}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="py-2 text-sm text-neutral-400 dark:text-neutral-500">아직 분석한 제품이 없어요</p>
          )}
        </section>

        <section className="neu flex flex-col gap-2 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-3 dark:from-brand-500/10 dark:to-brand-500/5">
          <span className="neu-sm flex w-fit items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-brand-600 dark:bg-[#1A2E3D] dark:text-brand-400">
            <MapPin size={11} />
            오늘의 Prism Pick
          </span>
          <button
            onClick={() => navigate("/collecting", { state: { query: todaysPick.title } })}
            className="flex items-center justify-between gap-3 text-left transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
          >
            <p className="leading-snug">
              <span className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                {todaysPick.subtitle}
              </span>
              <span className="block text-sm font-bold text-neutral-900 dark:text-neutral-100">{todaysPick.title}</span>
            </p>
            <ProductThumbnail
              title={todaysPick.title}
              className="neu-sm h-11 w-11 rounded-xl bg-white dark:bg-[#1A2E3D]"
              iconClassName="text-brand-500"
              iconSize={20}
            />
          </button>
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              <Clock size={14} className="text-neutral-400" />
              최근 검색
            </h2>
            <button
              onClick={() => navigate("/search-terms/recent")}
              className="flex items-center text-xs text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              전체보기
              <ChevronRight size={14} />
            </button>
          </div>
          {recentSearches.length > 0 ? (
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => startSearch(term)}
                  className="neu-sm neu-pressable shrink-0 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-xs text-neutral-700 transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-[#1A2E3D] dark:text-neutral-300"
                >
                  {term}
                </button>
              ))}
            </div>
          ) : (
            <p className="py-2 text-sm text-neutral-400 dark:text-neutral-500">아직 검색한 제품이 없어요</p>
          )}
        </section>
      </div>
    </div>
  )
}
