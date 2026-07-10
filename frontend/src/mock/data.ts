export interface ReviewSource {
  key: "blog" | "youtube"
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
  /** 원문 URL. 실제 API 연동 전까지는 채널별 더미 링크를 사용. */
  url: string
  thumbnail?: string
}

export interface MyListItem {
  id: string
  title: string
  date: string
  rating: number
  reviewCount?: number
  aiComment?: string
}

export interface PopularSearchTerm {
  term: string
  change: "up" | "down" | "same"
  diff?: number
}

export const popularSearchTerms: PopularSearchTerm[] = [
  { term: "H&M 리넨 여름 원피스", change: "up", diff: 2 },
  { term: "유니클로 린넨 셔츠", change: "same" },
  { term: "무신사 스탠다드 와이드 팬츠", change: "up", diff: 1 },
  { term: "폴로 랄프로렌 가디건", change: "down", diff: 3 },
  { term: "코치 크로스바디백", change: "up", diff: 4 },
  { term: "나이키 에어포스1 스니커즈", change: "down", diff: 1 },
  { term: "자라 오버사이즈 블레이저", change: "up", diff: 5 },
  { term: "아디다스 트랙탑", change: "same" },
  { term: "탑텐 반팔 티셔츠", change: "up", diff: 2 },
  { term: "뉴발란스 993 스니커즈", change: "down", diff: 2 },
]

export const todaysPick = {
  title: "리넨 오버핏 자켓",
  subtitle: "지금 만족도가 가장 높은",
}

export const defaultQuery = "리넨 오버핏 자켓"

export const lensIdentifiedProduct = {
  brand: "H&M",
  name: "린넨 오버핏 셔츠",
  confidence: "일치율 높음",
}

export const appVersion = "v1.0.0"

export const termsOfServiceText = [
  "본 약관은 Prism(이하 '회사')이 제공하는 AI 리뷰 분석 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.",
  "이용자는 서비스 이용 시 관련 법령과 본 약관의 내용을 준수하여야 하며, 서비스를 통해 제공되는 분석 결과는 참고용 정보로 실제 구매 결정의 최종 책임은 이용자에게 있습니다.",
  "회사는 서비스의 안정적인 제공을 위해 노력하며, 서비스 내용의 변경이 필요한 경우 사전에 공지합니다.",
]

export const privacyPolicyText = [
  "Prism은 이용자의 개인정보를 소중히 다루며, 관련 법령에 따라 최소한의 개인정보만을 수집·이용합니다.",
  "수집하는 개인정보는 이메일, 닉네임, 서비스 이용 기록이며, 회원 관리 및 서비스 제공 목적으로만 사용됩니다.",
  "이용자는 언제든지 자신의 개인정보 열람, 수정, 삭제를 요청할 수 있으며, 회원 탈퇴를 통해 개인정보 수집·이용에 대한 동의를 철회할 수 있습니다.",
]

export interface AnalysisStepInfo {
  key: "collect" | "clean" | "keyword" | "sentiment" | "summary"
  title: string
  description: string
}

export const analysisSteps: AnalysisStepInfo[] = [
  { key: "collect", title: "리뷰 수집 중", description: "다양한 채널에서 리뷰를 모으는 중" },
  { key: "clean", title: "전처리 중", description: "중복 제거 및 텍스트 정리 중" },
  { key: "keyword", title: "키워드 추출 중", description: "핵심 키워드를 찾는 중" },
  { key: "sentiment", title: "감정 분석 중", description: "긍정/부정 비율을 분석 중" },
  { key: "summary", title: "요약 생성 중", description: "한 줄 요약을 만드는 중" },
]

export const reviewSources: ReviewSource[] = [
  { key: "blog", label: "블로그", count: 32 },
  { key: "youtube", label: "유튜브", count: 18 },
]

export const totalReviewCount = reviewSources.reduce((sum, s) => sum + s.count, 0)

export const analyzedDate = "2026.07.06"

export const aiConclusion = {
  rating: 4.5,
  summary:
    "가볍고 시원한 착용감에 만족도가 높은 편이에요. 다만 기장이 길다는 의견도 있었어요.",
}

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

