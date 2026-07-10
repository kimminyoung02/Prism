import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import ToggleSwitch from "../components/ToggleSwitch"
import { useNotificationSettings, type NotificationKey } from "../store/NotificationSettingsContext"

const INITIAL_TOGGLES: { key: NotificationKey; label: string }[] = [
  { key: "push", label: "푸시 알림" },
  { key: "analysisDone", label: "분석완료 알림" },
  { key: "recommend", label: "추천제품 알림" },
]

export default function NotificationSettingsPage() {
  const navigate = useNavigate()
  const { toggles, setToggle } = useNotificationSettings()

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
          <h1 className="text-base font-bold text-white">알림</h1>
        </div>
      </div>

      <ul className="mx-5 flex flex-col gap-2">
        {INITIAL_TOGGLES.map(({ key, label }) => (
          <li key={key} className="neu-sm flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 dark:bg-[#1A2E3D]">
            <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
            <ToggleSwitch
              checked={toggles[key]}
              onChange={(checked) => setToggle(key, checked)}
              label={label}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
