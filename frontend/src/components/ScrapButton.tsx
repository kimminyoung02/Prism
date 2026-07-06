import { useState } from "react"
import { Bookmark } from "lucide-react"

interface ScrapButtonProps {
  size?: number
  className?: string
}

export default function ScrapButton({ size = 20, className = "" }: ScrapButtonProps) {
  const [scrapped, setScrapped] = useState(false)
  const [popping, setPopping] = useState(false)

  return (
    <button
      type="button"
      aria-pressed={scrapped}
      aria-label={scrapped ? "스크랩 해제" : "스크랩"}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setScrapped((s) => !s)
        setPopping(true)
      }}
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
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
            "absolute inset-0 text-yellow-400 transition-opacity duration-300 " +
            (scrapped ? "opacity-100" : "opacity-0")
          }
          fill="currentColor"
          stroke="none"
        />
      </span>
    </button>
  )
}
