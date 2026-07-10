import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Shirt, ShieldCheck } from "lucide-react"
import { lensIdentifiedProduct } from "../mock/data"

export default function LensResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const image = (location.state as { image?: string } | null)?.image ?? null

  const productLabel = `${lensIdentifiedProduct.brand} ${lensIdentifiedProduct.name}`

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-surface pb-24 dark:bg-[#0D1B24]">
      <div className="rounded-b-3xl bg-gradient-to-b from-brand-500 to-brand-400 px-5 pb-5 pt-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            aria-label="닫기"
            className="-m-3 rounded-full p-3 text-white/80 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-bold text-white">식별 결과</h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center gap-5 px-6 pt-8 text-center">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">이 제품이에요!</h2>

        <div className="neu flex h-48 w-48 items-center justify-center overflow-hidden rounded-3xl bg-white dark:bg-[#1A2E3D]">
          {image ? (
            <img src={image} alt="촬영한 사진" className="h-full w-full object-cover" />
          ) : (
            <Shirt size={56} className="text-neutral-300 dark:text-neutral-700" />
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{productLabel}</p>
          <span className="neu-sm flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:bg-[#1A2E3D] dark:text-emerald-400">
            <ShieldCheck size={14} />
            {lensIdentifiedProduct.confidence}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/result", { state: { query: productLabel } })}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 py-3.5 text-sm font-semibold text-white transition duration-150 hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
        >
          이 제품 리뷰 분석 보기
        </button>
      </div>
    </div>
  )
}
