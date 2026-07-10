import { useState } from "react"
import { X, Link2, MessageCircle } from "lucide-react"

interface ShareModalProps {
  url: string
  onClose: () => void
}

export default function ShareModal({ url, onClose }: ShareModalProps) {
  const [toast, setToast] = useState<string | null>(null)

  const flashToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 1500)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // ignore: clipboard permission denied in this environment
    }
    flashToast("복사되었습니다")
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="공유하기"
        className="w-full max-w-md rounded-t-3xl bg-white p-5 pb-8 shadow-xl dark:border dark:border-white/10 dark:bg-[#1A2E3D] sm:rounded-3xl sm:pb-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">공유하기</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-m-2 rounded-full p-2 text-neutral-400 transition-colors duration-150 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button type="button" onClick={copyLink} className="flex flex-1 flex-col items-center gap-2">
            <span className="neu-sm neu-pressable flex h-14 w-14 items-center justify-center rounded-full bg-white text-neutral-600 dark:bg-[#0D1B24] dark:text-neutral-300">
              <Link2 size={20} />
            </span>
            <span className="text-xs text-neutral-600 dark:text-neutral-300">링크 복사</span>
          </button>
          <button
            type="button"
            onClick={() => flashToast("준비중인 기능이에요")}
            className="flex flex-1 flex-col items-center gap-2"
            aria-label="카카오톡 공유 (준비중)"
            title="준비중"
          >
            <span className="neu-sm neu-pressable flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-neutral-900">
              <MessageCircle size={20} fill="currentColor" />
            </span>
            <span className="text-xs text-neutral-600 dark:text-neutral-300">카카오톡</span>
          </button>
        </div>

        <div className="relative mt-4 h-5">
          {toast && (
            <p className="absolute inset-x-0 text-center text-xs font-medium text-brand-500 dark:text-brand-400">
              {toast}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
