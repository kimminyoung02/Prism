import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"
import { useAuth } from "../store/AuthContext"

interface PasswordFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  autoComplete: string
}

function PasswordField({ id, label, value, onChange, placeholder, autoComplete }: PasswordFieldProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="neu-inset w-full rounded-xl bg-white px-4 py-3 pr-11 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-400/30 dark:bg-[#1A2E3D] dark:text-neutral-100"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "비밀번호 숨기기" : "비밀번호 표시"}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2.5 text-neutral-400 transition-colors duration-150 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:hover:text-neutral-200"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!current || !next || !confirm) {
      setError("모든 항목을 입력해주세요")
      return
    }
    if (next !== confirm) {
      setError("새 비밀번호가 일치하지 않아요")
      return
    }
    if (!isSupabaseConfigured || !user?.email) {
      setError("Supabase 연결 설정이 필요해요")
      return
    }

    setError(null)
    setSubmitting(true)

    const { error: reauthError } = await supabase.auth.signInWithPassword({ email: user.email, password: current })
    if (reauthError) {
      setSubmitting(false)
      setError("현재 비밀번호가 올바르지 않아요")
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: next })
    setSubmitting(false)
    if (updateError) {
      if (updateError.message.includes("Password should be at least")) {
        setError("비밀번호는 6자 이상이어야 해요")
      } else if (updateError.message.toLowerCase().includes("should be different")) {
        setError("현재 비밀번호와 다른 비밀번호를 입력해주세요")
      } else {
        setError(updateError.message)
      }
      return
    }

    setDone(true)
    setTimeout(() => navigate("/my/settings"), 1200)
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-3 bg-surface px-6 text-center dark:bg-[#0D1B24]">
        <CheckCircle2 size={48} className="text-emerald-500" />
        <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">비밀번호가 변경되었습니다</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-6 bg-surface pb-24 dark:bg-[#0D1B24]">
      <div className="rounded-b-3xl bg-gradient-to-b from-brand-500 to-brand-400 px-5 pb-5 pt-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
            className="-m-3 rounded-full p-3 text-white/80 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-bold text-white">비밀번호 변경</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-5">
        <PasswordField
          id="current-password"
          label="현재 비밀번호"
          value={current}
          onChange={setCurrent}
          placeholder="현재 비밀번호를 입력하세요"
          autoComplete="current-password"
        />
        <PasswordField
          id="new-password"
          label="새 비밀번호"
          value={next}
          onChange={setNext}
          placeholder="새 비밀번호를 입력하세요"
          autoComplete="new-password"
        />
        <PasswordField
          id="new-password-confirm"
          label="새 비밀번호 확인"
          value={confirm}
          onChange={setConfirm}
          placeholder="새 비밀번호를 한 번 더 입력하세요"
          autoComplete="new-password"
        />

        {error && <p className="text-xs text-rose-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 py-3.5 text-sm font-semibold text-white transition duration-150 hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {submitting ? "변경 중..." : "변경하기"}
        </button>
      </form>
    </div>
  )
}
