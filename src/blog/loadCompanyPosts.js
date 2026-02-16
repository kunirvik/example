import matter from "gray-matter"
import MarkdownIt from "markdown-it"

const md = new MarkdownIt()

export async function loadCompanyPosts() {
  // Vite позволяет так импортировать markdown
  const files = import.meta.glob("./content/*.md", {
    as: "raw"
  })

  const posts = []

  for (const path in files) {
    const raw = await files[path]()
    const { data, content } = matter(raw)

    posts.push({
      id: data.id,
      type: data.type,
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      cover: data.cover,
      excerpt: data.excerpt,
      content: md.render(content)
    })
  }

  return posts
}
