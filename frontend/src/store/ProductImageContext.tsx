import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001"

interface ProductImageContextValue {
  images: Record<string, string | null>
  ensureImage: (title: string) => void
}

const ProductImageContext = createContext<ProductImageContextValue | null>(null)

export function ProductImageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<Record<string, string | null>>({})
  const requestedRef = useRef<Set<string>>(new Set())

  const ensureImage = useCallback((title: string) => {
    const trimmed = title.trim()
    if (!trimmed || requestedRef.current.has(trimmed)) return
    requestedRef.current.add(trimmed)

    fetch(`${API_BASE_URL}/api/search/image?query=${encodeURIComponent(trimmed)}`)
      .then((res) => {
        if (!res.ok) throw new Error("request failed")
        return res.json() as Promise<{ imageUrl: string | null }>
      })
      .then((data) => {
        setImages((prev) => ({ ...prev, [trimmed]: data.imageUrl }))
      })
      .catch(() => {
        setImages((prev) => ({ ...prev, [trimmed]: null }))
      })
  }, [])

  return <ProductImageContext.Provider value={{ images, ensureImage }}>{children}</ProductImageContext.Provider>
}

export function useProductImage() {
  const ctx = useContext(ProductImageContext)
  if (!ctx) throw new Error("useProductImage must be used within ProductImageProvider")
  return ctx
}
