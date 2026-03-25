
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

import BlogCard from "./BlogCard"
 
export default function BlogFeed({ posts }) {
  if (!posts.length) return null
  return (
    <div className="divide-y divide-white/[0.08]">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  )
}
 
// import BlogCard from "./BlogCard"

// export default function BlogFeed({ posts }) {
//   if (!posts.length) return null
//   return (
//     <div className="divide-y divide-[#e8e8e8]">
//       {posts.map((post, index) => (
//         <BlogCard key={post.id} post={post} index={index} />
//       ))}
//     </div>
//   )
// }
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

