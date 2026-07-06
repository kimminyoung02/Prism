import { Link, useLocation } from "react-router-dom"
import { Home, Bookmark, User } from "lucide-react"

const HOME_PATHS = ["/", "/collecting", "/analyzing", "/result", "/reviews"]

const TABS = [
  { to: "/", label: "홈", icon: Home, match: (path: string) => HOME_PATHS.includes(path) },
  { to: "/favorites", label: "즐겨찾기", icon: Bookmark, match: (path: string) => path === "/favorites" },
  { to: "/my", label: "마이", icon: User, match: (path: string) => path === "/my" },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-md">
        {TABS.map(({ to, label, icon: Icon, match }) => {
          const active = match(location.pathname)
          return (
            <Link
              key={to}
              to={to}
              className={
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium " +
                (active ? "text-yellow-500" : "text-neutral-400")
              }
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
