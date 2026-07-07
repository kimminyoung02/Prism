import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import ToggleSwitch from "../components/ToggleSwitch"

const INITIAL_TOGGLES = [
  { key: "mute", label: "무시 알림" },
  { key: "analysisDone", label: "분석완료 알림" },
  { key: "recommend", label: "추천제품 알림" },
]

export default function NotificationSettingsPage() {
  const navigate = useNavigate()
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    mute: false,
    analysisDone: true,
    recommend: true,
  })

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
        <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">알림</h1>
      </div>

      <ul className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
        {INITIAL_TOGGLES.map(({ key, label }, i) => (
          <li
            key={key}
            className={
              "flex items-center gap-3 px-4 py-3.5" +
              (i < INITIAL_TOGGLES.length - 1 ? " border-b border-neutral-200 dark:border-neutral-800" : "")
            }
          >
            <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
            <ToggleSwitch
              checked={toggles[key]}
              onChange={(checked) => setToggles((prev) => ({ ...prev, [key]: checked }))}
              label={label}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
