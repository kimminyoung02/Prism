import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MessageCircle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../store/AuthContext"
import { useProfile } from "../store/ProfileContext"
import prismWordmark from "../assets/prism-wordmark.png"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { profile, updateProfile } = useProfile()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-8 px-6 pb-24 pt-10">
      <h1 className="flex justify-center">
        <img src={prismWordmark} alt="Prism" className="h-9 w-auto dark:invert" />
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (email.trim()) {
            updateProfile({ ...profile, email: email.trim() })
          }
          login()
          navigate("/my")
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            이메일 또는 아이디
          </label>
          <input
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="이메일 또는 아이디를 입력하세요"
            autoComplete="username"
            className="neu-inset w-full rounded-xl bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-400/30 dark:bg-[#1A2E3D] dark:text-neutral-100"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            비밀번호
          </label>
          <div className="relative">
            <input
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              className="neu-inset w-full rounded-xl bg-white px-4 py-3 pr-11 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-400/30 dark:bg-[#1A2E3D] dark:text-neutral-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2.5 text-neutral-400 transition-colors duration-150 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:hover:text-neutral-200"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="mt-1 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 py-3.5 text-sm font-semibold text-white transition duration-150 hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
        >
          로그인
        </button>
      </form>

      <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
        계정이 없으신가요?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          회원가입
        </button>
      </p>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        <span className="text-xs text-neutral-400">또는</span>
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => {
            login()
            navigate("/my")
          }}
          aria-label="카카오로 시작하기"
          title="카카오로 시작하기"
          className="neu-sm neu-pressable flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-neutral-900 transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
        >
          <MessageCircle size={22} fill="currentColor" />
        </button>
        <button
          type="button"
          onClick={() => {
            login()
            navigate("/my")
          }}
          aria-label="네이버로 시작하기"
          title="네이버로 시작하기"
          className="neu-sm neu-pressable flex h-14 w-14 items-center justify-center rounded-full bg-[#03C75A] text-white transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
        >
          <span className="text-lg font-bold leading-none">N</span>
        </button>
        <button
          type="button"
          onClick={() => {
            login()
            navigate("/my")
          }}
          aria-label="구글로 시작하기"
          title="구글로 시작하기"
          className="neu-sm neu-pressable flex h-14 w-14 items-center justify-center rounded-full bg-white text-neutral-500 transition-colors duration-150 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-[#1A2E3D] dark:hover:bg-neutral-800"
        >
          <span className="text-lg font-bold leading-none">G</span>
        </button>
      </div>
    </div>
  )
}
