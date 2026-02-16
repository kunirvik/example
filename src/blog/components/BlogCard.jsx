export default function BlogCard({ post }) {
  return (
    <article className={`blog-card blog-card--${post.type}`}>
      <span className="blog-badge text-[#757575]">
        {post.type === "company" ? "НАШ ПРОЕКТ" : "НОВОСТЬ"}
      </span>

      <h2>{post.title}</h2>
      <time>{post.date}</time>

      {post.excerpt && <p>{post.excerpt}</p>}
    </article>
  )
}
