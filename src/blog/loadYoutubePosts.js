async function loadYoutubePosts() {
  const API_KEY = process.env.YOUTUBE_API_KEY

  const url =
    "https://www.googleapis.com/youtube/v3/search?" +
    new URLSearchParams({
      part: "snippet",
      q: "bmx skate news",
      maxResults: 5,
      type: "video",
      key: API_KEY
    })

  const res = await fetch(url)
  const data = await res.json()

  return data.items.map(item => ({
    id: item.id.videoId,
    type: "video",
    title: item.snippet.title,
    date: item.snippet.publishedAt,
    excerpt: item.snippet.description,
    cover: item.snippet.thumbnails.medium.url,
    source: "YouTube",
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    content: null
  }))
}

module.exports = { loadYoutubePosts }
