
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

export default function BlogCard({ post, index = 0, view = "grid" }) {
  const location = useLocation()
  const youtubeId = post.url ? getYoutubeID(post.url) : null

  if (view === "list") {
    return (
      <article
        style={{
          opacity: 0,
          animation: `fadeSlideUp 0.45s ease forwards`,
          animationDelay: `${Math.min(index * 60, 300)}ms`,
        }}
        className="border-b border-black/15 pb-5 mb-5"
      >
        <Link to={`/blog/post/${post.id}`} state={{ background: location }} className="flex gap-5 group">
          <div className="w-32 h-24 flex-shrink-0 overflow-hidden bg-gray-100">
            {youtubeId ? (
              <div className="relative w-full h-full">
                <img src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-8 h-8 bg-red-600 flex items-center justify-center">
                    <span className="text-white text-sm ml-0.5">▶</span>
                  </div>
                </div>
              </div>
            ) : post.cover ? (
              <img src={post.cover} alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            ) : (
              <div className="w-full h-full bg-black/5 flex items-center justify-center text-3xl text-black/15">✦</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <time className="text-[10px] font-mono tracking-widest text-black/35 uppercase">{post.date}</time>
              {post.tags?.[0] && (
                <span className="text-[10px] font-black tracking-widest uppercase text-black/50 border-l border-black/20 pl-2">#{post.tags[0]}</span>
              )}
            </div>
            <h2 className="font-['Playfair_Display'] font-bold text-base leading-tight group-hover:underline decoration-1 underline-offset-2 line-clamp-2">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-xs text-black/50 mt-1.5 line-clamp-2 font-['EB_Garamond'] leading-relaxed">{post.excerpt}</p>
            )}
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article
      style={{
        opacity: 0,
        animation: `fadeSlideUp 0.45s ease forwards`,
        animationDelay: `${Math.min(index * 80, 400)}ms`,
      }}
      className="border border-black/15 bg-white mb-5 group overflow-hidden"
    >
      <Link to={`/blog/post/${post.id}`} state={{ background: location }}>
        {youtubeId ? (
          <div className="relative w-full h-48 overflow-hidden bg-black">
            <img src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} alt={post.title}
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                <span className="text-white text-xl ml-1">▶</span>
              </div>
            </div>
          </div>
        ) : post.cover ? (
          <div className="w-full h-48 overflow-hidden">
            <img src={post.cover} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          </div>
        ) : post.video ? (
          <div className="w-full h-48 bg-black flex items-center justify-center">
            <span className="text-white text-5xl opacity-50">▶</span>
          </div>
        ) : null}

        <div className="p-4 border-t border-black/10">
          <div className="flex items-center gap-2 mb-2">
            <time className="text-[10px] font-mono tracking-widest uppercase text-black/35">{post.date}</time>
            {post.tags?.slice(0, 2).map(t => (
              <span key={t} className="text-[10px] font-black tracking-widest uppercase text-black/45 border-l border-black/20 pl-2">#{t}</span>
            ))}
          </div>
          <h2 className="font-['Playfair_Display'] font-bold text-lg leading-snug group-hover:underline decoration-1 underline-offset-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-2 text-sm text-black/55 font-['EB_Garamond'] leading-relaxed line-clamp-3">{post.excerpt}</p>
          )}
          <div className="mt-3 pt-3 border-t border-dashed border-black/15 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-black/25">{post.source || "telegram"}</span>
            <span className="text-xs font-black tracking-widest text-black group-hover:translate-x-1 transition-transform inline-block">READ →</span>
          </div>
        </div>
      </Link>
    </article>
  )
}


// import { Link, useLocation } from "react-router-dom"

// function getYoutubeID(url = "") {
//   const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
//   return match ? match[1] : null
// }

// export default function BlogCard({ post, index = 0 }) {
//   const location = useLocation()
//   const youtubeId = post.url ? getYoutubeID(post.url) : null

//   return (
//     <article
//       className="blog-card bg-white rounded-md shadow-md overflow-hidden mb-4"
//       style={{
//         opacity: 0,
//         animation: `fadeSlideUp 0.5s ease forwards`,
//         animationDelay: `${Math.min(index * 80, 400)}ms`,
//       }}
//     >
//       <Link to={`/blog/post/${post.id}`} state={{ background: location }}>

//         {/* YouTube embed — для ЛЮБОГО типа поста */}
//         {youtubeId && (
//           <iframe
//             className="w-full h-60"
//             src={`https://www.youtube.com/embed/${youtubeId}`}
//             title={post.title}
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           />
//         )}

//         {/* Обложка — только если нет YouTube */}
//         {!youtubeId && post.cover && (
//           <img
//             src={post.cover}
//             alt={post.title}
//             className="w-full object-cover rounded-t-md"
//             loading="lazy"
//           />
//         )}

//         {/* Видео Cloudinary */}
//         {post.video && (
//           <video controls className="w-full object-contain">
//             <source src={post.video} type="video/mp4" />
//           </video>
//         )}

//         <div className="p-3">
//           <h2 className="font-bold text-lg mb-1">{post.title}</h2>
//           <time className="text-sm text-gray-500 block mb-2">{post.date}</time>
//           {post.excerpt && <p className="text-gray-700 text-sm">{post.excerpt}</p>}
//         </div>

//       </Link>
//     </article>
//   )
// }