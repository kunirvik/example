
import BlogCard from "./BlogCard"
import Masonry from "react-masonry-css"

export default function BlogFeed({ posts }) {
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {posts.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </Masonry>
  )
}

