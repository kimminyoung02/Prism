import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { X, Image, Link2 } from "lucide-react"
import { useCommunity, POST_CATEGORIES, CATEGORY_STYLES, type PostCategory } from "../store/CommunityContext"
import { useAuth } from "../store/AuthContext"
import { uploadImage } from "../lib/uploadImage"

export default function CommunityWritePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addPost } = useCommunity()
  const [category, setCategory] = useState<PostCategory>(POST_CATEGORIES[0])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [attachToast, setAttachToast] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const isDraft = title.trim().length > 0 || content.trim().length > 0

  const showAttachToast = (message: string) => {
    setAttachToast(message)
    window.setTimeout(() => setAttachToast(null), 1800)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !user) return

    setUploadingImage(true)
    const publicUrl = await uploadImage(user.id, file, "post")
    setUploadingImage(false)

    if (publicUrl) {
      setImageUrl(publicUrl)
    } else {
      showAttachToast("이미지 업로드에 실패했어요")
    }
  }

  const submit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요")
      return
    }
    setError(null)
    setSubmitting(true)
    const post = await addPost(title, content, category, imageUrl)
    setSubmitting(false)
    if (!post) {
      setError("게시글 등록에 실패했어요. 다시 시도해주세요")
      return
    }
    navigate("/community")
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-white dark:bg-[#0D1B24]">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-white/10">
        <button
          onClick={() => navigate(-1)}
          aria-label="취소"
          className="-m-2 flex items-center gap-1 rounded-full p-2 text-neutral-500 transition-colors duration-150 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <X size={20} />
        </button>
        <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">글쓰기</h1>
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-500 active:bg-brand-600 disabled:opacity-60"
        >
          {submitting ? "게시 중..." : "게시"}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
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
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 " +
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
          placeholder="제목을 입력해주세요"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-brand-400 dark:border-white/10 dark:bg-transparent dark:text-neutral-100"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="커뮤니티에 자유롭게 의견을 나눠보세요"
          rows={12}
          className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-brand-400 dark:border-white/10 dark:bg-transparent dark:text-neutral-100"
        />
        {error && <p className="text-xs text-rose-500">{error}</p>}

        {imageUrl && (
          <div className="relative w-fit">
            <img src={imageUrl} alt="첨부 이미지 미리보기" className="h-28 w-28 rounded-xl object-cover" />
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              aria-label="첨부 이미지 삭제"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900/80 text-white"
            >
              <X size={13} />
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploadingImage}
            className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-600 transition-colors duration-150 hover:bg-neutral-200 disabled:opacity-60 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10"
          >
            <Image size={14} />
            {uploadingImage ? "업로드 중..." : "사진 추가"}
          </button>
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          <button
            type="button"
            onClick={() => showAttachToast("링크 추가는 준비중이에요")}
            className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-600 transition-colors duration-150 hover:bg-neutral-200 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10"
          >
            <Link2 size={14} />
            링크 추가
          </button>
        </div>

        <div className="rounded-xl bg-sky-50 px-4 py-3 text-xs leading-relaxed text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
          커뮤니티 가이드라인을 지켜주세요
        </div>

        <div className="flex items-center justify-end">
          {isDraft && <span className="text-[11px] text-neutral-400 dark:text-neutral-500">임시저장됨</span>}
        </div>
      </div>

      {attachToast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-28 z-50 flex justify-center px-5">
          <div className="rounded-full bg-neutral-900/90 px-4 py-2 text-xs font-medium text-white shadow-lg dark:bg-white/90 dark:text-neutral-900">
            {attachToast}
          </div>
        </div>
      )}
    </div>
  )
}
