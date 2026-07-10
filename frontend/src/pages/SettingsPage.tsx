import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, UserPen, KeyRound, Moon, Globe, ChevronRight } from "lucide-react"
import ToggleSwitch from "../components/ToggleSwitch"
import LanguageModal from "../components/LanguageModal"
import { useTheme } from "../store/ThemeContext"
import { LANGUAGES, useLanguage } from "../store/LanguageContext"

export default function SettingsPage() {
  const navigate = useNavigate()
  const { isDark, toggleDark } = useTheme()
  const { language } = useLanguage()
  const [languageModalOpen, setLanguageModalOpen] = useState(false)
  const currentLanguageLabel = LANGUAGES.find((lang) => lang.code === language)?.label ?? ""

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-6 bg-surface pb-24 dark:bg-[#0D1B24]">
      <div className="rounded-b-3xl bg-gradient-to-b from-brand-500 to-brand-400 px-5 pb-5 pt-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
            className="-m-3 rounded-full p-3 text-white/80 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-bold text-white">설정</h1>
        </div>
      </div>

      <ul className="mx-5 flex flex-col gap-2">
        <li>
          <button
            type="button"
            onClick={() => navigate("/edit-profile")}
            className="neu-sm neu-pressable flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-left transition-colors duration-150 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-[#1A2E3D] dark:hover:bg-neutral-800"
          >
            <UserPen size={18} className="shrink-0 text-neutral-400" />
            <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">계정정보</span>
            <ChevronRight size={16} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => navigate("/my/settings/password")}
            className="neu-sm neu-pressable flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-left transition-colors duration-150 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-[#1A2E3D] dark:hover:bg-neutral-800"
          >
            <KeyRound size={18} className="shrink-0 text-neutral-400" />
            <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">비밀번호 변경</span>
            <ChevronRight size={16} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
          </button>
        </li>
        <li className="neu-sm flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 dark:bg-[#1A2E3D]">
          <Moon size={18} className="shrink-0 text-neutral-400" />
          <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">다크모드</span>
          <ToggleSwitch checked={isDark} onChange={toggleDark} label="다크모드" />
        </li>
        <li>
          <button
            type="button"
            onClick={() => setLanguageModalOpen(true)}
            className="neu-sm neu-pressable flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-left transition-colors duration-150 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-[#1A2E3D] dark:hover:bg-neutral-800"
          >
            <Globe size={18} className="shrink-0 text-neutral-400" />
            <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">언어설정</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{currentLanguageLabel}</span>
            <ChevronRight size={16} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
          </button>
        </li>
      </ul>

      {languageModalOpen && <LanguageModal onClose={() => setLanguageModalOpen(false)} />}
    </div>
  )
}
