import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

interface LegalPageProps {
  title: string
  paragraphs: string[]
}

export default function LegalPage({ title, paragraphs }: LegalPageProps) {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-6 px-5 pb-24 pt-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="-m-3 rounded-full p-3 text-neutral-500 transition-colors duration-150 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{title}</h1>
      </div>

      <div className="flex flex-col gap-4">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}
