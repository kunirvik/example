import { useEffect, useState } from "react"
import { loadCompanyPosts } from "../loadCompanyPosts"
import BlogFeed from "./BlogFeed"

export default function BlogPage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    loadCompanyPosts().then(posts => {
      const sorted = posts.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
      setPosts(sorted)
    })
  }, [])

  return (
    <section>
      <h1 className="text-[#757575]">Блог</h1>
      <BlogFeed posts={posts} />
    </section>
  )
}
