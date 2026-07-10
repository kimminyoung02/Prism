import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ScanLine } from "lucide-react"

const ANALYZE_MS = 1600

export default function LensAnalyzingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const image = (location.state as { image?: string } | null)?.image ?? null

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/lens/result", { state: { image }, replace: true })
    }, ANALYZE_MS)
    return () => clearTimeout(timeout)
  }, [navigate, image])

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-6 bg-gradient-to-b from-brand-500 to-brand-400 px-6 text-center">
      {image && (
        <div className="h-40 w-40 overflow-hidden rounded-3xl shadow-xl">
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex flex-col items-center gap-3">
        <ScanLine size={32} className="animate-pulse text-white" />
        <h1 className="text-lg font-bold text-white">사진 속 제품을 분석하고 있어요</h1>
        <p className="text-sm text-brand-100">잠시만 기다려주세요</p>
      </div>
    </div>
  )
}
