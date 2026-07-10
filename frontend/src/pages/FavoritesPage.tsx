import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bookmark, Newspaper, Clapperboard, Users, Share2 } from "lucide-react"
import ScrapButton from "../components/ScrapButton"
import ProductThumbnail from "../components/ProductThumbnail"
import StarRating from "../components/StarRating"
import ShareModal from "../components/ShareModal"
import { useScrap, type ScrapItem } from "../store/ScrapContext"

const SOURCE_ICONS = {
  blog: Newspaper,
  youtube: Clapperboard,
  community: Users,
}

const SOURCE_LABELS = {
  blog: "블로그",
  youtube: "유튜브",
  community: "커뮤니티",
}

function getShareUrl(item: ScrapItem): string {
  if (item.type === "product") {
    return `${window.location.origin}/?shared=product&query=${encodeURIComponent(item.query ?? item.title)}`
  }
  return item.url ?? window.location.origin
}

function ProductCard({ item, onOpen, onShare }: { item: ScrapItem; onOpen: () => void; onShare: () => void }) {
  return (
    <div className="neu-sm flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-[#1A2E3D]">
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <ProductThumbnail title={item.title} className="h-14 w-14 rounded-xl bg-neutral-100 dark:bg-neutral-800" iconSize={20} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.title}</p>
          {typeof item.rating === "number" && (
            <div className="mt-1">
              <StarRating rating={item.rating} size={14} />
            </div>
          )}
          <p className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">{item.subtitle}</p>
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

function ReviewCard({ item, onOpen, onShare }: { item: ScrapItem; onOpen: () => void; onShare: () => void }) {
  const SourceIcon = item.source ? SOURCE_ICONS[item.source] : Bookmark
  return (
    <div className="neu-sm flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-[#1A2E3D]">
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
          <SourceIcon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.title}</p>
          <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
            {item.source && <span className="font-medium text-brand-500 dark:text-brand-300">{SOURCE_LABELS[item.source]} · </span>}
            {item.subtitle}
          </p>
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

type FavTab = "product" | "review"

export default function FavoritesPage() {
  const { items } = useScrap()
  const navigate = useNavigate()
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [tab, setTab] = useState<FavTab>("product")

  const products = useMemo(() => items.filter((item) => item.type === "product"), [items])
  const reviews = useMemo(() => items.filter((item) => item.type === "review"), [items])

  const openItem = (item: ScrapItem) => {
    if (item.type === "product") {
      navigate("/result", { state: { query: item.query } })
    } else if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer")
    }
  }

  const visible = tab === "product" ? products : reviews

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-surface pb-24 dark:bg-[#0D1B24]">
      <div className="rounded-b-[2rem] bg-gradient-to-b from-brand-500 to-brand-400 px-5 pb-5 pt-8">
        <h1 className="text-lg font-bold text-white">즐겨찾기</h1>
        <div className="mt-6 flex items-center gap-5 border-b border-white/20">
          {([
            { key: "product", label: "찜한 제품" },
            { key: "review", label: "찜한 리뷰" },
          ] as const).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                "relative pb-2.5 text-sm font-medium transition-colors duration-150 " +
                (tab === t.key ? "text-white" : "text-white/50 hover:text-white/80")
              }
            >
              {t.label} <span className="text-xs">{t.key === "product" ? products.length : reviews.length}</span>
              {tab === t.key && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-white" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-5">
        {visible.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center text-neutral-400">
            <Bookmark size={32} />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {tab === "product" ? "찜한 제품이 없어요" : "찜한 리뷰가 없어요"}
            </p>
          </div>
        ) : tab === "product" ? (
          products.map((item) => (
            <ProductCard key={item.id} item={item} onOpen={() => openItem(item)} onShare={() => setShareUrl(getShareUrl(item))} />
          ))
        ) : (
          reviews.map((item) => (
            <ReviewCard key={item.id} item={item} onOpen={() => openItem(item)} onShare={() => setShareUrl(getShareUrl(item))} />
          ))
        )}
      </div>

      {shareUrl && <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />}
    </div>
  )
}
