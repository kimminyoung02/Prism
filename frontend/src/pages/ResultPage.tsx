import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Shirt, Newspaper, Clapperboard, MessagesSquare } from "lucide-react"
import ScrapButton from "../components/ScrapButton"
import StarRating from "../components/StarRating"
import { aiConclusion, analyzedDate, defaultQuery, reviewSources, totalReviewCount } from "../mock/data"

const icons = {
  blog: Newspaper,
  youtube: Clapperboard,
  community: MessagesSquare,
}

export default function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const query = (location.state as { query?: string } | null)?.query ?? defaultQuery

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-6 px-5 py-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex w-fit items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400"
        >
          <ArrowLeft size={16} />
          다시 검색하기
        </button>
        <ScrapButton size={22} />
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-neutral-100 dark:bg-neutral-800">
          <Shirt size={48} className="text-neutral-400" />
        </div>
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{query}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          리뷰 {totalReviewCount}개 · 분석일 {analyzedDate}
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-yellow-50 p-5 dark:bg-yellow-500/10">
        <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">Prism AI 한줄 결론</span>
        <StarRating rating={aiConclusion.rating} />
        <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">{aiConclusion.summary}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {reviewSources.map((source) => {
          const Icon = icons[source.key]
          return (
            <div
              key={source.key}
              className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 py-4 dark:border-neutral-800"
            >
              <Icon size={20} className="text-neutral-500" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{source.label}</span>
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{source.count}건</span>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => navigate("/reviews", { state: { query } })}
        className="mt-2 w-full rounded-full bg-yellow-400 py-3.5 text-sm font-semibold text-neutral-900"
      >
        리뷰 전체 보기
      </button>
    </div>
  )
}
