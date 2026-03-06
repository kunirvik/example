

// import { useParams, useNavigate } from "react-router-dom"
// import { useEffect, useState, useCallback } from "react"

// // ─── URL helpers ────────────────────────────────────────────────────────────

// function getYoutubeID(url) {
//   const match = url?.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
//   return match ? match[1] : null
// }

// function getRumbleID(url) {
//   if (!url) return null
//   const match = url.match(/rumble\.com\/(?:embed\/)?(v[a-z0-9]+)/i)
//   return match ? match[1] : null
// }

// /**
//  * Detects the media type of a URL.
//  * Returns: "youtube" | "rumble" | "mp4" | "image" | null
//  */
// function detectType(url) {
//   if (!url) return null
//   if (getYoutubeID(url)) return "youtube"
//   if (getRumbleID(url)) return "rumble"
//   if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return "mp4"
//   if (/\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/i.test(url)) return "image"
//   return null
// }

// /**
//  * Builds a flat ordered list of media items from a post object.
//  * Priority: cover → photos[] → video (mp4) → url → videos[]
//  */
// function buildMediaList(post) {
//   const items = []

//   const push = (url, forcedType) => {
//     const type = forcedType ?? detectType(url)
//     if (type) items.push({ url, type })
//   }

//   if (post.cover)            push(post.cover, "image")
//   post.photos?.forEach(u => push(u, "image"))
//   if (post.video)            push(post.video, "mp4")
//   if (post.url)              push(post.url)
//   post.videos?.forEach(u => push(u))

//   return items
// }

// // ─── Thumbnail strip item ────────────────────────────────────────────────────

// function Thumb({ item, active, onClick, index }) {
//   const base =
//     `relative w-16 h-12 rounded-lg overflow-hidden cursor-pointer flex-shrink-0
//      border-2 transition-all duration-200 select-none
//      ${active
//        ? "border-white shadow-[0_0_0_3px_rgba(255,255,255,0.4)] scale-105"
//        : "border-transparent opacity-50 hover:opacity-90 hover:scale-105"}`

//   if (item.type === "image") {
//     return (
//       <button onClick={onClick} className={base} aria-label={`Media ${index + 1}`}>
//         <img src={item.url} alt="" className="w-full h-full object-cover" />
//       </button>
//     )
//   }

//   if (item.type === "youtube") {
//     const ytId = getYoutubeID(item.url)
//     return (
//       <button onClick={onClick} className={base} aria-label={`YouTube video ${index + 1}`}>
//         <img
//           src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
//           alt=""
//           className="w-full h-full object-cover"
//         />
//         {/* play badge */}
//         <span className="absolute inset-0 flex items-center justify-center">
//           <span className="bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-[10px]">▶</span>
//         </span>
//       </button>
//     )
//   }

//   if (item.type === "rumble") {
//     return (
//       <button
//         onClick={onClick}
//         className={`${base} bg-[#85c742] flex flex-col items-center justify-center gap-0.5`}
//         aria-label={`Rumble video ${index + 1}`}
//       >
//         <span className="text-white text-[10px] font-black leading-none">RUMBLE</span>
//         <span className="text-white text-[8px] leading-none">▶</span>
//       </button>
//     )
//   }

//   if (item.type === "mp4") {
//     return (
//       <button
//         onClick={onClick}
//         className={`${base} bg-gray-800 flex items-center justify-center`}
//         aria-label={`Video ${index + 1}`}
//       >
//         <span className="text-white text-xl">▶</span>
//       </button>
//     )
//   }

//   return null
// }

// // ─── Main media renderer ─────────────────────────────────────────────────────

// function MediaViewer({ item }) {
//   if (!item) return null

//   if (item.type === "image") {
//     return (
//       <img
//         src={item.url}
//         alt=""
//         className="w-full h-full object-contain"
//       />
//     )
//   }

//   if (item.type === "mp4") {
//     return (
//       <video key={item.url} controls className="w-full h-full object-contain">
//         <source src={item.url} type="video/mp4" />
//       </video>
//     )
//   }

//   if (item.type === "youtube") {
//     return (
//       <iframe
//         key={item.url}
//         className="w-full h-full"
//         src={`https://www.youtube.com/embed/${getYoutubeID(item.url)}`}
//         title="YouTube video"
//         frameBorder="0"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//       />
//     )
//   }

//   if (item.type === "rumble") {
//     return (
//       <iframe
//         key={item.url}
//         className="w-full h-full"
//         src={`https://rumble.com/embed/${getRumbleID(item.url)}/`}
//         title="Rumble video"
//         frameBorder="0"
//         allowFullScreen
//       />
//     )
//   }

//   return null
// }

// // ─── Modal ───────────────────────────────────────────────────────────────────

// export default function BlogPostModal() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const API_URL = import.meta.env.VITE_API_URL

//   const [post, setPost]           = useState(null)
//   const [show, setShow]           = useState(false)
//   const [mediaIndex, setMediaIndex] = useState(0)

//   // Lock body scroll
//   useEffect(() => {
//     document.body.style.overflow = "hidden"
//     return () => { document.body.style.overflow = "auto" }
//   }, [])

//   // Fade-in on mount
//   useEffect(() => { setTimeout(() => setShow(true), 10) }, [])

//   // Load post
//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await fetch(`${API_URL}/api/blog/${id}`)
//         if (!res.ok) throw new Error("Post not found")
//         setPost(await res.json())
//       } catch (err) {
//         console.error(err)
//       }
//     }
//     load()
//   }, [id])

//   // Keyboard navigation
//   const handleKey = useCallback((e) => {
//     if (!mediaList.length) return
//     if (e.key === "ArrowRight") setMediaIndex(i => (i + 1) % mediaList.length)
//     if (e.key === "ArrowLeft")  setMediaIndex(i => (i - 1 + mediaList.length) % mediaList.length)
//     if (e.key === "Escape") closeModal()
//   }, [post])

//   useEffect(() => {
//     window.addEventListener("keydown", handleKey)
//     return () => window.removeEventListener("keydown", handleKey)
//   }, [handleKey])

//   function closeModal() {
//     setShow(false)
//     setTimeout(() => navigate(-1), 200)
//   }

//   if (!post) return null

//   const mediaList  = buildMediaList(post)
//   const hasMany    = mediaList.length > 1
//   const current    = mediaList[mediaIndex] ?? null

//   const prev = () => setMediaIndex(i => (i - 1 + mediaList.length) % mediaList.length)
//   const next = () => setMediaIndex(i => (i + 1) % mediaList.length)

//   return (
//     <div
//       onClick={closeModal}
//       className={`fixed inset-0 z-50 flex items-center justify-center p-4
//         transition-all duration-300 backdrop-blur-lg
//         ${show ? "bg-black/40 opacity-100" : "bg-black/0 opacity-0"}`}
//     >
//       <div
//         onClick={e => e.stopPropagation()}
//  className={`bg-white w-full max-w-6xl h-full max-h-[95vh]
//   border-4 border-black
//   flex flex-col md:flex-row relative overflow-hidden
//   transition-all duration-300 ease-out
//   ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}

//       >
// <button
//   onClick={closeModal}
//   className="absolute top-4 right-4 z-20
//     font-futura font-black text-lg
//     border-2 border-black bg-white w-10 h-10
//     flex items-center justify-center
//     hover:bg-black hover:text-white transition"
// >
//   ✕
// </button>


//         {/* ── LEFT: media panel ── */}
//         <div className="md:w-1/2 w-full bg-black flex flex-col min-h-0">

//           {/* Main viewer */}
//           <div className="relative flex-1 flex items-center justify-center overflow-hidden">
//             <MediaViewer item={current} />

//             {/* Prev / Next arrows */}
//             {hasMany && (
//               <>
//                 <button
//                   onClick={prev}
//                   className="absolute left-2 top-1/2 -translate-y-1/2 z-10
//                     bg-black/50 hover:bg-black/80 text-white rounded-full
//                     w-10 h-10 text-2xl flex items-center justify-center
//                     transition-all hover:scale-110"
//                   aria-label="Previous"
//                 >
//                   ‹
//                 </button>
//                 <button
//                   onClick={next}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 z-10
//                     bg-black/50 hover:bg-black/80 text-white rounded-full
//                     w-10 h-10 text-2xl flex items-center justify-center
//                     transition-all hover:scale-110"
//                   aria-label="Next"
//                 >
//                   ›
//                 </button>

//                 {/* Counter badge */}
//                 <span className="absolute bottom-3 right-3 bg-black/60 text-white
//                   text-xs px-2 py-0.5 rounded-full">
//                   {mediaIndex + 1} / {mediaList.length}
//                 </span>
//               </>
//             )}
//           </div>

//           {/* Thumbnail strip */}
//           {hasMany && (
//             <div className="flex gap-2 px-4 py-3 bg-black/90 overflow-x-auto
//               scrollbar-thin scrollbar-thumb-white/20 flex-shrink-0">
//               {mediaList.map((item, i) => (
//                 <Thumb
//                   key={i}
//                   item={item}
//                   index={i}
//                   active={i === mediaIndex}
//                   onClick={() => setMediaIndex(i)}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ── RIGHT: text panel ── */}
//         <div className="md:w-1/2 w-full flex flex-col p-8 overflow-y-auto">
//           <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
//           <time className="text-sm text-gray-500 mb-6">{post.date}</time>
//           <div
//             className="prose max-w-none mb-6"
//             dangerouslySetInnerHTML={{ __html: post.content }}
//           />
//         </div>

//       </div>
//     </div>
//   )
// }

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import { usePostsContext } from "./BlogPage"

// ─── URL helpers ──────────────────────────────────────────────────────────────

function getYoutubeID(url) {
  const match = url?.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}
function getRumbleID(url) {
  const match = url?.match(/rumble\.com\/(?:embed\/)?(v[a-z0-9]+)/i)
  return match ? match[1] : null
}
function detectType(url) {
  if (!url) return null
  if (getYoutubeID(url)) return "youtube"
  if (getRumbleID(url)) return "rumble"
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return "mp4"
  if (/\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/i.test(url)) return "image"
  return null
}
function buildMediaList(post) {
  const items = []
  const push = (url, forcedType) => {
    const type = forcedType ?? detectType(url)
    if (type) items.push({ url, type })
  }
  if (post.cover)           push(post.cover, "image")
  post.photos?.forEach(u => push(u, "image"))
  if (post.video)           push(post.video, "mp4")
  if (post.url)             push(post.url)
  post.videos?.forEach(u => push(u))
  return items
}

// ─── Thumbnail strip ──────────────────────────────────────────────────────────

function Thumb({ item, active, onClick }) {
  const base = `relative w-12 h-9 overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all duration-200
    ${active ? "border-white scale-110" : "border-transparent opacity-40 hover:opacity-90 hover:scale-105"}`

  if (item.type === "image") return (
    <button onClick={onClick} className={base}>
      <img src={item.url} alt="" className="w-full h-full object-cover" />
    </button>
  )
  if (item.type === "youtube") return (
    <button onClick={onClick} className={base}>
      <img src={`https://img.youtube.com/vi/${getYoutubeID(item.url)}/mqdefault.jpg`}
        alt="" className="w-full h-full object-cover" />
      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
        <span className="bg-red-600 w-4 h-4 flex items-center justify-center text-white text-[8px]">▶</span>
      </span>
    </button>
  )
  return (
    <button onClick={onClick} className={`${base} bg-black/60 flex items-center justify-center`}>
      <span className="text-white text-sm">▶</span>
    </button>
  )
}

// ─── Media renderer ───────────────────────────────────────────────────────────

function MediaViewer({ item }) {
  if (!item) return null
  if (item.type === "image") return (
    <img src={item.url} alt="" className="w-full h-auto block" />
  )
  if (item.type === "mp4") return (
    <video key={item.url} controls className="w-full h-auto block">
      <source src={item.url} type="video/mp4" />
    </video>
  )
  if (item.type === "youtube") return (
    <div className="w-full relative" style={{ paddingBottom: "56.25%" }}>
      <iframe key={item.url} className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${getYoutubeID(item.url)}`}
        title="YouTube" frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen />
    </div>
  )
  if (item.type === "rumble") return (
    <div className="w-full relative" style={{ paddingBottom: "56.25%" }}>
      <iframe key={item.url} className="absolute inset-0 w-full h-full"
        src={`https://rumble.com/embed/${getRumbleID(item.url)}/`}
        title="Rumble" frameBorder="0" allowFullScreen />
    </div>
  )
  return null
}

// ─── Mini card for bottom strip ───────────────────────────────────────────────

function MiniCard({ post, active, onClick }) {
  const youtubeId = post.url ? getYoutubeID(post.url) : null
  const thumb = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
    : post.cover || null

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-28 text-left transition-all duration-250 cursor-pointer group
        ${active ? "opacity-100" : "opacity-45 hover:opacity-85"}`}
      style={{ transform: active ? "scale(1.07)" : "scale(1)", transition: "all 0.2s ease" }}
    >
      <div className={`w-full h-16 overflow-hidden mb-1.5 border-2 transition-all
        ${active ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.3)]" : "border-transparent"}`}>
        {thumb ? (
          <img src={thumb} alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/25 text-xl">✦</div>
        )}
      </div>
      <p className="text-white text-[10px] font-['EB_Garamond'] leading-tight line-clamp-2 px-0.5">
        {post.title}
      </p>
      <time className="text-white/35 text-[9px] font-mono tracking-wide px-0.5 mt-0.5 block">{post.date}</time>
    </button>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function BlogPostModal() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const API_URL  = import.meta.env.VITE_API_URL

  const allPosts = usePostsContext()

  const [post, setPost]             = useState(null)
  const [show, setShow]             = useState(false)
  const [mediaIndex, setMediaIndex] = useState(0)
  const [contentIn, setContentIn]   = useState(false)

  const postIndex  = allPosts.findIndex(p => p.id === id)
  const prevPost   = postIndex > 0 ? allPosts[postIndex - 1] : null
  const nextPost   = postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null

  // Show ~7 neighbours centred on current post
  const start      = Math.max(0, postIndex - 3)
  const stripPosts = allPosts.slice(start, start + 8)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "auto" }
  }, [])

  // Entrance — backdrop first, card slightly after
  useEffect(() => {
    setTimeout(() => setShow(true), 10)
    setTimeout(() => setContentIn(true), 200)
  }, [])

  useEffect(() => {
    setMediaIndex(0)
    setContentIn(false)
    fetch(`${API_URL}/api/blog/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setPost(data)
        setTimeout(() => setContentIn(true), 80)
      })
      .catch(console.error)
  }, [id])

  const mediaList = post ? buildMediaList(post) : []
  const hasMany   = mediaList.length > 1
  const current   = mediaList[mediaIndex] ?? null

  const goTo = useCallback((targetId) => {
    navigate(`/blog/post/${targetId}`, { replace: true })
  }, [navigate])

  const handleKey = useCallback((e) => {
    if (e.key === "Escape")      return closeModal()
    if (e.key === "ArrowLeft"  && prevPost) goTo(prevPost.id)
    if (e.key === "ArrowRight" && nextPost) goTo(nextPost.id)
    if (e.key === "ArrowUp"    && hasMany)  setMediaIndex(i => (i - 1 + mediaList.length) % mediaList.length)
    if (e.key === "ArrowDown"  && hasMany)  setMediaIndex(i => (i + 1) % mediaList.length)
  }, [prevPost, nextPost, hasMany, mediaList.length])

  useEffect(() => {
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleKey])

  function closeModal() {
    setShow(false)
    setTimeout(() => navigate(-1), 260)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        @keyframes bgIn    { from{opacity:0} to{opacity:1} }
        @keyframes cardIn  { from{opacity:0;transform:translateY(36px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes stripIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        .anim-bg    { animation: bgIn    0.28s ease forwards; }
        .anim-card  { animation: cardIn  0.38s cubic-bezier(.22,.68,0,1.15) 0.06s both; }
        .anim-content { animation: fadeUp 0.3s ease 0.18s both; }
        .anim-strip { animation: stripIn 0.35s ease 0.32s both; }

        .modal-prose p  { margin-bottom: 0.85em; }
        .modal-prose a  { text-decoration: underline; }
        .modal-prose h2 { font-family:'Playfair Display',serif; font-weight:700; margin:1em 0 0.4em; }

        .mini-strip { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent; }
        .mini-strip::-webkit-scrollbar { height: 3px; }
        .mini-strip::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius:2px; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={closeModal}
        className={`anim-bg fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 p-3 md:p-5
          transition-opacity duration-260 ${show ? "opacity-100" : "opacity-0"}`}
        style={{ backdropFilter: "blur(16px)", backgroundColor: "rgba(15,13,10,0.5)" }}
      >

        {/* Card */}
        <div
          onClick={e => e.stopPropagation()}
          className="anim-card bg-[#f8f5ef] w-full max-w-5xl border-4 border-black shadow-2xl overflow-hidden relative"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        >
          <div className="flex flex-col md:flex-row" style={{ maxHeight: "calc(100vh - 160px)" }}>

            {/* ── LEFT: media ── */}
            {mediaList.length > 0 && (
              <div className="md:w-[46%] w-full bg-black flex flex-col flex-shrink-0 min-h-0">

                {/* Scrollable media area — natural height */}
                <div className="relative flex-1 overflow-y-auto min-h-0">
                  <div className={contentIn ? "anim-content" : "opacity-0"}>
                    <MediaViewer item={current} />
                  </div>

                  {hasMany && (
                    <>
                      <button onClick={() => setMediaIndex(i => (i - 1 + mediaList.length) % mediaList.length)}
                        className="absolute left-2 top-2 z-10 bg-black/60 hover:bg-black text-white w-7 h-7 flex items-center justify-center text-lg transition-all hover:scale-110">↑</button>
                      <button onClick={() => setMediaIndex(i => (i + 1) % mediaList.length)}
                        className="absolute right-2 top-2 z-10 bg-black/60 hover:bg-black text-white w-7 h-7 flex items-center justify-center text-lg transition-all hover:scale-110">↓</button>
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] px-2 py-0.5 font-mono tracking-widest">
                        {mediaIndex + 1} / {mediaList.length}
                      </span>
                    </>
                  )}
                </div>

                {/* Media thumbnails */}
                {hasMany && (
                  <div className="flex gap-2 px-3 py-2 bg-black/90 overflow-x-auto flex-shrink-0">
                    {mediaList.map((item, i) => (
                      <Thumb key={i} item={item} active={i === mediaIndex} onClick={() => setMediaIndex(i)} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── RIGHT: text ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

              {/* Close */}
              <button onClick={closeModal}
                className="absolute top-0 right-0 z-20 w-10 h-10 bg-black text-white
                  font-black flex items-center justify-center hover:bg-red-600 transition-colors">✕</button>

              {/* Post header */}
              <div className={`px-6 pt-7 pb-4 border-b-2 border-black flex-shrink-0 ${contentIn ? "anim-content" : "opacity-0"}`}>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <time className="font-mono text-[10px] tracking-widest uppercase text-black/40">{post?.date}</time>
                  {post?.tags?.map(t => (
                    <span key={t} className="font-black text-[10px] tracking-widest uppercase text-black/45 border-l border-black/20 pl-2">#{t}</span>
                  ))}
                </div>
                <div className="w-full border-t border-black/15 mb-3" />
                <h1 className="font-['Playfair_Display'] font-black text-xl md:text-2xl leading-tight pr-10">
                  {post?.title}
                </h1>
                {post?.excerpt && (
                  <p className="font-['EB_Garamond'] italic text-sm text-black/55 mt-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>

              {/* Body — independently scrollable */}
              <div className={`px-6 py-4 overflow-y-auto flex-1 ${contentIn ? "anim-content" : "opacity-0"}`}>
                {post?.content ? (
                  <div
                    className="modal-prose font-['EB_Garamond'] text-[15px] leading-relaxed text-black/80"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : (
                  <p className="font-['EB_Garamond'] italic text-black/25 text-sm">— no body text —</p>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-black/12 flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {prevPost && (
                    <button onClick={() => goTo(prevPost.id)}
                      className="text-[10px] font-black tracking-widest uppercase text-black/50 hover:text-black transition-colors flex items-center gap-1">
                      ‹ prev
                    </button>
                  )}
                  {nextPost && (
                    <button onClick={() => goTo(nextPost.id)}
                      className="text-[10px] font-black tracking-widest uppercase text-black/50 hover:text-black transition-colors flex items-center gap-1">
                      next ›
                    </button>
                  )}
                </div>
                <button onClick={closeModal}
                  className="font-black text-[10px] tracking-widest uppercase border border-black px-3 py-1.5
                    hover:bg-black hover:text-white transition-colors">← BACK</button>
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom strip ── */}
        {stripPosts.length > 1 && (
          <div
            className="anim-strip w-full max-w-5xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="mini-strip flex gap-4 overflow-x-auto pb-1">
              {stripPosts.map(p => (
                <MiniCard
                  key={p.id}
                  post={p}
                  active={p.id === id}
                  onClick={() => goTo(p.id)}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}