export interface ChannelProgress {
  key: "blog" | "youtube" | "community" | "shopping"
  label: string
  total: number
}

export interface ReviewSource {
  key: "blog" | "youtube" | "community"
  label: string
  count: number
}

export interface Keyword {
  word: string
  count: number
}

export interface ReviewItem {
  id: string
  title: string
  source: string
  date: string
  stat: string
}

export const recentSearches = ["리넨 오버핏 자켓", "와이드 데님 팬츠", "니트 가디건"]

export const popularTags = [
  "여름 원피스",
  "린넨 셔츠",
  "와이드 팬츠",
  "가디건",
  "크로스백",
  "스니커즈",
]

export const defaultQuery = "리넨 오버핏 자켓"

export const channelProgress: ChannelProgress[] = [
  { key: "blog", label: "블로그", total: 32 },
  { key: "youtube", label: "유튜브", total: 18 },
  { key: "community", label: "커뮤니티", total: 24 },
  { key: "shopping", label: "쇼핑몰", total: 15 },
]

export const analysisStepLabels = [
  "리뷰 수집완료",
  "전처리중",
  "핵심 키워드 추출",
  "감성·의견 분석",
  "요약 생성중",
  "분석완료",
]

export const totalReviewCount = channelProgress.reduce((sum, c) => sum + c.total, 0)

export const analyzedDate = "2026.07.06"

export const aiConclusion = {
  rating: 4.5,
  summary:
    "가볍고 시원한 착용감에 만족도가 높은 편이에요. 다만 기장이 길다는 의견도 있었어요.",
}

export const reviewSources: ReviewSource[] = [
  { key: "blog", label: "블로그", count: 32 },
  { key: "youtube", label: "유튜브", count: 18 },
  { key: "community", label: "커뮤니티", count: 24 },
]

export const pros = [
  "소재가 가볍고 통기성이 좋다는 의견이 많아요",
  "오버핏 실루엣이 예쁘다는 의견이 있어요",
  "다양한 코디에 활용하기 좋다는 의견이 있어요",
]

export const cons = [
  "기장이 생각보다 길다는 의견이 있어요",
  "구김이 잘 간다는 의견이 있어요",
  "세탁 후 수축될 수 있다는 의견이 있어요",
]

export const keywords: Keyword[] = [
  { word: "핏", count: 24 },
  { word: "소재", count: 19 },
  { word: "색상", count: 15 },
  { word: "사이즈", count: 12 },
  { word: "배송", count: 9 },
  { word: "가성비", count: 7 },
]

export const reviewsByChannel: Record<"blog" | "youtube" | "community", ReviewItem[]> = {
  blog: [
    { id: "b1", title: "리넨 자켓 한 달 착용 후기", source: "데일리룩 블로그", date: "2026.06.28", stat: "댓글 12" },
    { id: "b2", title: "오버핏 자켓, 키 작은 사람도 괜찮을까?", source: "패션다이어리", date: "2026.06.24", stat: "댓글 8" },
    { id: "b3", title: "여름 자켓 코디 이렇게 해봤어요", source: "스타일노트", date: "2026.06.19", stat: "댓글 5" },
    { id: "b4", title: "선물용으로 고민중이라면 참고하세요", source: "리뷰노트", date: "2026.06.11", stat: "댓글 3" },
  ],
  youtube: [
    { id: "y1", title: "리넨 오버핏 자켓 솔직 후기 (내돈내산)", source: "패션리뷰채널", date: "2026.06.30", stat: "조회 84,201" },
    { id: "y2", title: "이 가격 값 할까? 3개월 착용기", source: "잇템언박싱", date: "2026.06.22", stat: "조회 51,730" },
    { id: "y3", title: "린넨 자켓 세탁 후 수축 테스트 해봤습니다", source: "패브릭케어", date: "2026.06.15", stat: "조회 33,402" },
  ],
  community: [
    { id: "c1", title: "리넨 자켓 사이즈 어떻게 골라야 하나요?", source: "패션카페", date: "2026.06.27", stat: "좋아요 41" },
    { id: "c2", title: "생일선물로 받았는데 만족도 공유합니다", source: "여성시대", date: "2026.06.20", stat: "좋아요 63" },
    { id: "c3", title: "직구랑 국내 정발 차이 있나요?", source: "클리앙", date: "2026.06.13", stat: "좋아요 27" },
    { id: "c4", title: "기장 길다는 말이 많던데 실제로 어떤가요", source: "네이트판", date: "2026.06.08", stat: "좋아요 19" },
  ],
}
