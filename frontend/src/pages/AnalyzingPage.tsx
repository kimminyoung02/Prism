import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { CheckCircle2, Loader2, Circle } from "lucide-react"
import { analysisStepLabels, defaultQuery } from "../mock/data"

export default function AnalyzingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const query = (location.state as { query?: string } | null)?.query ?? defaultQuery

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (currentStep >= analysisStepLabels.length - 1) return
    const timeout = setTimeout(() => setCurrentStep((s) => s + 1), 700)
    return () => clearTimeout(timeout)
  }, [currentStep])

  useEffect(() => {
    if (currentStep < analysisStepLabels.length - 1) return
    const timeout = setTimeout(() => navigate("/result", { state: { query } }), 700)
    return () => clearTimeout(timeout)
  }, [currentStep, navigate, query])

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-8 px-5 pb-24 pt-10">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">AI가 리뷰를 분석하고 있어요</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">‘{query}’ 분석 중</p>
      </div>

      <div className="flex flex-col gap-4">
        {analysisStepLabels.map((label, i) => {
          const state = i < currentStep ? "done" : i === currentStep ? "active" : "pending"
          return (
            <div key={label} className="flex items-center gap-3">
              {state === "done" && <CheckCircle2 size={20} className="shrink-0 text-yellow-500" />}
              {state === "active" && <Loader2 size={20} className="shrink-0 animate-spin text-yellow-500" />}
              {state === "pending" && <Circle size={20} className="shrink-0 text-neutral-300 dark:text-neutral-700" />}
              <span
                className={
                  state === "pending"
                    ? "text-sm text-neutral-400 dark:text-neutral-600"
                    : "text-sm font-medium text-neutral-800 dark:text-neutral-200"
                }
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
