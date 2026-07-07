import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, User, Camera } from "lucide-react"
import { AVATAR_STYLES, useProfile } from "../store/ProfileContext"

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()

  const [avatarIndex, setAvatarIndex] = useState(profile.avatarIndex)
  const [nickname, setNickname] = useState(profile.nickname)
  const [email, setEmail] = useState(profile.email)

  const avatar = AVATAR_STYLES[avatarIndex]

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 px-5 pb-24 pt-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="rounded-full p-1 text-neutral-500 transition-colors duration-150 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">회원정보 수정</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          updateProfile({ nickname, email, avatarIndex })
          navigate("/my")
        }}
        className="flex flex-col gap-8"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className={`flex h-24 w-24 items-center justify-center rounded-full ${avatar.bg}`}>
              <User size={40} className={avatar.fg} />
            </div>
            <button
              type="button"
              onClick={() => setAvatarIndex((i) => (i + 1) % AVATAR_STYLES.length)}
              aria-label="프로필 사진 변경"
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-yellow-400 text-neutral-900 transition-colors duration-150 hover:bg-yellow-500 active:bg-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:border-neutral-950"
            >
              <Camera size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">닉네임</span>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              type="text"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">이메일</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-yellow-400 py-3.5 text-sm font-semibold text-neutral-900 transition-colors duration-150 hover:bg-yellow-500 active:bg-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
        >
          수정
        </button>
      </form>
    </div>
  )
}
