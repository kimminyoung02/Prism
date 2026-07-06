import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Newspaper, Clapperboard, MessagesSquare, ShoppingBag } from "lucide-react"
import { channelProgress, defaultQuery } from "../mock/data"

const icons = {
  blog: Newspaper,
  youtube: Clapperboard,
  community: MessagesSquare,
  shopping: ShoppingBag,
}

export default function CollectingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const query = (location.state as { query?: string } | null)?.query ?? defaultQuery

  const [counts, setCounts] = useState<number[]>(() => channelProgress.map(() => 0))

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) =>
        prev.map((count, i) => Math.min(count + Math.ceil(channelProgress[i].total / 8), channelProgress[i].total)),
      )
    }, 200)
    return () => clearInterval(interval)
  }, [])

  const allDone = counts.every((count, i) => count >= channelProgress[i].total)

  useEffect(() => {
    if (!allDone) return
    const timeout = setTimeout(() => {
      navigate("/analyzing", { state: { query } })
    }, 500)
    return () => clearTimeout(timeout)
  }, [allDone, navigate, query])

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-8 px-5 py-10">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          &lsquo;{query}&rsquo; 리뷰를 수집하고 있어요
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">잠시만 기다려주세요</p>
      </div>

      <div className="flex flex-col gap-5">
        {channelProgress.map((channel, i) => {
          const Icon = icons[channel.key]
          const current = counts[i]
          const percent = (current / channel.total) * 100
          return (
            <div key={channel.key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-neutral-700 dark:text-neutral-300">
                  <Icon size={16} />
                  {channel.label}
                </span>
                <span className="tabular-nums text-neutral-400">
                  {current}/{channel.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-200"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
