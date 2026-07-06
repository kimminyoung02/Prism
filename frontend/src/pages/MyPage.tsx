import { useNavigate } from "react-router-dom"
import { User, Bookmark, Search, Bell, Info } from "lucide-react"
import { useScrap } from "../store/ScrapContext"
import { recentSearches } from "../mock/data"

export default function MyPage() {
  const navigate = useNavigate()
  const { items } = useScrap()

  const startSearch = (q: string) => {
    navigate("/collecting", { state: { query: q } })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 px-5 pb-24 pt-8">
      <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">마이</h1>

      <section className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
          <User size={28} className="text-neutral-400" />
        </div>
        <div>
          <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">게스트</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">로그인하고 더 많은 기능을 이용해보세요</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 py-4 dark:border-neutral-800">
          <Bookmark size={20} className="text-yellow-500" />
          <span className="text-xs text-neutral-500 dark:text-neutral-400">스크랩</span>
          <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{items.length}개</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 py-4 dark:border-neutral-800">
          <Search size={20} className="text-yellow-500" />
          <span className="text-xs text-neutral-500 dark:text-neutral-400">검색한 제품</span>
          <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{recentSearches.length}개</span>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">최근 검색</h2>
        {recentSearches.length === 0 ? (
          <p className="text-sm text-neutral-400">최근 검색한 제품이 없어요</p>
        ) : (
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
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">설정</h2>
        <ul className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          {[
            { icon: Bell, label: "알림 설정" },
            { icon: Info, label: "앱 정보" },
          ].map(({ icon: Icon, label }, i) => (
            <li key={label}>
              <button
                type="button"
                disabled
                title="준비중"
                className={
                  "flex w-full cursor-not-allowed items-center gap-3 px-4 py-3.5 text-left disabled:opacity-60" +
                  (i === 0 ? " border-b border-neutral-200 dark:border-neutral-800" : "")
                }
              >
                <Icon size={18} className="shrink-0 text-neutral-400" />
                <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
                <span className="text-xs text-neutral-400">준비중</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
