import { useState } from "react"
import { Bookmark } from "lucide-react"
import { useScrap, type ScrapItem } from "../store/ScrapContext"

interface ScrapButtonProps {
  item: ScrapItem
  size?: number
  className?: string
}

export default function ScrapButton({ item, size = 20, className = "" }: ScrapButtonProps) {
  const { isScrapped, toggleScrap } = useScrap()
  const scrapped = isScrapped(item.id)
  const [popping, setPopping] = useState(false)

  return (
    <button
      type="button"
      aria-pressed={scrapped}
      aria-label={scrapped ? "스크랩 해제" : "스크랩"}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleScrap(item)
        setPopping(true)
      }}
      className={`relative inline-flex shrink-0 items-center justify-center before:absolute before:-inset-3 before:content-[''] ${className}`}
    >
      <span
        className={"relative inline-block " + (popping ? "animate-scrap-pop" : "")}
        style={{ width: size, height: size }}
        onAnimationEnd={() => setPopping(false)}
      >
        <Bookmark size={size} className="text-neutral-300 dark:text-neutral-600" fill="none" strokeWidth={2} />
        <Bookmark
          size={size}
          className={
            "absolute inset-0 text-brand-400 transition-opacity duration-300 " +
            (scrapped ? "opacity-100" : "opacity-0")
          }
          fill="currentColor"
          stroke="none"
        />
      </span>
    </button>
  )
}
