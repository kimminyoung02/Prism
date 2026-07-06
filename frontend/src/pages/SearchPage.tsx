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
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 px-5 py-10">
      <h1 className="text-2xl font-bold text-yellow-500">Prism</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          startSearch(query)
        }}
        className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        <Search size={20} className="shrink-0 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제품명을 검색해보세요"
          className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100"
        />
        <button
          type="button"
          disabled
          title="스마트 렌즈 · Prism Lens (준비중)"
          className="shrink-0 cursor-not-allowed rounded-full p-1.5 text-neutral-300 dark:text-neutral-600"
        >
          <Camera size={20} />
        </button>
        <button
          type="submit"
          className="shrink-0 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-medium text-neutral-900"
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
              className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">인기 검색어</h2>
        <ol className="flex flex-col gap-2">
          {popularTags.map((term, i) => (
            <li key={term}>
              <button
                onClick={() => startSearch(term)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800"
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
