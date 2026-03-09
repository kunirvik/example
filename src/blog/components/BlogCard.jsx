
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

// ── Hero card (featured, first post) ─────────────────────────────────────────

export function HeroCard({ post }) {
  const location  = useLocation()
  const youtubeId = post.url ? getYoutubeID(post.url) : null
  const thumb     = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : post.cover || null

  return (
    <Link
      to={`/blog/post/${post.id}`}
      state={{ background: location }}
      className="group block relative overflow-hidden bg-[#111]"
      style={{ aspectRatio: "21/9" }}
    >
      {thumb ? (
        <img src={thumb} alt={post.title}
          className="absolute inset-0 w-full h-full object-cover brightness-55 group-hover:brightness-70 group-hover:scale-[1.02] transition-all duration-500"
          loading="eager" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
      )}

      {youtubeId && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#ff6b00] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-200">
            <span className="text-white text-2xl ml-1">▶</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

      {/* FEATURED label */}
      <div className="absolute top-0 left-0 bg-[#ff6b00] px-3 py-1.5">
        <span className="text-white text-[9px] font-black uppercase tracking-[0.2em]">Featured</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 md:max-w-3xl">
        <div className="flex gap-2 mb-3 flex-wrap">
          {post.tags?.slice(0, 3).map(t => (
            <span key={t} className="bg-[#ff6b00] text-white text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1">
              {t}
            </span>
          ))}
        </div>
        <h2 className="text-white font-['Barlow_Condensed'] font-black text-2xl md:text-[2.6rem] leading-[1.05] uppercase group-hover:text-[#ff6b00] transition-colors duration-150">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-white/50 text-sm mt-3 line-clamp-2 font-['Barlow'] leading-relaxed hidden md:block">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 mt-3 border-t border-white/10 pt-3">
          <time className="text-white/35 text-[11px] font-['Barlow'] uppercase tracking-wide">{post.date}</time>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span className="text-white/35 text-[11px] font-['Barlow'] uppercase tracking-wide">{post.source || "telegram"}</span>
        </div>
      </div>
    </Link>
  )
}

// ── Standard grid card ────────────────────────────────────────────────────────

export default function BlogCard({ post, index = 0 }) {
  const location  = useLocation()
  const youtubeId = post.url ? getYoutubeID(post.url) : null
  const thumb     = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : post.cover || null

  return (
    <article
      className="group bg-[#1a1a1a] border border-white/[0.06] hover:border-[#ff6b00]/50 transition-colors duration-200 overflow-hidden"
      style={{
        opacity: 0,
        animation: `pbFadeIn 0.3s ease forwards`,
        animationDelay: `${Math.min(index * 50, 400)}ms`,
      }}
    >
      <Link to={`/blog/post/${post.id}`} state={{ background: location }} className="block">

        {/* Image */}
        <div className="relative overflow-hidden bg-[#0f0f0f]" style={{ aspectRatio: "16/9" }}>
          {thumb ? (
            <img src={thumb} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-400 brightness-85 group-hover:brightness-100"
              loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/8 text-5xl">{post.type === "video" ? "▶" : "✦"}</span>
            </div>
          )}

          {/* Video play button */}
          {youtubeId && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-[#ff6b00]/90 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#ff6b00] transition-all duration-200">
                <span className="text-white text-sm ml-0.5">▶</span>
              </div>
            </div>
          )}

          {/* Primary tag on thumbnail */}
          {post.tags?.[0] && (
            <div className="absolute top-0 left-0 bg-[#ff6b00] px-2 py-1">
              <span className="text-white text-[9px] font-black uppercase tracking-[0.15em]">{post.tags[0]}</span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="p-3 border-t border-white/5">
          <h2 className="font-['Barlow_Condensed'] font-bold text-white text-[15px] leading-tight uppercase group-hover:text-[#ff6b00] transition-colors duration-150 line-clamp-3">
            {post.title}
          </h2>
          <div className="flex items-center gap-2 mt-2.5">
            <time className="text-white/25 text-[10px] font-['Barlow'] uppercase tracking-wide">{post.date}</time>
            {post.source && (
              <>
                <span className="w-0.5 h-0.5 bg-white/15 rounded-full" />
                <span className="text-white/25 text-[10px] font-['Barlow'] uppercase tracking-wide">{post.source}</span>
              </>
            )}
          </div>
        </div>

      </Link>
    </article>
  )
}

// ── Compact sidebar card ──────────────────────────────────────────────────────

export function CompactCard({ post, index = 0 }) {
  const location  = useLocation()
  const youtubeId = post.url ? getYoutubeID(post.url) : null
  const thumb     = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
    : post.cover || null

  return (
    <article
      className="group border-b border-white/[0.05] last:border-0"
      style={{
        opacity: 0,
        animation: `pbFadeIn 0.3s ease forwards`,
        animationDelay: `${Math.min(index * 40, 280)}ms`,
      }}
    >
      <Link to={`/blog/post/${post.id}`} state={{ background: location }}
        className="flex gap-3 py-3 hover:bg-white/[0.025] transition-colors px-1">

        <div className="w-[72px] h-12 flex-shrink-0 overflow-hidden bg-[#111]">
          {thumb ? (
            <img src={thumb} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-75 group-hover:brightness-100" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10 text-xl">
              {post.type === "video" ? "▶" : "✦"}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {post.tags?.[0] && (
            <span className="text-[#ff6b00] text-[9px] font-black uppercase tracking-[0.15em] block mb-1">{post.tags[0]}</span>
          )}
          <h3 className="font-['Barlow_Condensed'] font-bold text-white/80 text-[13px] leading-tight uppercase group-hover:text-[#ff6b00] transition-colors duration-150 line-clamp-2">
            {post.title}
          </h3>
          <time className="text-white/25 text-[10px] font-['Barlow'] mt-1 block">{post.date}</time>
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