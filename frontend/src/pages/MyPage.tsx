import { useNavigate } from "react-router-dom"
import { User, Bell, Heart, History, Settings, LogOut, ChevronRight } from "lucide-react"
import { useAuth } from "../store/AuthContext"
import { useScrap } from "../store/ScrapContext"
import { AVATAR_STYLES, useProfile } from "../store/ProfileContext"
import { myReviews, recentlyViewed } from "../mock/data"

export default function MyPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { profile } = useProfile()
  const { items } = useScrap()
  const avatar = AVATAR_STYLES[profile.avatarIndex]

  const stats = [
    { label: "리뷰 분석", value: myReviews.length > 0 ? 77 : 0 },
    { label: "찜한 제품", value: items.length },
    { label: "최근 본 제품", value: recentlyViewed.length > 0 ? 8 : 0 },
  ]

  const menu = [
    { icon: Heart, label: "찜한 제품", to: "/favorites" },
    { icon: History, label: "최근 본 제품", to: "/my/recent" },
    { icon: Bell, label: "알림", to: "/my/notifications" },
    { icon: Settings, label: "설정", to: "/my/settings" },
  ]

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 px-5 pb-24 pt-8">
      <section className="relative flex items-center gap-4">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${avatar.bg}`}>
          <User size={28} className={avatar.fg} />
        </div>
        <div>
          <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{profile.nickname}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{profile.email}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/my/notifications")}
          aria-label="알림"
          className="absolute right-0 top-0 rounded-full p-1.5 text-neutral-400 transition-colors duration-150 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:hover:text-neutral-200"
        >
          <Bell size={20} />
        </button>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1 rounded-2xl border border-neutral-200 py-4 dark:border-neutral-800"
          >
            <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{stat.value}</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</span>
          </div>
        ))}
      </section>

      <section>
        <ul className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          {menu.map(({ icon: Icon, label, to }, i) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => navigate(to)}
                className={
                  "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:hover:bg-neutral-800 dark:active:bg-neutral-700" +
                  (i < menu.length - 1 ? " border-b border-neutral-200 dark:border-neutral-800" : "")
                }
              >
                <Icon size={18} className="shrink-0 text-neutral-400" />
                <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
                <ChevronRight size={16} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={logout}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl border-t border-neutral-100 px-4 py-3 text-left transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:border-neutral-900 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
        >
          <LogOut size={18} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
          <span className="text-sm text-neutral-400 dark:text-neutral-500">로그아웃</span>
        </button>
      </section>
    </div>
  )
}
