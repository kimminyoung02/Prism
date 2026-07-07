import { useNavigate } from "react-router-dom"
import { ArrowLeft, UserPen, KeyRound, Moon, Globe, ChevronRight } from "lucide-react"
import ToggleSwitch from "../components/ToggleSwitch"
import { useTheme } from "../store/ThemeContext"

export default function SettingsPage() {
  const navigate = useNavigate()
  const { isDark, toggleDark } = useTheme()

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
        <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">설정</h1>
      </div>

      <ul className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <li>
          <button
            type="button"
            onClick={() => navigate("/edit-profile")}
            className="flex w-full items-center gap-3 border-b border-neutral-200 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
          >
            <UserPen size={18} className="shrink-0 text-neutral-400" />
            <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">계정정보</span>
            <ChevronRight size={16} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
          </button>
        </li>
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
        <li className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3.5 dark:border-neutral-800">
          <Moon size={18} className="shrink-0 text-neutral-400" />
          <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">다크모드</span>
          <ToggleSwitch checked={isDark} onChange={toggleDark} label="다크모드" />
        </li>
        <li>
          <button
            type="button"
            disabled
            title="준비중"
            className="flex w-full cursor-not-allowed items-center gap-3 px-4 py-3.5 text-left disabled:opacity-60"
          >
            <Globe size={18} className="shrink-0 text-neutral-400" />
            <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">언어설정</span>
            <span className="text-xs text-neutral-400">준비중</span>
          </button>
        </li>
      </ul>
    </div>
  )
}
