import { useNavigate } from "react-router-dom"
import { ArrowLeft, Shirt } from "lucide-react"
import StarRating from "../components/StarRating"
import type { MyListItem } from "../mock/data"

interface ProductHistoryPageProps {
  title: string
  items: MyListItem[]
  emptyText: string
}

export default function ProductHistoryPage({ title, items, emptyText }: ProductHistoryPageProps) {
  const navigate = useNavigate()

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
        <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{title}</h1>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-neutral-400">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-3 dark:border-neutral-800"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                <Shirt size={24} className="text-neutral-400" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.title}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">분석일 {item.date}</p>
                <StarRating rating={item.rating} size={14} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
