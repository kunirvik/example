

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

// ─── URL helpers ──────────────────────────────────────────────────────────────

function getYoutubeID(url = "") {
  const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

function getRumbleID(url = "") {
  const match = url.match(/rumble\.com\/(?:embed\/)?(v[a-z0-9]+)/i)
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

// ─── Thumbnail ────────────────────────────────────────────────────────────────

function Thumb({ item, active, onClick, index }) {
  const base = `relative w-14 h-10 overflow-hidden cursor-pointer flex-shrink-0
    border-2 transition-all duration-200 select-none
    ${active
      ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)] scale-105"
      : "border-transparent opacity-40 hover:opacity-80 hover:scale-105"}`

  const ytId = item.type === "youtube" ? getYoutubeID(item.url) : null

  if (item.type === "image") {
    return (
      <button onClick={onClick} className={base} aria-label={`Media ${index + 1}`}>
        <img src={item.url} alt="" className="w-full h-full object-cover" />
      </button>
    )
  }
  if (item.type === "youtube") {
    return (
      <button onClick={onClick} className={base} aria-label={`YouTube ${index + 1}`}>
        <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt=""
          className="w-full h-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="bg-red-600 w-5 h-5 flex items-center justify-center text-white text-[9px]">▶</span>
        </span>
      </button>
    )
  }
  if (item.type === "rumble") {
    return (
      <button onClick={onClick} className={`${base} bg-[#85c742] flex flex-col items-center justify-center`}>
        <span className="text-white text-[8px] font-black">RUMBLE</span>
        <span className="text-white text-[7px]">▶</span>
      </button>
    )
  }
  return (
    <button onClick={onClick} className={`${base} bg-black flex items-center justify-center`}>
      <span className="text-white text-lg">▶</span>
    </button>
  )
}

// ─── Media renderer ───────────────────────────────────────────────────────────

function MediaViewer({ item }) {
  if (!item) return null
  if (item.type === "image") return <img src={item.url} alt="" className="w-full h-full object-contain" />
  if (item.type === "mp4") return (
    <video key={item.url} controls className="w-full h-full object-contain">
      <source src={item.url} type="video/mp4" />
    </video>
  )
  if (item.type === "youtube") return (
    <iframe key={item.url} className="w-full h-full"
      src={`https://www.youtube.com/embed/${getYoutubeID(item.url)}`}
      title="YouTube" frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen />
  )
  if (item.type === "rumble") return (
    <iframe key={item.url} className="w-full h-full"
      src={`https://rumble.com/embed/${getRumbleID(item.url)}/`}
      title="Rumble" frameBorder="0" allowFullScreen />
  )
  return null
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function BlogPostModal() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const API_URL  = import.meta.env.VITE_API_URL

  const [post, setPost]               = useState(null)
  const [allPosts, setAllPosts]       = useState([])
  const [show, setShow]               = useState(false)
  const [mediaIndex, setMediaIndex]   = useState(0)

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "auto" }
  }, [])

  // Fade-in
  useEffect(() => { setTimeout(() => setShow(true), 10) }, [])

  // Load current post
  useEffect(() => {
    setMediaIndex(0)
    fetch(`${API_URL}/api/blog/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setPost)
      .catch(console.error)
  }, [id])

  // Load all posts for prev/next navigation (sorted newest first)
  useEffect(() => {
    fetch(`${API_URL}/api/blog`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))
        setAllPosts(sorted)
      })
      .catch(console.error)
  }, [])

  const mediaList = post ? buildMediaList(post) : []
  const hasMany   = mediaList.length > 1
  const current   = mediaList[mediaIndex] ?? null

  // Prev / next post in the feed
  const currentIndex = allPosts.findIndex(p => String(p.id) === String(id))
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  function goToPost(targetPost) {
    navigate(`/blog/post/${targetPost.id}`, {
      // preserve the background so BlogPage keeps rendering behind
      state: { background: { pathname: "/blog" } }
    })
  }

  function closeModal() {
    setShow(false)
    setTimeout(() => navigate(-1), 220)
  }

  // Keyboard shortcuts
  const handleKey = useCallback((e) => {
    if (e.key === "Escape") { closeModal(); return }
    // Left/right arrow: navigate between posts if no media strip, else media
    if (hasMany) {
      if (e.key === "ArrowRight") setMediaIndex(i => (i + 1) % mediaList.length)
      if (e.key === "ArrowLeft")  setMediaIndex(i => (i - 1 + mediaList.length) % mediaList.length)
    } else {
      if (e.key === "ArrowRight" && nextPost) goToPost(nextPost)
      if (e.key === "ArrowLeft"  && prevPost) goToPost(prevPost)
    }
  }, [mediaList.length, hasMany, nextPost, prevPost])

  useEffect(() => {
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleKey])

  if (!post) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        .modal-prose p { margin-bottom: 1em; }
        .modal-prose a { text-decoration: underline; }
      `}</style>

      {/*
        BACKDROP — semi-transparent so the blog feed shows through.
        backdrop-blur gives a frosted-glass effect on the posts behind.
      */}
      <div
        onClick={closeModal}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4
          transition-all duration-300
          ${show ? "opacity-100" : "opacity-0"}`}
        style={{
          background: show
            ? "rgba(255,255,255,0.55)"
            : "rgba(255,255,255,0)",
          backdropFilter: show ? "blur(6px) saturate(0.8)" : "none",
          WebkitBackdropFilter: show ? "blur(6px) saturate(0.8)" : "none",
        }}
      >
        {/* ── Post navigation: PREV (left edge) ── */}
        {prevPost && (
          <button
            onClick={e => { e.stopPropagation(); goToPost(prevPost) }}
            title={prevPost.title}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20
              flex flex-col items-center gap-1 group"
          >
            <span className="w-10 h-10 bg-black/80 hover:bg-black text-white flex items-center justify-center
              text-2xl transition-all group-hover:scale-110">
              ‹
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase text-black/50
              max-w-[60px] text-center leading-tight hidden md:block line-clamp-2">
              {prevPost.title}
            </span>
          </button>
        )}

        {/* ── Post navigation: NEXT (right edge) ── */}
        {nextPost && (
          <button
            onClick={e => { e.stopPropagation(); goToPost(nextPost) }}
            title={nextPost.title}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20
              flex flex-col items-center gap-1 group"
          >
            <span className="w-10 h-10 bg-black/80 hover:bg-black text-white flex items-center justify-center
              text-2xl transition-all group-hover:scale-110">
              ›
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase text-black/50
              max-w-[60px] text-center leading-tight hidden md:block line-clamp-2">
              {nextPost.title}
            </span>
          </button>
        )}

        {/* ── Modal card ── */}
        <div
          onClick={e => e.stopPropagation()}
          className={`bg-[#f8f5ef] w-full max-w-5xl max-h-[92vh] flex flex-col md:flex-row
            relative overflow-hidden border-4 border-black shadow-2xl
            transition-all duration-300 ease-out
            ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          {/* Close */}
          <button
            onClick={closeModal}
            className="absolute top-0 right-0 z-20 w-10 h-10 bg-black text-white
              font-black text-base flex items-center justify-center
              hover:bg-red-600 transition-colors"
          >
            ✕
          </button>

          {/* Post counter */}
          {allPosts.length > 0 && currentIndex >= 0 && (
            <div className="absolute top-0 left-0 z-20 bg-black/70 text-white
              font-mono text-[9px] tracking-widest px-2 py-1 uppercase">
              {currentIndex + 1} / {allPosts.length}
            </div>
          )}

          {/* ── LEFT: media ── */}
          {mediaList.length > 0 && (
            <div className="md:w-1/2 w-full bg-black flex flex-col min-h-0 flex-shrink-0">
              <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[220px]">
                <MediaViewer item={current} />

                {hasMany && (
                  <>
                    <button onClick={() => setMediaIndex(i => (i - 1 + mediaList.length) % mediaList.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                        bg-black/60 hover:bg-black text-white w-9 h-9 flex items-center justify-center
                        text-2xl transition-all hover:scale-110">
                      ‹
                    </button>
                    <button onClick={() => setMediaIndex(i => (i + 1) % mediaList.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                        bg-black/60 hover:bg-black text-white w-9 h-9 flex items-center justify-center
                        text-2xl transition-all hover:scale-110">
                      ›
                    </button>
                    <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] px-2 py-0.5 font-mono tracking-widest">
                      {mediaIndex + 1} / {mediaList.length}
                    </span>
                  </>
                )}
              </div>

              {hasMany && (
                <div className="flex gap-2 px-3 py-2 bg-black/90 overflow-x-auto flex-shrink-0">
                  {mediaList.map((item, i) => (
                    <Thumb key={i} item={item} index={i} active={i === mediaIndex}
                      onClick={() => setMediaIndex(i)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── RIGHT: text ── */}
          <div className="flex-1 flex flex-col overflow-y-auto">

            {/* Newspaper header */}
            <div className="px-8 pt-10 pb-5 border-b-2 border-black">
              <div className="flex items-center gap-3 mb-3">
                <time className="font-mono text-[10px] tracking-widest uppercase text-black/45">{post.date}</time>
                {post.tags?.map(t => (
                  <span key={t} className="font-black text-[10px] tracking-widest uppercase text-black/50 border-l border-black/25 pl-3">
                    #{t}
                  </span>
                ))}
              </div>
              <div className="w-full border-t border-black/20 mb-3" />
              <h1 className="font-['Playfair_Display'] font-black text-3xl leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="font-['EB_Garamond'] italic text-base text-black/60 mt-2 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Body */}
            <div className="px-8 py-6 flex-1">
              {post.content ? (
                <div
                  className="modal-prose font-['EB_Garamond'] text-[15px] leading-relaxed text-black/80"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p className="font-['EB_Garamond'] italic text-black/30 text-sm">— no body text —</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-black/15 flex items-center justify-between gap-3 flex-wrap">
              <span className="font-mono text-[10px] tracking-widest uppercase text-black/30">
                {post.source || "telegram"} · {post.type || "post"}
              </span>

              {/* Prev/Next post buttons in footer too */}
              <div className="flex items-center gap-2">
                {prevPost && (
                  <button
                    onClick={() => goToPost(prevPost)}
                    className="font-black text-[11px] tracking-widest uppercase text-black
                      border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
                  >
                    ← PREV
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="font-black text-[11px] tracking-widest uppercase text-black
                    border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
                >
                  ✕ CLOSE
                </button>
                {nextPost && (
                  <button
                    onClick={() => goToPost(nextPost)}
                    className="font-black text-[11px] tracking-widest uppercase bg-black text-white
                      border border-black px-3 py-1.5 hover:bg-gray-800 transition-colors"
                  >
                    NEXT →
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

// import { useParams, useNavigate } from "react-router-dom"
// import { useEffect, useState, useCallback } from "react"

// // ─── URL helpers ─────────────────────────────────────────────────────────────

// function getYoutubeID(url) {
//   const match = url?.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
//   return match ? match[1] : null
// }
// function getRumbleID(url) {
//   if (!url) return null
//   const match = url.match(/rumble\.com\/(?:embed\/)?(v[a-z0-9]+)/i)
//   return match ? match[1] : null
// }
// function detectType(url) {
//   if (!url) return null
//   if (getYoutubeID(url)) return "youtube"
//   if (getRumbleID(url)) return "rumble"
//   if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return "mp4"
//   if (/\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/i.test(url)) return "image"
//   return null
// }
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

// // ─── Thumbnail ───────────────────────────────────────────────────────────────

// function Thumb({ item, active, onClick, index }) {
//   const base = `relative w-14 h-10 overflow-hidden cursor-pointer flex-shrink-0
//     border-2 transition-all duration-200 select-none
//     ${active ? "border-white scale-105" : "border-transparent opacity-40 hover:opacity-80 hover:scale-105"}`

//   if (item.type === "image") {
//     return (
//       <button onClick={onClick} className={base}>
//         <img src={item.url} alt="" className="w-full h-full object-cover" />
//       </button>
//     )
//   }
//   if (item.type === "youtube") {
//     return (
//       <button onClick={onClick} className={base}>
//         <img src={`https://img.youtube.com/vi/${getYoutubeID(item.url)}/mqdefault.jpg`}
//           alt="" className="w-full h-full object-cover" />
//         <span className="absolute inset-0 flex items-center justify-center">
//           <span className="bg-red-600 w-5 h-5 flex items-center justify-center text-white text-[9px]">▶</span>
//         </span>
//       </button>
//     )
//   }
//   if (item.type === "rumble") {
//     return (
//       <button onClick={onClick} className={`${base} bg-[#85c742] flex flex-col items-center justify-center`}>
//         <span className="text-white text-[8px] font-black">RUMBLE</span>
//         <span className="text-white text-[7px]">▶</span>
//       </button>
//     )
//   }
//   return (
//     <button onClick={onClick} className={`${base} bg-black flex items-center justify-center`}>
//       <span className="text-white text-lg">▶</span>
//     </button>
//   )
// }

// // ─── Media renderer ───────────────────────────────────────────────────────────

// function MediaViewer({ item }) {
//   if (!item) return null
//   if (item.type === "image") return <img src={item.url} alt="" className="w-full h-full object-contain" />
//   if (item.type === "mp4") return (
//     <video key={item.url} controls className="w-full h-full object-contain">
//       <source src={item.url} type="video/mp4" />
//     </video>
//   )
//   if (item.type === "youtube") return (
//     <iframe key={item.url} className="w-full h-full"
//       src={`https://www.youtube.com/embed/${getYoutubeID(item.url)}`}
//       title="YouTube" frameBorder="0"
//       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//       allowFullScreen />
//   )
//   if (item.type === "rumble") return (
//     <iframe key={item.url} className="w-full h-full"
//       src={`https://rumble.com/embed/${getRumbleID(item.url)}/`}
//       title="Rumble" frameBorder="0" allowFullScreen />
//   )
//   return null
// }

// // ─── Modal ────────────────────────────────────────────────────────────────────

// export default function BlogPostModal() {
//   const { id }     = useParams()
//   const navigate   = useNavigate()
//   const API_URL    = import.meta.env.VITE_API_URL

//   const [post, setPost]         = useState(null)
//   const [show, setShow]         = useState(false)
//   const [mediaIndex, setMediaIndex] = useState(0)

//   useEffect(() => {
//     document.body.style.overflow = "hidden"
//     return () => { document.body.style.overflow = "auto" }
//   }, [])

//   useEffect(() => { setTimeout(() => setShow(true), 10) }, [])

//   useEffect(() => {
//     fetch(`${API_URL}/api/blog/${id}`)
//       .then(r => r.ok ? r.json() : Promise.reject())
//       .then(setPost)
//       .catch(console.error)
//   }, [id])

//   const mediaList = post ? buildMediaList(post) : []

//   const handleKey = useCallback((e) => {
//     if (!mediaList.length) return
//     if (e.key === "ArrowRight") setMediaIndex(i => (i + 1) % mediaList.length)
//     if (e.key === "ArrowLeft")  setMediaIndex(i => (i - 1 + mediaList.length) % mediaList.length)
//     if (e.key === "Escape")     closeModal()
//   }, [mediaList.length])

//   useEffect(() => {
//     window.addEventListener("keydown", handleKey)
//     return () => window.removeEventListener("keydown", handleKey)
//   }, [handleKey])

//   function closeModal() {
//     setShow(false)
//     setTimeout(() => navigate(-1), 220)
//   }

//   if (!post) return null

//   const hasMany = mediaList.length > 1
//   const current = mediaList[mediaIndex] ?? null
//   const prev = () => setMediaIndex(i => (i - 1 + mediaList.length) % mediaList.length)
//   const next = () => setMediaIndex(i => (i + 1) % mediaList.length)

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
//         .modal-prose p { margin-bottom: 1em; }
//         .modal-prose a { text-decoration: underline; }
//       `}</style>

//       {/* Backdrop */}
//       <div
//         onClick={closeModal}
//         className={`fixed inset-0 z-50 flex items-center justify-center p-4
//           transition-all duration-300 backdrop-blur-sm
//           ${show ? "bg-black/60 opacity-100" : "bg-black/0 opacity-0"}`}
//       >
//         <div
//           onClick={e => e.stopPropagation()}
//           className={`bg-[#f8f5ef] w-full max-w-6xl max-h-[95vh] flex flex-col md:flex-row
//             relative overflow-hidden border-4 border-black
//             transition-all duration-300 ease-out
//             ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
//         >

//           {/* Close */}
//           <button
//             onClick={closeModal}
//             className="absolute top-0 right-0 z-20 w-10 h-10 bg-black text-white
//               font-black text-base flex items-center justify-center
//               hover:bg-red-600 transition-colors"
//           >
//             ✕
//           </button>

//           {/* ── LEFT: media ── */}
//           {mediaList.length > 0 && (
//             <div className="md:w-1/2 w-full bg-black flex flex-col min-h-0 flex-shrink-0">
//               <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[220px]">
//                 <MediaViewer item={current} />

//                 {hasMany && (
//                   <>
//                     <button onClick={prev}
//                       className="absolute left-2 top-1/2 -translate-y-1/2 z-10
//                         bg-black/60 hover:bg-black text-white w-9 h-9 flex items-center justify-center
//                         text-2xl transition-all hover:scale-110">
//                       ‹
//                     </button>
//                     <button onClick={next}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 z-10
//                         bg-black/60 hover:bg-black text-white w-9 h-9 flex items-center justify-center
//                         text-2xl transition-all hover:scale-110">
//                       ›
//                     </button>
//                     <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] px-2 py-0.5 font-mono tracking-widest">
//                       {mediaIndex + 1} / {mediaList.length}
//                     </span>
//                   </>
//                 )}
//               </div>

//               {hasMany && (
//                 <div className="flex gap-2 px-3 py-2 bg-black/90 overflow-x-auto flex-shrink-0">
//                   {mediaList.map((item, i) => (
//                     <Thumb key={i} item={item} index={i} active={i === mediaIndex} onClick={() => setMediaIndex(i)} />
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── RIGHT: text ── */}
//           <div className="flex-1 flex flex-col overflow-y-auto">

//             {/* Newspaper header */}
//             <div className="px-8 pt-10 pb-5 border-b-2 border-black">
//               <div className="flex items-center gap-3 mb-3">
//                 <time className="font-mono text-[10px] tracking-widest uppercase text-black/45">{post.date}</time>
//                 {post.tags?.map(t => (
//                   <span key={t} className="font-black text-[10px] tracking-widest uppercase text-black/50 border-l border-black/25 pl-3">#{t}</span>
//                 ))}
//               </div>

//               {/* Rule above title */}
//               <div className="w-full border-t border-black/20 mb-3" />

//               <h1 className="font-['Playfair_Display'] font-black text-3xl leading-tight">
//                 {post.title}
//               </h1>

//               {post.excerpt && (
//                 <p className="font-['EB_Garamond'] italic text-base text-black/60 mt-2 leading-relaxed">
//                   {post.excerpt}
//                 </p>
//               )}
//             </div>

//             {/* Body */}
//             <div className="px-8 py-6 flex-1">
//               {post.content ? (
//                 <div
//                   className="modal-prose font-['EB_Garamond'] text-[15px] leading-relaxed text-black/80 columns-1"
//                   dangerouslySetInnerHTML={{ __html: post.content }}
//                 />
//               ) : (
//                 <p className="font-['EB_Garamond'] italic text-black/30 text-sm">— no body text —</p>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="px-8 py-4 border-t border-black/15 flex items-center justify-between">
//               <span className="font-mono text-[10px] tracking-widest uppercase text-black/30">
//                 {post.source || "telegram"} · {post.type || "post"}
//               </span>
//               <button
//                 onClick={closeModal}
//                 className="font-black text-[11px] tracking-widest uppercase text-black
//                   border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
//               >
//                 ← BACK
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   )
// }