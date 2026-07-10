import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../store/AuthContext"
import { useProfile } from "../store/ProfileContext"

export default function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { profile, updateProfile } = useProfile()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [nickname, setNickname] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 px-6 pb-24 pt-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="-m-3 rounded-full p-3 text-neutral-500 transition-colors duration-150 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">회원가입</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()

          if (!email.trim() || !password || !nickname.trim()) {
            setError("모든 항목을 입력해주세요")
            return
          }
          if (password !== passwordConfirm) {
            setError("비밀번호가 일치하지 않아요")
            return
          }

          setError(null)
          updateProfile({ ...profile, nickname: nickname.trim(), email: email.trim() })
          login()
          navigate("/my")
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-email" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            이메일
          </label>
          <input
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            className="neu-inset w-full rounded-xl bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-400/30 dark:bg-[#1A2E3D] dark:text-neutral-100"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-password" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            비밀번호
          </label>
          <div className="relative">
            <input
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-password-confirm" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            비밀번호 확인
          </label>
          <div className="relative">
            <input
              id="signup-password-confirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="비밀번호를 한 번 더 입력하세요"
              autoComplete="new-password"
              className="neu-inset w-full rounded-xl bg-white px-4 py-3 pr-11 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-400/30 dark:bg-[#1A2E3D] dark:text-neutral-100"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm((v) => !v)}
              aria-label={showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 표시"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2.5 text-neutral-400 transition-colors duration-150 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:hover:text-neutral-200"
            >
              {showPasswordConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-nickname" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            닉네임
          </label>
          <input
            id="signup-nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            type="text"
            placeholder="닉네임을 입력하세요"
            autoComplete="nickname"
            className="neu-inset w-full rounded-xl bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-400/30 dark:bg-[#1A2E3D] dark:text-neutral-100"
          />
        </div>

        {error && <p className="text-xs text-rose-500">{error}</p>}

        <button
          type="submit"
          className="mt-1 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 py-3.5 text-sm font-semibold text-white transition duration-150 hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
        >
          회원가입
        </button>
      </form>

      <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
        이미 계정이 있으신가요?{" "}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          로그인
        </button>
      </p>
    </div>
  )
}
