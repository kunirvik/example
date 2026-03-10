
// import BlogCard from "./BlogCard"
// import Masonry from "react-masonry-css"

// export default function BlogFeed({ posts }) {
//   const breakpointColumnsObj = {
//     default: 3,
//     1024: 2,
//     640: 1
//   }

//   return (
//     <Masonry
//       breakpointCols={breakpointColumnsObj}
//       className="my-masonry-grid"
//       columnClassName="my-masonry-grid_column"
//     >
//       {posts.map(post => (
//         <BlogCard key={post.id} post={post} />
//       ))}
//     </Masonry>
//   )
// }
// import BlogCard from "./BlogCard"

// // 3-column masonry-style grid (CSS columns, no library needed)
// export default function BlogFeed({ posts }) {
//   if (!posts.length) return null

//   return (
//     <div
//       className="grid gap-1"
//       style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
//     >
//       {posts.map((post, index) => (
//         <BlogCard key={post.id} post={post} index={index} />
//       ))}
//     </div>
//   )
// }
import BlogCard from "./BlogCard"

export default function BlogFeed({ posts }) {
  if (!posts.length) return null

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  )
}
// import BlogCard from "./BlogCard"
// import Masonry from "react-masonry-css"

// export default function BlogFeed({ posts }) {
//   const breakpointColumnsObj = {
//     default: 3,
//     1024: 2,
//     640: 1,
//   }

//   return (
//     <Masonry
//       breakpointCols={breakpointColumnsObj}
//       className="my-masonry-grid"
//       columnClassName="my-masonry-grid_column"
//     >
//       {posts.map((post, index) => (
//         <BlogCard key={post.id} post={post} index={index} />
//       ))}
//     </Masonry>
//   )
// }

