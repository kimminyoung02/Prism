import { createContext, useContext, useState, type ReactNode } from "react"
import type { EngagementComment } from "./EngagementContext"

export type PostCategory = "자유수다" | "코디 추천" | "질문"

export const POST_CATEGORIES: PostCategory[] = ["자유수다", "코디 추천", "질문"]

export const CATEGORY_STYLES: Record<PostCategory, { light: string; dark: string }> = {
  "자유수다": { light: "bg-sky-100 text-sky-700", dark: "dark:bg-sky-500/15 dark:text-sky-300" },
  "코디 추천": { light: "bg-violet-100 text-violet-700", dark: "dark:bg-violet-500/15 dark:text-violet-300" },
  "질문": { light: "bg-amber-100 text-amber-700", dark: "dark:bg-amber-500/15 dark:text-amber-300" },
}

function seedComment(overrides: Partial<EngagementComment> & Pick<EngagementComment, "id" | "author" | "text" | "timeLabel">): EngagementComment {
  return { likes: 0, likedByMe: false, parentId: null, replyToAuthor: null, ...overrides }
}

export const SEED_COMMENTS: Record<string, EngagementComment[]> = {
  "post-1": [
    seedComment({ id: "seed-c1", author: "옷장매니저", text: "평소 사이즈로 사시는 게 나을 것 같아요! 린넨은 세탁하면 살짝 줄어들기도 해서요.", timeLabel: "2시간 전", likes: 4 }),
    seedComment({ id: "seed-c1-r1", author: "스타일러버", text: "오 그렇군요! 참고할게요", timeLabel: "1시간 30분 전", parentId: "seed-c1", replyToAuthor: "옷장매니저" }),
    seedComment({ id: "seed-c2", author: "린넨러버", text: "저는 한 사이즈 크게 샀는데 오버핏으로 예쁘게 입고 있어요", timeLabel: "1시간 전", likes: 2 }),
  ],
  "post-3": [seedComment({ id: "seed-c3", author: "세일헌터", text: "보통 분기별로 크게 한 번씩 하는 것 같아요!", timeLabel: "어제", likes: 6 })],
  "post-5": [seedComment({ id: "seed-c4", author: "정리요정", text: "압축팩 대신 부직포 리빙박스 써보세요, 부피 훨씬 줄어요", timeLabel: "2일 전", likes: 9 })],
}

export interface CommunityPost {
  id: string
  category: PostCategory
  title: string
  content: string
  author: string
  timeLabel: string
  seedLikes: number
  seedDislikes: number
  seedViews: number
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    category: "질문",
    title: "이 브랜드 사이즈 좀 크게 나오나요?",
    content: "린넨 자켓 하나 사려고 하는데 평소 사이즈로 사면 되는지, 한 사이즈 크게 사는 게 나은지 고민이에요. 다들 어떻게 고르셨나요?",
    author: "스타일러버",
    timeLabel: "3시간 전",
    seedLikes: 12,
    seedDislikes: 0,
    seedViews: 128,
  },
  {
    id: "post-2",
    category: "자유수다",
    title: "오늘 산 원피스 완전 마음에 들어요",
    content: "고민하다 질렀는데 소재도 좋고 핏도 예뻐서 완전 만족이에요. 다들 요즘 뭐 사셨나요?",
    author: "옷장정리중",
    timeLabel: "5시간 전",
    seedLikes: 8,
    seedDislikes: 0,
    seedViews: 64,
  },
  {
    id: "post-3",
    category: "코디 추천",
    title: "이 셔츠에 뭐 매치하면 좋을까요?",
    content: "체크 셔츠 하나 샀는데 하의를 뭘로 맞춰야 할지 감이 안 와요. 추천 부탁드려요!",
    author: "쇼핑홀릭",
    timeLabel: "어제",
    seedLikes: 21,
    seedDislikes: 1,
    seedViews: 302,
  },
  {
    id: "post-4",
    category: "질문",
    title: "이 가디건 실물 어떤가요?",
    content: "사진으로는 예뻐 보이는데 실물 후기가 별로 없어서 궁금해요. 사보신 분 색감이나 두께감 알려주시면 감사하겠습니다.",
    author: "코디고민",
    timeLabel: "2일 전",
    seedLikes: 5,
    seedDislikes: 0,
    seedViews: 47,
  },
  {
    id: "post-5",
    category: "자유수다",
    title: "다들 옷 정리 어떻게 하세요? 팁 공유해요",
    content: "계절 지난 옷 보관하는 나만의 방법이 있으면 같이 나눠요. 저는 압축팩 쓰는데 부피가 여전히 커서 고민이에요.",
    author: "미니멀라이프",
    timeLabel: "3일 전",
    seedLikes: 34,
    seedDislikes: 0,
    seedViews: 415,
  },
  {
    id: "post-6",
    category: "코디 추천",
    title: "이번 시즌 트렌드 컬러가 뭘까요",
    content: "매장 돌아보니 베이지, 카키 계열이 많이 보이던데 다들 어떻게 생각하세요?",
    author: "패션피플",
    timeLabel: "4일 전",
    seedLikes: 9,
    seedDislikes: 0,
    seedViews: 88,
  },
]

interface CommunityContextValue {
  posts: CommunityPost[]
  addPost: (title: string, content: string, category: PostCategory) => CommunityPost
  getPost: (id: string) => CommunityPost | undefined
  viewCounts: Record<string, number>
  recordView: (id: string) => void
}

const CommunityContext = createContext<CommunityContextValue | null>(null)

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS)
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({})

  const addPost = (title: string, content: string, category: PostCategory) => {
    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      category,
      title: title.trim(),
      content: content.trim(),
      author: "prism_user",
      timeLabel: "방금 전",
      seedLikes: 0,
      seedDislikes: 0,
      seedViews: 0,
    }
    setPosts((prev) => [post, ...prev])
    return post
  }

  const getPost = (id: string) => posts.find((p) => p.id === id)

  const recordView = (id: string) => {
    setViewCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }

  return (
    <CommunityContext.Provider value={{ posts, addPost, getPost, viewCounts, recordView }}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const ctx = useContext(CommunityContext)
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider")
  return ctx
}
