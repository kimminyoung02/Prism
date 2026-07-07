import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { useAuth } from "../store/AuthContext"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-8 px-6 pb-24 pt-10">
      <h1 className="text-center text-3xl font-bold tracking-tight text-yellow-500">Prism</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          login()
        }}
        className="flex flex-col gap-3"
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="이메일 또는 아이디"
          autoComplete="username"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="비밀번호"
          autoComplete="current-password"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <button
          type="submit"
          className="mt-1 w-full rounded-xl bg-yellow-400 py-3.5 text-sm font-semibold text-neutral-900 transition-colors duration-150 hover:bg-yellow-500 active:bg-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
        >
          로그인
        </button>
      </form>

      <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
        계정이 없으신가요?{" "}
        <button
          type="button"
          className="font-semibold text-yellow-600 hover:underline dark:text-yellow-400"
        >
          회원가입
        </button>
      </p>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        <span className="text-xs text-neutral-400">또는</span>
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={login}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3 text-sm font-medium text-neutral-900 transition-opacity duration-150 hover:opacity-90 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
        >
          <MessageCircle size={18} fill="currentColor" className="text-neutral-900" />
          카카오로 시작하기
        </button>
        <button
          type="button"
          onClick={login}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#03C75A] py-3 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-90 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
        >
          <span className="flex h-[18px] w-[18px] items-center justify-center text-[13px] font-bold leading-none">N</span>
          네이버로 시작하기
        </button>
        <button
          type="button"
          onClick={login}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-3 text-sm font-medium text-neutral-700 transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <span className="flex h-[18px] w-[18px] items-center justify-center text-[13px] font-bold leading-none text-neutral-500">
            G
          </span>
          구글로 시작하기
        </button>
      </div>
    </div>
  )
}
