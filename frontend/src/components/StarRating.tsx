import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  max?: number
  size?: number
}

export default function StarRating({ rating, max = 5, size = 20 }: StarRatingProps) {
  return (
    <div className="inline-flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i))
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star size={size} className="text-neutral-300 dark:text-neutral-600" fill="currentColor" stroke="none" />
            {fill > 0 && (
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - fill * 100}% 0 0)` }}>
                <Star size={size} className="text-yellow-400" fill="currentColor" stroke="none" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
