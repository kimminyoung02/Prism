import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Inbox, Filter, Hash, PieChart, FileText, Check } from "lucide-react"
import { analysisSteps, defaultQuery } from "../mock/data"
import prismLogo from "../assets/prism-logo.svg"

const icons = {
  collect: Inbox,
  clean: Filter,
  keyword: Hash,
  sentiment: PieChart,
  summary: FileText,
}

const STEP_MS = 700
const SETTLE_MS = 300
const RING_SIZE = 144
const RING_STROKE = 6

export default function AnalyzingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const query = (location.state as { query?: string } | null)?.query ?? defaultQuery

  const [currentStep, setCurrentStep] = useState(0)
  const [settling, setSettling] = useState(false)

  const totalSteps = analysisSteps.length
  const allDone = currentStep >= totalSteps

  useEffect(() => {
    if (allDone) return
    setSettling(false)
    const timeout = setTimeout(() => setSettling(true), STEP_MS)
    return () => clearTimeout(timeout)
  }, [currentStep, allDone])

  useEffect(() => {
    if (!settling) return
    const timeout = setTimeout(() => setCurrentStep((s) => s + 1), SETTLE_MS)
    return () => clearTimeout(timeout)
  }, [settling])

  useEffect(() => {
    if (!allDone) return
    const timeout = setTimeout(() => navigate("/result", { state: { query }, replace: true }), 700)
    return () => clearTimeout(timeout)
  }, [allDone, navigate, query])

  const radius = (RING_SIZE - RING_STROKE) / 2
  const circumference = radius * 2 * Math.PI
  const progress = (Math.min(currentStep, totalSteps) / totalSteps) * 100
  const dashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-10 bg-gradient-to-b from-brand-glow-500 to-brand-glow-300 px-5 pb-24 pt-10">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center" style={{ width: RING_SIZE, height: RING_SIZE }}>
          <div
            aria-hidden="true"
            className={`absolute inset-2 rounded-full blur-xl transition-colors duration-500 ${
              allDone ? "bg-green-300/25" : "animate-pulse bg-white/20"
            }`}
          />
          <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              strokeWidth={RING_STROKE}
              fill="none"
              className="stroke-white/20"
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              strokeWidth={RING_STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              style={{ transition: "stroke-dashoffset 700ms ease-out, stroke 500ms ease-out" }}
              className={allDone ? "stroke-green-400" : "stroke-white"}
            />
          </svg>
          <img src={prismLogo} alt="" className="absolute inset-0 m-auto h-[116px] w-[116px] object-contain" />
        </div>

        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-lg font-bold text-white">AI가 리뷰를 분석하고 있어요</h1>
          <p className="text-sm text-white/80">잠시만 기다려주세요</p>
        </div>
      </div>

      <div role="status" aria-live="polite" className="flex flex-col gap-4">
        {analysisSteps.map((step, i) => {
          const Icon = icons[step.key]
          const state = i < currentStep ? "done" : i === currentStep ? "active" : "pending"
          return (
            <div
              key={step.key}
              aria-current={state === "active" ? "step" : undefined}
              className="flex items-center gap-3.5"
            >
              <div
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
                  state === "pending"
                    ? "border-2 border-white/25"
                    : state === "active"
                      ? "bg-white"
                      : "bg-green-500"
                }`}
              >
                {state === "active" && (
                  <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-white/30" />
                )}
                <span key={state} className={state === "done" ? "animate-step-pop" : ""}>
                  {state === "done" ? (
                    <Check size={18} strokeWidth={3} className="text-white" />
                  ) : (
                    <Icon
                      size={18}
                      className={state === "active" ? "text-brand-500" : "text-white/30"}
                    />
                  )}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    state === "pending" ? "text-white/35" : "text-white"
                  }`}
                >
                  {step.title}
                </p>
                <p
                  className={`text-xs transition-colors duration-300 ${
                    state === "pending" ? "text-white/20" : "text-white/75"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
