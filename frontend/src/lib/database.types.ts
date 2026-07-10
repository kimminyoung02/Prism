export interface UserRow {
  id: string
  nickname: string
  avatar_url: string | null
  created_at: string
}

export interface SearchHistoryRow {
  id: string
  user_id: string
  query: string
  searched_at: string
}

export interface PopularSearchRow {
  query: string
  search_count: number
  last_searched_at: string
}

export type ScrapItemType = "product" | "review"
export type ScrapSource = "blog" | "youtube" | "community"

export interface ScrapRow {
  id: string
  user_id: string
  item_type: ScrapItemType
  ref_id: string
  title: string
  subtitle: string | null
  query: string | null
  rating: number | null
  url: string | null
  source: ScrapSource | null
  created_at: string
}

export type PostCategoryRow = "자유수다" | "코디 추천" | "질문"

export interface PostRow {
  id: string
  author_id: string
  category: PostCategoryRow
  title: string
  content: string
  view_count: number
  image_url: string | null
  created_at: string
}

export type CommentTargetType = "post" | "review"

export interface CommentRow {
  id: string
  target_type: CommentTargetType
  target_id: string
  author_id: string
  content: string
  parent_comment_id: string | null
  reply_to_author: string | null
  created_at: string
}

export type VoteTargetType = "post" | "review" | "comment"
export type VoteType = "like" | "dislike"

export interface LikeRow {
  id: string
  user_id: string
  target_type: VoteTargetType
  target_id: string
  vote_type: VoteType
  created_at: string
}
