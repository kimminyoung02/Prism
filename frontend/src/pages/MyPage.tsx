import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  User,
  Bell,
  Settings,
  ChevronRight,
  Camera,
  Pencil,
  Check,
  Clock,
  FileText,
  ShieldCheck,
} from "lucide-react"
import { useAuth } from "../store/AuthContext"
import { useScrap } from "../store/ScrapContext"
import { AVATAR_STYLES, useProfile } from "../store/ProfileContext"
import { useActivity } from "../store/ActivityContext"
import { appVersion } from "../mock/data"
import { uploadImage } from "../lib/uploadImage"

export default function MyPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { profile, updateProfile } = useProfile()
  const { items } = useScrap()
  const { recentSearches, viewedProducts, analysisRunCount } = useActivity()
  const avatar = AVATAR_STYLES[profile.avatarIndex]
  const photoInputRef = useRef<HTMLInputElement>(null)

  const [editingNickname, setEditingNickname] = useState(false)
  const [nicknameDraft, setNicknameDraft] = useState(profile.nickname)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const stats = [
    { label: "리뷰 분석", value: analysisRunCount, to: "/my/reviews" },
    { label: "찜한 리뷰", value: items.length, to: "/favorites" },
    { label: "최근 본 제품", value: viewedProducts.length, to: "/my/recent" },
  ]

  const menu = [
    { icon: Bell, label: "알림", to: "/my/notifications" },
    { icon: Settings, label: "설정", to: "/my/settings" },
  ]

  const infoMenu = [
    { icon: FileText, label: "이용약관", to: "/legal/terms" },
    { icon: ShieldCheck, label: "개인정보처리방침", to: "/legal/privacy" },
  ]

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !user) return

    setUploadingPhoto(true)
    const publicUrl = await uploadImage(user.id, file, "avatar")
    setUploadingPhoto(false)

    if (publicUrl) {
      updateProfile({ ...profile, avatarPhoto: publicUrl })
    }
  }

  const startEditingNickname = () => {
    setNicknameDraft(profile.nickname)
    setEditingNickname(true)
  }

  const commitNickname = () => {
    const trimmed = nicknameDraft.trim()
    if (trimmed) {
      updateProfile({ ...profile, nickname: trimmed })
    }
    setEditingNickname(false)
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 bg-surface pb-24 dark:bg-[#0D1B24]">
      <section className="relative flex items-center gap-5 rounded-b-[2rem] bg-gradient-to-b from-brand-500 to-brand-400 px-5 pb-8 pt-8">
        <button
          type="button"
          onClick={() => photoInputRef.current?.click()}
          disabled={uploadingPhoto}
          aria-label="프로필 사진 변경"
          className="group relative h-20 w-20 shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500"
        >
          {profile.avatarPhoto ? (
            <img src={profile.avatarPhoto} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className={`flex h-20 w-20 items-center justify-center rounded-full ${avatar.bg}`}>
              <User size={32} className={avatar.fg} />
            </div>
          )}
          {uploadingPhoto && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            </div>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-500 bg-white text-neutral-600 transition-transform duration-150 group-hover:scale-110 group-active:scale-95">
            <Camera size={12} />
          </span>
        </button>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handlePhotoChange}
        />

        <div className="min-w-0 flex-1 pr-12">
          {editingNickname ? (
            <div className="relative w-full">
              <input
                autoFocus
                value={nicknameDraft}
                onChange={(e) => setNicknameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitNickname()
                  if (e.key === "Escape") setEditingNickname(false)
                }}
                className="w-full min-w-0 rounded-lg bg-white/20 py-1 pl-2 pr-7 text-base font-semibold text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white/60"
              />
              <button
                type="button"
                onClick={commitNickname}
                aria-label="닉네임 저장"
                className="absolute right-0.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Check size={15} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={startEditingNickname}
              className="group -ml-1 flex max-w-full items-center gap-1.5 rounded-lg px-1 py-0.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <p className="truncate text-base font-semibold text-white">{profile.nickname}</p>
              <Pencil size={13} className="shrink-0 text-white/50 transition-colors duration-150 group-hover:text-white/90" />
            </button>
          )}
          <p className="truncate text-sm text-brand-100">{profile.email}</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/my/notifications")}
          aria-label="알림"
          className="absolute right-2 top-7 rounded-full p-3 text-white/80 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500"
        >
          <Bell size={20} />
        </button>
      </section>

      <section className="-mt-3 grid grid-cols-3 gap-3 px-5">
        {stats.map((stat) => (
          <button
            key={stat.label}
            type="button"
            onClick={() => navigate(stat.to)}
            className="neu-sm neu-pressable flex flex-col items-center gap-1 rounded-2xl bg-white py-4 transition-colors duration-150 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-[#1A2E3D] dark:hover:bg-neutral-800"
          >
            <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{stat.value}</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</span>
          </button>
        ))}
      </section>

      <section className="flex flex-col gap-3 px-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <Clock size={14} className="text-neutral-400" />
            최근 검색 기록
          </h2>
          <button
            onClick={() => navigate("/search-terms/recent")}
            className="flex items-center text-xs text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            전체보기
            <ChevronRight size={14} />
          </button>
        </div>
        {recentSearches.length > 0 ? (
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => navigate("/collecting", { state: { query: term } })}
                className="neu-sm neu-pressable shrink-0 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-xs text-neutral-700 transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-[#1A2E3D] dark:text-neutral-300"
              >
                {term}
              </button>
            ))}
          </div>
        ) : (
          <p className="py-2 text-sm text-neutral-400 dark:text-neutral-500">아직 검색한 제품이 없어요</p>
        )}
      </section>

      <section className="flex flex-col gap-2 px-5">
        <ul className="flex flex-col gap-2">
          {[...menu, ...infoMenu].map(({ icon: Icon, label, to }) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => navigate(to)}
                className="neu-sm neu-pressable flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-left transition-colors duration-150 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-[#1A2E3D] dark:hover:bg-neutral-800"
              >
                <Icon size={18} className="shrink-0 text-neutral-400" />
                <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
                <ChevronRight size={16} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
              </button>
            </li>
          ))}
          <li className="mt-2">
            <button
              type="button"
              onClick={logout}
              className="neu-sm neu-pressable flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3.5 transition-colors duration-150 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-[#1A2E3D] dark:hover:bg-neutral-800"
            >
              <span className="text-sm text-neutral-400 dark:text-neutral-500">로그아웃</span>
            </button>
          </li>
        </ul>
        <p className="pt-1 text-center text-xs text-neutral-400 dark:text-neutral-600">앱 버전 {appVersion}</p>
      </section>
    </div>
  )
}
