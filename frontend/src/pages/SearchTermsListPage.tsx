import { useNavigate } from "react-router-dom"
import { ArrowLeft, Search, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { recentSearches, popularSearchTerms } from "../mock/data"

interface SearchTermsListPageProps {
  variant: "recent" | "popular"
}

export default function SearchTermsListPage({ variant }: SearchTermsListPageProps) {
  const navigate = useNavigate()

  const startSearch = (q: string) => {
    navigate("/collecting", { state: { query: q } })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-6 px-5 pb-24 pt-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="rounded-full p-1 text-neutral-500 transition-colors duration-150 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:text-neutral-400 dark:hover:text-neutral-200"
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
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
              >
                <Search size={16} className="shrink-0 text-neutral-400" />
                <span className="text-sm text-neutral-800 dark:text-neutral-200">{term}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col">
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
        </ul>
      )}
    </div>
  )
}
