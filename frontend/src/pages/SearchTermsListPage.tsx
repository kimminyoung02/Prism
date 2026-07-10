import { useNavigate } from "react-router-dom"
import { ArrowLeft, Search } from "lucide-react"
import { useActivity } from "../store/ActivityContext"
import { usePopularSearches } from "../store/usePopularSearches"

interface SearchTermsListPageProps {
  variant: "recent" | "popular"
}

export default function SearchTermsListPage({ variant }: SearchTermsListPageProps) {
  const navigate = useNavigate()
  const { recentSearches } = useActivity()
  const popularSearches = usePopularSearches(30)

  const startSearch = (q: string) => {
    navigate("/collecting", { state: { query: q } })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-6 px-5 pb-24 pt-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="-m-3 rounded-full p-3 text-neutral-500 transition-colors duration-150 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
          {variant === "recent" ? "최근 검색" : "인기 검색어"}
        </h1>
      </div>

      {variant === "recent" ? (
        <ul className="flex flex-col">
          {recentSearches.map((term) => (
            <li key={term}>
              <button
                onClick={() => startSearch(term)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
              >
                <Search size={16} className="shrink-0 text-neutral-400" />
                <span className="text-sm text-neutral-800 dark:text-neutral-200">{term}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : popularSearches.length > 0 ? (
        <ul className="flex flex-col">
          {popularSearches.map((item, i) => (
            <li key={item.term}>
              <button
                onClick={() => startSearch(item.term)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
              >
                <span className="w-4 text-sm font-semibold text-brand-500">{i + 1}</span>
                <span className="flex-1 text-sm text-neutral-800 dark:text-neutral-200">{item.term}</span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">{item.count}회</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-sm text-neutral-400 dark:text-neutral-500">아직 인기 검색어가 없어요</p>
      )}
    </div>
  )
}
