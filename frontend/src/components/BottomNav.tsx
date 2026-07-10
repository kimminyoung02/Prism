import { Link, useLocation } from "react-router-dom"
import { Home, Users, Bookmark, User } from "lucide-react"

const HOME_PATHS = ["/", "/collecting", "/analyzing", "/result", "/lens", "/lens/analyzing", "/lens/result"]
const COMMUNITY_PATHS = ["/community", "/community/write", "/community/post"]

const TABS = [
  { to: "/", label: "홈", icon: Home, match: (path: string) => HOME_PATHS.includes(path) },
  { to: "/community", label: "커뮤니티", icon: Users, match: (path: string) => COMMUNITY_PATHS.includes(path) },
  { to: "/favorites", label: "즐겨찾기", icon: Bookmark, match: (path: string) => path === "/favorites" },
  { to: "/my", label: "마이페이지", icon: User, match: (path: string) => path === "/my" },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="sticky bottom-0 z-50 bg-white shadow-[0_-4px_14px_rgba(163,177,198,0.35)] dark:border-t dark:border-white/10 dark:bg-[#1A2E3D] dark:shadow-[0_-4px_14px_rgba(0,0,0,0.5)]">
      <div className="flex">
        {TABS.map(({ to, label, icon: Icon, match }) => {
          const active = match(location.pathname)
          return (
            <Link
              key={to}
              to={to}
              className={
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs " +
                (active ? "font-semibold text-brand-500" : "font-medium text-neutral-400")
              }
            >
              <Icon size={20} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 1} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
