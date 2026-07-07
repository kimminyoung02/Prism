import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
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

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 px-6 pb-24 pt-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="rounded-full p-1 text-neutral-500 transition-colors duration-150 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:text-neutral-400 dark:hover:text-neutral-200"
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
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="이메일"
          autoComplete="email"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="비밀번호"
          autoComplete="new-password"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <input
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          type="password"
          placeholder="비밀번호 확인"
          autoComplete="new-password"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          type="text"
          placeholder="닉네임"
          autoComplete="nickname"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />

        {error && <p className="text-xs text-rose-500">{error}</p>}

        <button
          type="submit"
          className="mt-1 w-full rounded-xl bg-yellow-400 py-3.5 text-sm font-semibold text-neutral-900 transition-colors duration-150 hover:bg-yellow-500 active:bg-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
        >
          회원가입
        </button>
      </form>

      <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
        이미 계정이 있으신가요?{" "}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="font-semibold text-yellow-600 hover:underline dark:text-yellow-400"
        >
          로그인
        </button>
      </p>
    </div>
  )
}
