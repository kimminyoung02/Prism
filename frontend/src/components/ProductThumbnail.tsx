import { useEffect } from "react"
import { Shirt } from "lucide-react"
import { useProductImage } from "../store/ProductImageContext"

interface ProductThumbnailProps {
  title: string
  className: string
  iconClassName?: string
  iconSize?: number
}

export default function ProductThumbnail({ title, className, iconClassName = "text-neutral-400", iconSize = 22 }: ProductThumbnailProps) {
  const { images, ensureImage } = useProductImage()

  useEffect(() => {
    ensureImage(title)
  }, [title, ensureImage])

  const url = images[title]

  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden ${className}`}>
      {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : <Shirt size={iconSize} className={iconClassName} />}
    </div>
  )
}
