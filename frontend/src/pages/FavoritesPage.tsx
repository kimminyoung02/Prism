import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bookmark, Shirt, MessageSquareText, Share2 } from "lucide-react"
import ScrapButton from "../components/ScrapButton"
import ProductThumbnail from "../components/ProductThumbnail"
import ShareModal from "../components/ShareModal"
import { useScrap, type ScrapItem } from "../store/ScrapContext"

function getShareUrl(item: ScrapItem): string {
  if (item.type === "product") {
    return `${window.location.origin}/?shared=product&query=${encodeURIComponent(item.query ?? item.title)}`
  }
  return item.url ?? window.location.origin
}

function ScrapRow({ item, onOpen, onShare }: { item: ScrapItem; onOpen: () => void; onShare: () => void }) {
  return (
    <div className="neu-sm flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-[#1A2E3D]">
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        {item.type === "product" && (
          <ProductThumbnail title={item.title} className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800" iconSize={18} />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.title}</p>
          <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{item.subtitle}</p>
        </div>
      </button>
      <button
        type="button"
        onClick={onShare}
        aria-label="공유"
        className="-m-1.5 shrink-0 rounded-full p-1.5 text-neutral-400 transition-colors duration-150 hover:text-neutral-600 dark:hover:text-neutral-200"
      >
        <Share2 size={16} />
      </button>
      <ScrapButton item={item} size={18} />
    </div>
  )
}

export default function FavoritesPage() {
  const { items } = useScrap()
  const navigate = useNavigate()
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const products = items.filter((item) => item.type === "product")
  const reviews = items.filter((item) => item.type === "review")

  const openItem = (item: ScrapItem) => {
    if (item.type === "product") {
      navigate("/result", { state: { query: item.query } })
    } else if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-surface pb-24 dark:bg-[#0D1B24]">
      <div className="rounded-b-[2rem] bg-gradient-to-b from-brand-500 to-brand-400 px-5 pb-10 pt-10">
        <h1 className="text-lg font-bold text-white">즐겨찾기</h1>
      </div>

      <div className="flex flex-1 flex-col gap-6 px-5 pt-5">
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-neutral-400">
            <Bookmark size={32} />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">스크랩한 제품이나 리뷰가 없어요</p>
          </div>
        ) : (
          <>
            {products.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  <Shirt size={15} className="text-neutral-400" />
                  찜한 제품 <span className="text-neutral-400 dark:text-neutral-500">{products.length}</span>
                </h2>
                <div className="flex flex-col gap-3">
                  {products.map((item) => (
                    <ScrapRow key={item.id} item={item} onOpen={() => openItem(item)} onShare={() => setShareUrl(getShareUrl(item))} />
                  ))}
                </div>
              </section>
            )}

            {reviews.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  <MessageSquareText size={15} className="text-neutral-400" />
                  찜한 리뷰 <span className="text-neutral-400 dark:text-neutral-500">{reviews.length}</span>
                </h2>
                <div className="flex flex-col gap-3">
                  {reviews.map((item) => (
                    <ScrapRow key={item.id} item={item} onOpen={() => openItem(item)} onShare={() => setShareUrl(getShareUrl(item))} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {shareUrl && <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />}
    </div>
  )
}
