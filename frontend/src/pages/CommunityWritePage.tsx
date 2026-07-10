import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useCommunity, POST_CATEGORIES, CATEGORY_STYLES, type PostCategory } from "../store/CommunityContext"

export default function CommunityWritePage() {
  const navigate = useNavigate()
  const { addPost } = useCommunity()
  const [category, setCategory] = useState<PostCategory>(POST_CATEGORIES[0])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)

  const submit = () => {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요")
      return
    }
    addPost(title, content, category)
    navigate("/community")
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-6 px-5 pb-24 pt-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="-m-3 rounded-full p-3 text-neutral-500 transition-colors duration-150 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">글쓰기</h1>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          {POST_CATEGORIES.map((c) => {
            const style = CATEGORY_STYLES[c]
            const selected = c === category
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity duration-150 " +
                  (selected ? `${style.light} ${style.dark}` : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500")
                }
              >
                {c}
              </button>
            )
          })}
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="neu-inset w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400 dark:bg-[#1A2E3D] dark:text-neutral-100"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={10}
          className="neu-inset w-full resize-none rounded-xl bg-white px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:bg-[#1A2E3D] dark:text-neutral-100"
        />
        {error && <p className="text-xs text-rose-500">{error}</p>}
        <button
          type="button"
          onClick={submit}
          className="mt-1 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 py-3.5 text-sm font-semibold text-white transition duration-150 hover:brightness-110 active:brightness-95"
        >
          등록
        </button>
      </div>
    </div>
  )
}
