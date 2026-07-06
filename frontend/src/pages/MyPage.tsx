import { User } from "lucide-react"

export default function MyPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-6 px-5 pb-24 pt-8">
      <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">마이</h1>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-neutral-400">
        <User size={32} />
        <p className="text-sm">준비중인 화면이에요</p>
      </div>
    </div>
  )
}
