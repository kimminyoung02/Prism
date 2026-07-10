import { supabase } from "./supabaseClient"

const BUCKET = "images"

/** {user_id}/{prefix}-{timestamp}.{ext} 경로에 업로드하고 공개 URL을 반환. 실패 시 null. */
export async function uploadImage(userId: string, file: File, prefix: "avatar" | "post"): Promise<string | null> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `${userId}/${prefix}-${Date.now()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  })

  if (error) {
    console.error("image upload failed", error)
    return null
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
