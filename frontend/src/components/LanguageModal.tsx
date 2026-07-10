import { Check, X } from "lucide-react"
import { LANGUAGES, useLanguage } from "../store/LanguageContext"

export default function LanguageModal({ onClose }: { onClose: () => void }) {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="언어 설정"
        className="w-full max-w-md rounded-t-3xl bg-white p-5 pb-8 shadow-xl dark:border dark:border-white/10 dark:bg-[#1A2E3D] sm:rounded-3xl sm:pb-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">언어 설정</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-m-2 rounded-full p-2 text-neutral-400 transition-colors duration-150 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X size={18} />
          </button>
        </div>

        <ul className="flex flex-col gap-2">
          {LANGUAGES.map((lang) => {
            const selected = lang.code === language
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code)
                    onClose()
                  }}
                  aria-pressed={selected}
                  className="neu-sm neu-pressable flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3.5 text-left dark:bg-[#1A2E3D]"
                >
                  <span
                    className={
                      "text-sm " +
                      (selected
                        ? "font-semibold text-brand-600 dark:text-brand-400"
                        : "text-neutral-700 dark:text-neutral-300")
                    }
                  >
                    {lang.label}
                  </span>
                  {selected && <Check size={18} className="shrink-0 text-brand-500 dark:text-brand-300" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
