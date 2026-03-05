
// import { Link, useLocation } from "react-router-dom"

// function getYoutubeID(url) {
//   const regExp = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/
//   const match = url.match(regExp)
//   return match ? match[1] : null
// }
 
// export default function BlogCard({ post }) {
//   const location = useLocation()
//   return (
//     <article className="blog-card bg-white rounded-md shadow-md overflow-hidden mb-4">
//         <Link
//         to={`/blog/post/${post.id}`}
//         state={{ background: location }}
//       >
//       {/* Превью / Фото */}
//       {post.cover && (
//         <img 
//           src={post.cover} 
//           alt={post.title} 
//           className="w-full object-cover rounded-t-md"
//         />
//       )}

//       {/* Видео YouTube */}
//       {post.type === "video" && post.url && (
//         <iframe
//           className="w-full h-60 object-cover"
//           src={`https://www.youtube.com/embed/${getYoutubeID(post.url)}`}
//           title={post.title}
//           frameBorder="0"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//         ></iframe>
//       )}

//       {/* Видео Cloudinary */}
//       {post.video && (
//         <video controls className="w-full h-full object-contain">
//           <source src={post.video} type="video/mp4" />
//           Ваш браузер не поддерживает видео.
//         </video>
//       )}

//       {/* Контент */}
//       <div className="p-3">
//         <h2 className="font-bold text-lg mb-1">{post.title}</h2>
//         <time className="text-sm text-gray-500 block mb-2">{post.date}</time>
//         {post.excerpt && <p className="text-gray-700 text-sm">{post.excerpt}</p>}
//       </div>
      
//       </Link>
//     </article>
//   )
// }




import { Link, useLocation } from "react-router-dom"

function getYoutubeID(url = "") {
  const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export default function BlogCard({ post, index = 0 }) {
  const location = useLocation()
  const youtubeId = post.url ? getYoutubeID(post.url) : null

  return (
    <article
      className="blog-card bg-white rounded-md shadow-md overflow-hidden mb-4"
      style={{
        opacity: 0,
        animation: `fadeSlideUp 0.5s ease forwards`,
        animationDelay: `${Math.min(index * 80, 400)}ms`,
      }}
    >
      <Link to={`/blog/post/${post.id}`} state={{ background: location }}>

        {/* YouTube embed — для ЛЮБОГО типа поста */}
        {youtubeId && (
          <iframe
            className="w-full h-60"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={post.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* Обложка — только если нет YouTube */}
        {!youtubeId && post.cover && (
          <img
            src={post.cover}
            alt={post.title}
            className="w-full object-cover rounded-t-md"
            loading="lazy"
          />
        )}

        {/* Видео Cloudinary */}
        {post.video && (
          <video controls className="w-full object-contain">
            <source src={post.video} type="video/mp4" />
          </video>
        )}

        <div className="p-3">
          <h2 className="font-bold text-lg mb-1">{post.title}</h2>
          <time className="text-sm text-gray-500 block mb-2">{post.date}</time>
          {post.excerpt && <p className="text-gray-700 text-sm">{post.excerpt}</p>}
        </div>

      </Link>
    </article>
  )
}