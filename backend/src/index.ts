import "dotenv/config"
import cors from "cors"
import express from "express"
import { createHash } from "node:crypto"

const app = express()
const port = process.env.PORT ?? 3001

// 개발/테스트 단계 API 호출량 제한. 실 서비스 전환 시 이 값들을 늘리면 됨.
const BLOG_RESULT_LIMIT = 10
const YOUTUBE_RESULT_LIMIT = 5

app.use(cors())
app.use(express.json())

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

function stripHtml(text: string) {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function formatPostDate(yyyymmdd: string) {
  if (!/^\d{8}$/.test(yyyymmdd)) return yyyymmdd
  return `${yyyymmdd.slice(0, 4)}.${yyyymmdd.slice(4, 6)}.${yyyymmdd.slice(6, 8)}`
}

/** 검색 결과 내 배열 인덱스가 아니라, 실제 글의 고유 URL을 해시해 항상 같은 글에는 같은 id가 나오도록 함. */
function stableReviewId(prefix: string, uniqueSource: string) {
  return `${prefix}-${createHash("sha1").update(uniqueSource).digest("hex").slice(0, 16)}`
}

interface NaverBlogItem {
  title: string
  link: string
  description: string
  bloggername: string
  postdate: string
}

app.get("/api/search/blog", async (req, res) => {
  const query = req.query.query
  if (typeof query !== "string" || !query.trim()) {
    res.status(400).json({ error: "query is required" })
    return
  }

  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    res.status(500).json({ error: "Naver API credentials are not configured" })
    return
  }

  const url = new URL("https://openapi.naver.com/v1/search/blog.json")
  url.searchParams.set("query", query)
  url.searchParams.set("display", String(BLOG_RESULT_LIMIT))
  url.searchParams.set("sort", "sim")

  try {
    const naverRes = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
    })

    if (!naverRes.ok) {
      res.status(naverRes.status).json({ error: "Naver API request failed" })
      return
    }

    const data = (await naverRes.json()) as { items?: NaverBlogItem[] }
    const items = (data.items ?? []).map((item) => ({
      id: stableReviewId("naver-blog", item.link),
      title: stripHtml(item.title),
      source: item.bloggername,
      date: formatPostDate(item.postdate),
      stat: stripHtml(item.description),
      url: item.link,
    }))

    res.json({ items })
  } catch {
    res.status(502).json({ error: "Failed to reach Naver API" })
  }
})

interface NaverImageItem {
  title: string
  link: string
  thumbnail: string
}

app.get("/api/search/image", async (req, res) => {
  const query = req.query.query
  if (typeof query !== "string" || !query.trim()) {
    res.status(400).json({ error: "query is required" })
    return
  }

  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    res.status(500).json({ error: "Naver API credentials are not configured" })
    return
  }

  const url = new URL("https://openapi.naver.com/v1/search/image")
  url.searchParams.set("query", query)
  url.searchParams.set("display", "1")
  url.searchParams.set("sort", "sim")

  try {
    const naverRes = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
    })

    if (!naverRes.ok) {
      res.status(naverRes.status).json({ error: "Naver image API request failed" })
      return
    }

    const data = (await naverRes.json()) as { items?: NaverImageItem[] }
    const first = data.items?.[0]

    res.json({ imageUrl: first?.thumbnail ?? null })
  } catch {
    res.status(502).json({ error: "Failed to reach Naver API" })
  }
})

function formatIsoDate(iso: string) {
  const datePart = iso.slice(0, 10)
  return datePart.replace(/-/g, ".")
}

interface YoutubeSearchItem {
  id: { videoId?: string }
  snippet: {
    title: string
    channelTitle: string
    publishedAt: string
    thumbnails: { medium?: { url: string }; default?: { url: string } }
  }
}

interface YoutubeVideoStats {
  id: string
  statistics?: { viewCount?: string }
}

app.get("/api/search/youtube", async (req, res) => {
  const query = req.query.query
  if (typeof query !== "string" || !query.trim()) {
    res.status(400).json({ error: "query is required" })
    return
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: "YouTube API key is not configured" })
    return
  }

  try {
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search")
    searchUrl.searchParams.set("part", "snippet")
    searchUrl.searchParams.set("q", query)
    searchUrl.searchParams.set("type", "video")
    searchUrl.searchParams.set("maxResults", String(YOUTUBE_RESULT_LIMIT))
    searchUrl.searchParams.set("key", apiKey)

    const searchRes = await fetch(searchUrl)
    if (!searchRes.ok) {
      res.status(searchRes.status).json({ error: "YouTube search request failed" })
      return
    }

    const searchData = (await searchRes.json()) as { items?: YoutubeSearchItem[] }
    const searchItems = (searchData.items ?? []).filter((item) => item.id.videoId)
    const videoIds = searchItems.map((item) => item.id.videoId as string)

    const viewCounts: Record<string, string> = {}
    if (videoIds.length > 0) {
      const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos")
      videosUrl.searchParams.set("part", "statistics")
      videosUrl.searchParams.set("id", videoIds.join(","))
      videosUrl.searchParams.set("key", apiKey)

      const videosRes = await fetch(videosUrl)
      if (videosRes.ok) {
        const videosData = (await videosRes.json()) as { items?: YoutubeVideoStats[] }
        for (const video of videosData.items ?? []) {
          viewCounts[video.id] = video.statistics?.viewCount ?? "0"
        }
      }
    }

    const items = searchItems.map((item) => {
      const videoId = item.id.videoId as string
      const viewCount = viewCounts[videoId]
      return {
        id: `youtube-${videoId}`,
        title: stripHtml(item.snippet.title),
        source: item.snippet.channelTitle,
        date: formatIsoDate(item.snippet.publishedAt),
        stat: viewCount ? `조회 ${Number(viewCount).toLocaleString("ko-KR")}` : "",
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? "",
      }
    })

    res.json({ items })
  } catch {
    res.status(502).json({ error: "Failed to reach YouTube API" })
  }
})

app.listen(port, () => {
  console.log(`backend listening on http://localhost:${port}`)
})

export default app
