import { useNavigate } from "react-router-dom"
import { Bookmark } from "lucide-react"
import ScrapButton from "../components/ScrapButton"
import { useScrap } from "../store/ScrapContext"

export default function FavoritesPage() {
  const { items } = useScrap()
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-6 px-5 pb-24 pt-8">
      <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">즐겨찾기</h1>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-neutral-400">
          <Bookmark size={32} />
          <p className="text-sm">스크랩한 제품이나 리뷰가 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <button
                type="button"
                onClick={() => {
                  if (item.type === "product") {
                    navigate("/result", { state: { query: item.query } })
                  } else if (item.url) {
                    window.open(item.url, "_blank", "noopener,noreferrer")
                  }
                }}
                className="flex-1 text-left"
              >
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.title}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.subtitle}</p>
              </button>
              <ScrapButton item={item} size={18} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
