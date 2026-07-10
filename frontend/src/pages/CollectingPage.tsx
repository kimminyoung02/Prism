import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Newspaper, Clapperboard, ShoppingBag, Check } from "lucide-react"
import { defaultQuery } from "../mock/data"
import { useActivity } from "../store/ActivityContext"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001"
const SHOPPING_TOTAL = 15

export default function CollectingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const query = (location.state as { query?: string } | null)?.query ?? defaultQuery
  const { addSearch } = useActivity()
  const recordedQueryRef = useRef<string | null>(null)

  const [blogTotal, setBlogTotal] = useState<number | null>(null)
  const [youtubeTotal, setYoutubeTotal] = useState<number | null>(null)
  const [blogCount, setBlogCount] = useState(0)
  const [youtubeCount, setYoutubeCount] = useState(0)
  const [shoppingCount, setShoppingCount] = useState(0)

  useEffect(() => {
    if (recordedQueryRef.current === query) return
    recordedQueryRef.current = query
    addSearch(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    let cancelled = false
    fetch(`${API_BASE_URL}/api/search/blog?query=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error("request failed")
        return res.json() as Promise<{ items: unknown[] }>
      })
      .then((data) => {
        if (cancelled) return
        setBlogTotal(data.items?.length ?? 0)
      })
      .catch(() => {
        if (cancelled) return
        setBlogTotal(0)
      })
    return () => {
      cancelled = true
    }
  }, [query])

  useEffect(() => {
    let cancelled = false
    fetch(`${API_BASE_URL}/api/search/youtube?query=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error("request failed")
        return res.json() as Promise<{ items: unknown[] }>
      })
      .then((data) => {
        if (cancelled) return
        setYoutubeTotal(data.items?.length ?? 0)
      })
      .catch(() => {
        if (cancelled) return
        setYoutubeTotal(0)
      })
    return () => {
      cancelled = true
    }
  }, [query])

  useEffect(() => {
    const interval = setInterval(() => {
      setBlogCount((c) => (blogTotal === null ? c : Math.min(c + Math.max(1, Math.ceil(blogTotal / 8)), blogTotal)))
      setYoutubeCount((c) =>
        youtubeTotal === null ? c : Math.min(c + Math.max(1, Math.ceil(youtubeTotal / 8)), youtubeTotal),
      )
      setShoppingCount((c) => Math.min(c + Math.ceil(SHOPPING_TOTAL / 8), SHOPPING_TOTAL))
    }, 200)
    return () => clearInterval(interval)
  }, [blogTotal, youtubeTotal])

  const blogDone = blogTotal !== null && blogCount >= blogTotal
  const youtubeDone = youtubeTotal !== null && youtubeCount >= youtubeTotal
  const shoppingDone = shoppingCount >= SHOPPING_TOTAL
  const allDone = blogDone && youtubeDone && shoppingDone

  useEffect(() => {
    if (!allDone) return
    const timeout = setTimeout(() => {
      navigate("/analyzing", { state: { query }, replace: true })
    }, 500)
    return () => clearTimeout(timeout)
  }, [allDone, navigate, query])

  const channels = [
    { key: "blog", label: "블로그", icon: Newspaper, total: blogTotal, count: blogCount },
    { key: "youtube", label: "유튜브", icon: Clapperboard, total: youtubeTotal, count: youtubeCount },
    { key: "shopping", label: "쇼핑몰", icon: ShoppingBag, total: SHOPPING_TOTAL as number | null, count: shoppingCount },
  ]

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-8 px-5 pb-24 pt-10">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          &lsquo;{query}&rsquo; 리뷰를 수집하고 있어요
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">잠시만 기다려주세요</p>
      </div>

      <div className="flex flex-col gap-5">
        {channels.map((channel) => {
          const isLoadingTotal = channel.total === null
          const isEmpty = channel.total === 0
          const done = !isLoadingTotal && channel.count >= (channel.total as number)
          const percent = isLoadingTotal ? 0 : (channel.count / Math.max(channel.total as number, 1)) * 100

          return (
            <div key={channel.key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-neutral-700 dark:text-neutral-300">
                  <channel.icon size={16} />
                  {channel.label}
                </span>
                <span className="flex items-center gap-1.5 tabular-nums text-neutral-500 dark:text-neutral-400">
                  {isLoadingTotal ? "확인 중..." : isEmpty ? "검색 결과 없음" : `${channel.count}/${channel.total}`}
                  {done && <Check size={14} className="text-emerald-500" />}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={channel.label}
                aria-valuenow={channel.count}
                aria-valuemin={0}
                aria-valuemax={isLoadingTotal ? 0 : (channel.total as number)}
                className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800"
              >
                <div
                  className={
                    "h-full rounded-full transition-all duration-200 " +
                    (isEmpty ? "bg-neutral-300 dark:bg-neutral-600" : "bg-gradient-to-r from-brand-500 to-brand-400")
                  }
                  style={{ width: `${isEmpty ? 100 : percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
