import BlogCard from "./BlogCard"

export default function BlogFeed({ posts }) {
  return (
    <div className="text-[#757575]">
      {posts.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}
