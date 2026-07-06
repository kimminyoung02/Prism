import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Camera } from "lucide-react"
import { recentSearches, popularTags } from "../mock/data"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const startSearch = (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    navigate("/collecting", { state: { query: trimmed } })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 px-5 pb-24 pt-10">
      <h1 className="text-2xl font-bold tracking-tight text-yellow-500">Prism</h1>

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
          placeholder="제품명을 검색해보세요"
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

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">최근 검색</h2>
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
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">인기 검색어</h2>
        <ol className="flex flex-col gap-1">
          {popularTags.map((term, i) => (
            <li key={term}>
              <button
                onClick={() => startSearch(term)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
              >
                <span className="w-4 text-sm font-semibold text-yellow-500">{i + 1}</span>
                <span className="text-sm text-neutral-800 dark:text-neutral-200">{term}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
