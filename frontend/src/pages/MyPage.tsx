import { useNavigate } from "react-router-dom"
import { User, Pencil, KeyRound, LogOut, Search } from "lucide-react"
import { useAuth } from "../store/AuthContext"
import { recentSearches } from "../mock/data"

export default function MyPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const startSearch = (q: string) => {
    navigate("/collecting", { state: { query: q } })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 px-5 pb-24 pt-8">
      <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">마이</h1>

      <section className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50 dark:bg-yellow-500/10">
            <User size={28} className="text-yellow-500" />
          </div>
          <button
            type="button"
            disabled
            title="준비중"
            className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 cursor-not-allowed items-center justify-center rounded-full border-2 border-white bg-neutral-200 text-neutral-500 disabled:opacity-80 dark:border-neutral-950 dark:bg-neutral-700 dark:text-neutral-300"
          >
            <Pencil size={12} />
          </button>
        </div>
        <div>
          <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">prism_user</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">user@example.com</p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">계정</h2>
        <ul className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <li>
            <button
              type="button"
              disabled
              title="준비중"
              className="flex w-full cursor-not-allowed items-center gap-3 border-b border-neutral-200 px-4 py-3.5 text-left disabled:opacity-60 dark:border-neutral-800"
            >
              <KeyRound size={18} className="shrink-0 text-neutral-400" />
              <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">비밀번호 변경</span>
              <span className="text-xs text-neutral-400">준비중</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
            >
              <LogOut size={18} className="shrink-0 text-neutral-400" />
              <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">로그아웃</span>
            </button>
          </li>
        </ul>
        <button
          type="button"
          disabled
          title="준비중"
          className="w-fit cursor-not-allowed px-1 text-xs text-neutral-300 disabled:opacity-80 dark:text-neutral-700"
        >
          회원 탈퇴
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">검색 기록</h2>
        {recentSearches.length === 0 ? (
          <p className="text-sm text-neutral-400">검색한 제품이 없어요</p>
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
    </div>
  )
}
