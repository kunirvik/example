

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

// import { useParams, useNavigate } from "react-router-dom"
// import { useEffect, useState, useCallback } from "react"
// import { usePostsContext } from "./BlogPage"

// // ─── URL helpers ──────────────────────────────────────────────────────────────

// function getYoutubeID(url) {
//   const match = url?.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
//   return match ? match[1] : null
// }
// function getRumbleID(url) {
//   const match = url?.match(/rumble\.com\/(?:embed\/)?(v[a-z0-9]+)/i)
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
//   if (post.cover)           push(post.cover, "image")
//   post.photos?.forEach(u => push(u, "image"))
//   if (post.video)           push(post.video, "mp4")
//   if (post.url)             push(post.url)
//   post.videos?.forEach(u => push(u))
//   return items
// }

// // ─── Thumbnail strip ──────────────────────────────────────────────────────────

// function Thumb({ item, active, onClick }) {
//   const base = `relative w-12 h-9 overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all duration-200
//     ${active ? "border-white scale-110" : "border-transparent opacity-40 hover:opacity-90 hover:scale-105"}`

//   if (item.type === "image") return (
//     <button onClick={onClick} className={base}>
//       <img src={item.url} alt="" className="w-full h-full object-cover" />
//     </button>
//   )
//   if (item.type === "youtube") return (
//     <button onClick={onClick} className={base}>
//       <img src={`https://img.youtube.com/vi/${getYoutubeID(item.url)}/mqdefault.jpg`}
//         alt="" className="w-full h-full object-cover" />
//       <span className="absolute inset-0 flex items-center justify-center bg-black/30">
//         <span className="bg-red-600 w-4 h-4 flex items-center justify-center text-white text-[8px]">▶</span>
//       </span>
//     </button>
//   )
//   return (
//     <button onClick={onClick} className={`${base} bg-black/60 flex items-center justify-center`}>
//       <span className="text-white text-sm">▶</span>
//     </button>
//   )
// }

// // ─── Media renderer ───────────────────────────────────────────────────────────

// function MediaViewer({ item }) {
//   if (!item) return null
//   if (item.type === "image") return (
//     <img src={item.url} alt="" className="w-full h-auto block" />
//   )
//   if (item.type === "mp4") return (
//     <video key={item.url} controls className="w-full h-auto block">
//       <source src={item.url} type="video/mp4" />
//     </video>
//   )
//   if (item.type === "youtube") return (
//     <div className="w-full relative" style={{ paddingBottom: "56.25%" }}>
//       <iframe key={item.url} className="absolute inset-0 w-full h-full"
//         src={`https://www.youtube.com/embed/${getYoutubeID(item.url)}`}
//         title="YouTube" frameBorder="0"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen />
//     </div>
//   )
//   if (item.type === "rumble") return (
//     <div className="w-full relative" style={{ paddingBottom: "56.25%" }}>
//       <iframe key={item.url} className="absolute inset-0 w-full h-full"
//         src={`https://rumble.com/embed/${getRumbleID(item.url)}/`}
//         title="Rumble" frameBorder="0" allowFullScreen />
//     </div>
//   )
//   return null
// }

// // ─── Mini card for bottom strip ───────────────────────────────────────────────

// function MiniCard({ post, active, onClick }) {
//   const youtubeId = post.url ? getYoutubeID(post.url) : null
//   const thumb = youtubeId
//     ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
//     : post.cover || null

//   return (
//     <button
//       onClick={onClick}
//       className={`flex-shrink-0 w-28 text-left transition-all duration-250 cursor-pointer group
//         ${active ? "opacity-100" : "opacity-45 hover:opacity-85"}`}
//       style={{ transform: active ? "scale(1.07)" : "scale(1)", transition: "all 0.2s ease" }}
//     >
//       <div className={`w-full h-16 overflow-hidden mb-1.5 border-2 transition-all
//         ${active ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.3)]" : "border-transparent"}`}>
//         {thumb ? (
//           <img src={thumb} alt={post.title}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
//         ) : (
//           <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/25 text-xl">✦</div>
//         )}
//       </div>
//       <p className="text-white text-[10px] font-['EB_Garamond'] leading-tight line-clamp-2 px-0.5">
//         {post.title}
//       </p>
//       <time className="text-white/35 text-[9px] font-mono tracking-wide px-0.5 mt-0.5 block">{post.date}</time>
//     </button>
//   )
// }

// // ─── Modal ────────────────────────────────────────────────────────────────────

// export default function BlogPostModal() {
//   const { id }   = useParams()
//   const navigate = useNavigate()
//   const API_URL  = import.meta.env.VITE_API_URL

//   const allPosts = usePostsContext()

//   const [post, setPost]             = useState(null)
//   const [show, setShow]             = useState(false)
//   const [mediaIndex, setMediaIndex] = useState(0)
//   const [contentIn, setContentIn]   = useState(false)

//   const postIndex  = allPosts.findIndex(p => p.id === id)
//   const prevPost   = postIndex > 0 ? allPosts[postIndex - 1] : null
//   const nextPost   = postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null

//   // Show ~7 neighbours centred on current post
//   const start      = Math.max(0, postIndex - 3)
//   const stripPosts = allPosts.slice(start, start + 8)

//   useEffect(() => {
//     document.body.style.overflow = "hidden"
//     return () => { document.body.style.overflow = "auto" }
//   }, [])

//   // Entrance — backdrop first, card slightly after
//   useEffect(() => {
//     setTimeout(() => setShow(true), 10)
//     setTimeout(() => setContentIn(true), 200)
//   }, [])

//   useEffect(() => {
//     setMediaIndex(0)
//     setContentIn(false)
//     fetch(`${API_URL}/api/blog/${id}`)
//       .then(r => r.ok ? r.json() : Promise.reject())
//       .then(data => {
//         setPost(data)
//         setTimeout(() => setContentIn(true), 80)
//       })
//       .catch(console.error)
//   }, [id])

//   const mediaList = post ? buildMediaList(post) : []
//   const hasMany   = mediaList.length > 1
//   const current   = mediaList[mediaIndex] ?? null

//   const goTo = useCallback((targetId) => {
//     navigate(`/blog/post/${targetId}`, { replace: true })
//   }, [navigate])

//   const handleKey = useCallback((e) => {
//     if (e.key === "Escape")      return closeModal()
//     if (e.key === "ArrowLeft"  && prevPost) goTo(prevPost.id)
//     if (e.key === "ArrowRight" && nextPost) goTo(nextPost.id)
//     if (e.key === "ArrowUp"    && hasMany)  setMediaIndex(i => (i - 1 + mediaList.length) % mediaList.length)
//     if (e.key === "ArrowDown"  && hasMany)  setMediaIndex(i => (i + 1) % mediaList.length)
//   }, [prevPost, nextPost, hasMany, mediaList.length])

//   useEffect(() => {
//     window.addEventListener("keydown", handleKey)
//     return () => window.removeEventListener("keydown", handleKey)
//   }, [handleKey])

//   function closeModal() {
//     setShow(false)
//     setTimeout(() => navigate(-1), 260)
//   }

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

//         @keyframes bgIn    { from{opacity:0} to{opacity:1} }
//         @keyframes cardIn  { from{opacity:0;transform:translateY(36px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes stripIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

//         .anim-bg    { animation: bgIn    0.28s ease forwards; }
//         .anim-card  { animation: cardIn  0.38s cubic-bezier(.22,.68,0,1.15) 0.06s both; }
//         .anim-content { animation: fadeUp 0.3s ease 0.18s both; }
//         .anim-strip { animation: stripIn 0.35s ease 0.32s both; }

//         .modal-prose p  { margin-bottom: 0.85em; }
//         .modal-prose a  { text-decoration: underline; }
//         .modal-prose h2 { font-family:'Playfair Display',serif; font-weight:700; margin:1em 0 0.4em; }

//         .mini-strip { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent; }
//         .mini-strip::-webkit-scrollbar { height: 3px; }
//         .mini-strip::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius:2px; }
//       `}</style>

//       {/* Backdrop */}
//       <div
//         onClick={closeModal}
//         className={`anim-bg fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 p-3 md:p-5
//           transition-opacity duration-260 ${show ? "opacity-100" : "opacity-0"}`}
//         style={{ backdropFilter: "blur(16px)", backgroundColor: "rgba(15,13,10,0.5)" }}
//       >

//         {/* Card */}
//         <div
//           onClick={e => e.stopPropagation()}
//           className="anim-card bg-[#f8f5ef] w-full max-w-5xl border-4 border-black shadow-2xl overflow-hidden relative"
//           style={{ maxHeight: "calc(100vh - 160px)" }}
//         >
//           <div className="flex flex-col md:flex-row" style={{ maxHeight: "calc(100vh - 160px)" }}>

//             {/* ── LEFT: media ── */}
//             {mediaList.length > 0 && (
//               <div className="md:w-[46%] w-full bg-black flex flex-col flex-shrink-0 min-h-0">

//                 {/* Scrollable media area — natural height */}
//                 <div className="relative flex-1 overflow-y-auto min-h-0">
//                   <div className={contentIn ? "anim-content" : "opacity-0"}>
//                     <MediaViewer item={current} />
//                   </div>

//                   {hasMany && (
//                     <>
//                       <button onClick={() => setMediaIndex(i => (i - 1 + mediaList.length) % mediaList.length)}
//                         className="absolute left-2 top-2 z-10 bg-black/60 hover:bg-black text-white w-7 h-7 flex items-center justify-center text-lg transition-all hover:scale-110">↑</button>
//                       <button onClick={() => setMediaIndex(i => (i + 1) % mediaList.length)}
//                         className="absolute right-2 top-2 z-10 bg-black/60 hover:bg-black text-white w-7 h-7 flex items-center justify-center text-lg transition-all hover:scale-110">↓</button>
//                       <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] px-2 py-0.5 font-mono tracking-widest">
//                         {mediaIndex + 1} / {mediaList.length}
//                       </span>
//                     </>
//                   )}
//                 </div>

//                 {/* Media thumbnails */}
//                 {hasMany && (
//                   <div className="flex gap-2 px-3 py-2 bg-black/90 overflow-x-auto flex-shrink-0">
//                     {mediaList.map((item, i) => (
//                       <Thumb key={i} item={item} active={i === mediaIndex} onClick={() => setMediaIndex(i)} />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── RIGHT: text ── */}
//             <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

//               {/* Close */}
//               <button onClick={closeModal}
//                 className="absolute top-0 right-0 z-20 w-10 h-10 bg-black text-white
//                   font-black flex items-center justify-center hover:bg-red-600 transition-colors">✕</button>

//               {/* Post header */}
//               <div className={`px-6 pt-7 pb-4 border-b-2 border-black flex-shrink-0 ${contentIn ? "anim-content" : "opacity-0"}`}>
//                 <div className="flex flex-wrap items-center gap-2 mb-2">
//                   <time className="font-mono text-[10px] tracking-widest uppercase text-black/40">{post?.date}</time>
//                   {post?.tags?.map(t => (
//                     <span key={t} className="font-black text-[10px] tracking-widest uppercase text-black/45 border-l border-black/20 pl-2">#{t}</span>
//                   ))}
//                 </div>
//                 <div className="w-full border-t border-black/15 mb-3" />
//                 <h1 className="font-['Playfair_Display'] font-black text-xl md:text-2xl leading-tight pr-10">
//                   {post?.title}
//                 </h1>
//                 {post?.excerpt && (
//                   <p className="font-['EB_Garamond'] italic text-sm text-black/55 mt-2 leading-relaxed">
//                     {post.excerpt}
//                   </p>
//                 )}
//               </div>

//               {/* Body — independently scrollable */}
//               <div className={`px-6 py-4 overflow-y-auto flex-1 ${contentIn ? "anim-content" : "opacity-0"}`}>
//                 {post?.content ? (
//                   <div
//                     className="modal-prose font-['EB_Garamond'] text-[15px] leading-relaxed text-black/80"
//                     dangerouslySetInnerHTML={{ __html: post.content }}
//                   />
//                 ) : (
//                   <p className="font-['EB_Garamond'] italic text-black/25 text-sm">— no body text —</p>
//                 )}
//               </div>

//               {/* Footer */}
//               <div className="px-6 py-3 border-t border-black/12 flex-shrink-0 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   {prevPost && (
//                     <button onClick={() => goTo(prevPost.id)}
//                       className="text-[10px] font-black tracking-widest uppercase text-black/50 hover:text-black transition-colors flex items-center gap-1">
//                       ‹ prev
//                     </button>
//                   )}
//                   {nextPost && (
//                     <button onClick={() => goTo(nextPost.id)}
//                       className="text-[10px] font-black tracking-widest uppercase text-black/50 hover:text-black transition-colors flex items-center gap-1">
//                       next ›
//                     </button>
//                   )}
//                 </div>
//                 <button onClick={closeModal}
//                   className="font-black text-[10px] tracking-widest uppercase border border-black px-3 py-1.5
//                     hover:bg-black hover:text-white transition-colors">← BACK</button>
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* ── Bottom strip ── */}
//         {stripPosts.length > 1 && (
//           <div
//             className="anim-strip w-full max-w-5xl"
//             onClick={e => e.stopPropagation()}
//           >
//             <div className="mini-strip flex gap-4 overflow-x-auto pb-1">
//               {stripPosts.map(p => (
//                 <MiniCard
//                   key={p.id}
//                   post={p}
//                   active={p.id === id}
//                   onClick={() => goTo(p.id)}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//       </div>
//     </>
//   )
// }

import { useParams, useNavigate, Link, useLocation } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import { usePostsContext } from "./BlogPage"

// ─── SEO ─────────────────────────────────────────────────────────────────────

function useSEO(post) {
  useEffect(() => {
    if (!post) return
    const prev    = document.title
    const site    = "THE BLOG"
    const siteUrl = window.location.origin
    const postUrl = `${siteUrl}/blog/post/${post.id}`

    let img = post.cover || null
    if (!img && post.url) {
      const m = post.url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
      if (m) img = `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`
    }
    const desc = post.excerpt || `${post.title} — ${site}`
    document.title = `${post.title} | ${site}`

    const set = (name, content, attr = "name") => {
      if (!content) return
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); el.setAttribute("data-sei", "1"); document.head.appendChild(el) }
      el.setAttribute("content", content)
    }

    set("description", desc); set("keywords", (post.tags||[]).join(", "))
    set("og:type","article","property"); set("og:title",post.title,"property")
    set("og:description",desc,"property"); set("og:url",postUrl,"property")
    if (img) set("og:image",img,"property")
    set("twitter:card", img ? "summary_large_image" : "summary")
    set("twitter:title", post.title); set("twitter:description", desc)
    if (img) set("twitter:image", img)

    let c = document.querySelector('link[rel="canonical"]')
    if (!c) { c = document.createElement("link"); c.setAttribute("rel","canonical"); c.setAttribute("data-sei","1"); document.head.appendChild(c) }
    c.setAttribute("href", postUrl)

    const ld = document.createElement("script")
    ld.type = "application/ld+json"; ld.setAttribute("data-sei","1")
    ld.textContent = JSON.stringify({ "@context":"https://schema.org","@type":"Article","headline":post.title,"description":desc,"url":postUrl,"datePublished":post.date?new Date(post.date).toISOString():undefined,"keywords":(post.tags||[]).join(", "),"publisher":{"@type":"Organization","name":site,"url":siteUrl},...(img?{image:{"@type":"ImageObject","url":img}}:{}) })
    document.head.appendChild(ld)

    return () => { document.title = prev; document.querySelectorAll("[data-sei]").forEach(e=>e.remove()) }
  }, [post])
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

function getYoutubeID(url = "") {
  const m = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}
function getRumbleID(url = "") {
  const m = url.match(/rumble\.com\/(?:embed\/)?(v[a-z0-9]+)/i)
  return m ? m[1] : null
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
  const items = []; const seen = new Set()
  const push = (url, type) => { if (!url || seen.has(url)) return; seen.add(url); const t = type ?? detectType(url); if (t) items.push({ url, type: t }) }
  if (post.cover)           push(post.cover, "image")
  post.photos?.forEach(u => push(u, "image"))
  if (post.video)           push(post.video, "mp4")
  if (post.url)             push(post.url)
  post.videos?.forEach(u => push(u))
  return items
}

// ─── Media embed ──────────────────────────────────────────────────────────────

function MediaEmbed({ item }) {
  if (!item) return null
  if (item.type === "image") return (
    <img src={item.url} alt="" className="w-full h-auto block" loading="lazy" />
  )
  if (item.type === "mp4") return (
    <video key={item.url} controls className="w-full h-auto block bg-black">
      <source src={item.url} type="video/mp4" />
    </video>
  )
  if (item.type === "youtube") return (
    <div className="w-full relative bg-black" style={{ paddingBottom: "56.25%" }}>
      <iframe key={item.url} className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${getYoutubeID(item.url)}?rel=0`}
        title="YouTube" frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen />
    </div>
  )
  if (item.type === "rumble") return (
    <div className="w-full relative bg-black" style={{ paddingBottom: "56.25%" }}>
      <iframe key={item.url} className="absolute inset-0 w-full h-full"
        src={`https://rumble.com/embed/${getRumbleID(item.url)}/`}
        title="Rumble" frameBorder="0" allowFullScreen />
    </div>
  )
  return null
}

// ─── Related post card ────────────────────────────────────────────────────────

function RelatedCard({ post }) {
  const location  = useLocation()
  const youtubeId = post.url ? getYoutubeID(post.url) : null
  const thumb     = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : post.cover || null

  return (
    <Link to={`/blog/post/${post.id}`} state={{ background: location }}
      className="group block bg-[#1a1a1a] border border-white/[0.06] hover:border-[#ff6b00]/50 overflow-hidden transition-colors duration-150">
      <div className="relative overflow-hidden bg-[#0f0f0f]" style={{ aspectRatio: "16/9" }}>
        {thumb
          ? <img src={thumb} alt={post.title} className="w-full h-full object-cover brightness-80 group-hover:brightness-100 group-hover:scale-[1.04] transition-all duration-300" loading="lazy" />
          : <div className="w-full h-full flex items-center justify-center text-white/10 text-3xl">✦</div>
        }
        {youtubeId && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#ff6b00]/90 flex items-center justify-center">
              <span className="text-white text-xs ml-0.5">▶</span>
            </div>
          </div>
        )}
        {post.tags?.[0] && (
          <div className="absolute top-0 left-0 bg-[#ff6b00] px-2 py-0.5">
            <span className="text-white text-[9px] font-black uppercase tracking-widest">{post.tags[0]}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-['Barlow_Condensed'] font-bold text-white/85 text-[13px] uppercase leading-tight group-hover:text-[#ff6b00] transition-colors line-clamp-2">
          {post.title}
        </h3>
        <time className="text-white/25 text-[10px] font-['Barlow'] mt-1.5 block">{post.date}</time>
      </div>
    </Link>
  )
}

// ─── Prev / Next nav ──────────────────────────────────────────────────────────

function PostNav({ post, direction }) {
  const location  = useLocation()
  const youtubeId = post.url ? getYoutubeID(post.url) : null
  const thumb     = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
    : post.cover || null

  return (
    <Link to={`/blog/post/${post.id}`} state={{ background: location }}
      className="group flex items-center gap-3 bg-[#1a1a1a] border border-white/[0.06] hover:border-[#ff6b00]/50 p-3 transition-colors duration-150 flex-1 min-w-0">
      {direction === "prev" && <span className="text-[#ff6b00] text-lg flex-shrink-0">‹</span>}
      {thumb && (
        <div className="w-14 h-10 flex-shrink-0 overflow-hidden bg-[#111]">
          <img src={thumb} alt="" className="w-full h-full object-cover brightness-70 group-hover:brightness-100 transition-all" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white/25 text-[9px] font-['Barlow'] uppercase tracking-widest mb-0.5">
          {direction === "prev" ? "← Previous" : "Next →"}
        </p>
        <p className="font-['Barlow_Condensed'] font-bold text-white/70 text-[13px] uppercase leading-tight group-hover:text-[#ff6b00] transition-colors line-clamp-1">
          {post.title}
        </p>
      </div>
      {direction === "next" && <span className="text-[#ff6b00] text-lg flex-shrink-0">›</span>}
    </Link>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BlogPostModal() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const API_URL    = import.meta.env.VITE_API_URL
  const allPosts   = usePostsContext()

  const [post, setPost]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [activeMedia, setActive] = useState(0)

  const idx      = allPosts.findIndex(p => p.id === id)
  const prevPost = idx > 0               ? allPosts[idx - 1] : null
  const nextPost = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  const related  = allPosts.filter(p => p.id !== id && p.tags?.some(t => post?.tags?.includes(t))).slice(0, 4)
  const morePosts = related.length ? related : allPosts.filter(p => p.id !== id).slice(0, 4)

  useSEO(post)

  useEffect(() => {
    setLoading(true); setActive(0); setPost(null)
    window.scrollTo({ top: 0, behavior: "instant" })
    fetch(`${API_URL}/api/blog/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setPost(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  // Keyboard prev/next post
  const handleKey = useCallback((e) => {
    if (e.key === "ArrowLeft"  && prevPost) navigate(`/blog/post/${prevPost.id}`)
    if (e.key === "ArrowRight" && nextPost) navigate(`/blog/post/${nextPost.id}`)
    if (e.key === "Escape") navigate("/blog")
  }, [prevPost, nextPost])
  useEffect(() => { window.addEventListener("keydown", handleKey); return () => window.removeEventListener("keydown", handleKey) }, [handleKey])

  const mediaList = post ? buildMediaList(post) : []
  const heroMedia = mediaList[0] ?? null
  const extraMedia = mediaList.slice(1)

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!post) return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center">
      <p className="text-white/30 font-['Barlow_Condensed'] uppercase tracking-widest">Post not found</p>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');

        @keyframes pbFadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .pb-fade { animation: pbFadeIn 0.4s ease forwards; }

        .post-body { color: rgba(255,255,255,0.72); font-family:'Barlow',sans-serif; font-size:15px; line-height:1.75; }
        .post-body p  { margin-bottom: 1.1em; }
        .post-body h2 { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:1.4rem; text-transform:uppercase; color:#fff; margin:1.6em 0 0.5em; letter-spacing:0.04em; }
        .post-body h3 { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:1.1rem; text-transform:uppercase; color:#fff; margin:1.3em 0 0.4em; }
        .post-body a  { color:#ff6b00; text-decoration:underline; }
        .post-body a:hover { color:#ff8c33; }
        .post-body ul, .post-body ol { padding-left:1.4em; margin-bottom:1em; }
        .post-body li { margin-bottom:0.3em; }
        .post-body blockquote { border-left:3px solid #ff6b00; padding:0.6em 1em; margin:1.2em 0; background:rgba(255,107,0,0.07); color:rgba(255,255,255,0.6); font-style:italic; }
        .post-body img { max-width:100%; height:auto; margin:1em 0; }
        .post-body hr  { border:none; border-top:1px solid rgba(255,255,255,0.08); margin:1.6em 0; }

        * { scrollbar-width: thin; scrollbar-color: #333 transparent; }
        ::-webkit-scrollbar { width:5px } ::-webkit-scrollbar-thumb { background:#333 }
        ::-webkit-scrollbar-thumb:hover { background:#ff6b00 }
      `}</style>

      <div className="min-h-screen bg-[#111] text-white">

        {/* ── Sticky top bar ─────────────────────────────────────────────── */}
        <div className="sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 h-11 flex items-center gap-3">
            <button onClick={() => navigate("/blog")}
              className="flex items-center gap-2 text-white/40 hover:text-[#ff6b00] transition-colors duration-150 group cursor-pointer">
              <span className="text-lg group-hover:-translate-x-0.5 transition-transform">←</span>
              <span className="font-['Barlow_Condensed'] font-bold text-[11px] uppercase tracking-[0.15em]">Back</span>
            </button>

            <span className="text-white/10">|</span>

            {/* Breadcrumb tags */}
            <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {post.tags?.map(t => (
                <span key={t} className="flex-shrink-0 bg-[#ff6b00] text-white text-[9px] font-black uppercase tracking-widest px-2 py-1">
                  {t}
                </span>
              ))}
            </div>

            {/* Post nav arrows on the right */}
            <div className="ml-auto flex items-center gap-1">
              {prevPost && (
                <button onClick={() => navigate(`/blog/post/${prevPost.id}`)}
                  title={prevPost.title}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-[#ff6b00] hover:text-[#ff6b00] text-white/30 transition-all duration-150 cursor-pointer font-bold text-lg">
                  ‹
                </button>
              )}
              {nextPost && (
                <button onClick={() => navigate(`/blog/post/${nextPost.id}`)}
                  title={nextPost.title}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-[#ff6b00] hover:text-[#ff6b00] text-white/30 transition-all duration-150 cursor-pointer font-bold text-lg">
                  ›
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Hero image / video ──────────────────────────────────────────── */}
        {heroMedia && (
          <div className="w-full bg-black pb-fade" style={{ maxHeight: "70vh", overflow: "hidden" }}>
            {heroMedia.type === "image" ? (
              <img src={heroMedia.url} alt={post.title}
                className="w-full object-cover object-center"
                style={{ maxHeight: "70vh" }}
                loading="eager" />
            ) : (
              <div className="max-w-5xl mx-auto">
                <MediaEmbed item={heroMedia} />
              </div>
            )}
          </div>
        )}

        {/* ── Content + Sidebar ───────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8 items-start">

            {/* ── MAIN column ──────────────────────────────────────────── */}
            <main className="flex-1 min-w-0 pb-fade">

              {/* Header */}
              <div className="mb-6 pb-5 border-b border-white/10">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags?.map(t => (
                    <span key={t} className="bg-[#ff6b00] text-white text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1.5">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="font-['Barlow_Condensed'] font-black text-white text-3xl md:text-5xl uppercase leading-[1.02] tracking-tight mb-4">
                  {post.title}
                </h1>

                {/* Excerpt / lead */}
                {post.excerpt && (
                  <p className="text-white/55 font-['Barlow'] text-base leading-relaxed border-l-2 border-[#ff6b00] pl-4 mb-4">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-['Barlow'] uppercase tracking-wide">
                  <div className="flex items-center gap-2 text-white/35">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                    <time>{post.date}</time>
                  </div>
                  {post.source && (
                    <div className="flex items-center gap-2 text-white/25">
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span>{post.source}</span>
                    </div>
                  )}
                  {mediaList.length > 0 && (
                    <div className="flex items-center gap-2 text-white/25">
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span>{mediaList.length} {mediaList.length === 1 ? "media" : "media items"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Body text ────────────────────────────────────────── */}
              {post.content ? (
                <div className="post-body mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <div className="text-white/20 font-['Barlow'] italic text-sm py-4 mb-8">
                  — No body text —
                </div>
              )}

              {/* ── Extra media (photos/videos beyond the hero) ──────── */}
              {extraMedia.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-5 bg-[#ff6b00]" />
                    <h2 className="font-['Barlow_Condensed'] font-black text-[11px] uppercase tracking-[0.2em] text-white/50">
                      Media
                    </h2>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>

                  {/* Thumbnail strip — click to expand */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {extraMedia.map((item, i) => {
                      const thumb = item.type === "youtube"
                        ? `https://img.youtube.com/vi/${getYoutubeID(item.url)}/mqdefault.jpg`
                        : item.type === "image" ? item.url : null
                      return (
                        <button key={i} onClick={() => setActive(i + 1)}
                          className={`relative w-24 h-16 overflow-hidden border-2 transition-all duration-150 cursor-pointer flex-shrink-0 ${
                            activeMedia === i + 1 ? "border-[#ff6b00] scale-105" : "border-white/10 hover:border-white/30 opacity-60 hover:opacity-100"
                          }`}>
                          {thumb
                            ? <img src={thumb} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-[#222] flex items-center justify-center text-white/30 text-xl">▶</div>
                          }
                          {(item.type === "youtube" || item.type === "mp4" || item.type === "rumble") && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <span className="w-5 h-5 bg-[#ff6b00] flex items-center justify-center text-white text-[9px] ml-0.5">▶</span>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Active extra media */}
                  {activeMedia > 0 && mediaList[activeMedia] && (
                    <div className="bg-black">
                      <MediaEmbed item={mediaList[activeMedia]} />
                    </div>
                  )}
                </div>
              )}

              {/* ── Prev / Next ───────────────────────────────────────── */}
              {(prevPost || nextPost) && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-5 bg-[#ff6b00]" />
                    <span className="font-['Barlow_Condensed'] font-black text-[11px] uppercase tracking-[0.2em] text-white/50">
                      More Dispatches
                    </span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>
                  <div className="flex gap-2">
                    {prevPost && <PostNav post={prevPost} direction="prev" />}
                    {nextPost && <PostNav post={nextPost} direction="next" />}
                  </div>
                </div>
              )}

            </main>

            {/* ── SIDEBAR ──────────────────────────────────────────────── */}
            <aside className="w-72 flex-shrink-0 hidden xl:block sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto pb-8">

              {/* Related / More posts */}
              <div className="bg-[#161616] border border-white/[0.06]">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ff6b00]" />
                  <span className="font-['Barlow_Condensed'] font-black text-[10px] uppercase tracking-[0.2em] text-white/50">
                    {related.length ? "Related" : "Latest Posts"}
                  </span>
                </div>
                <div className="p-3 space-y-3">
                  {morePosts.map(p => <RelatedCard key={p.id} post={p} />)}
                </div>
              </div>

              {/* Tags cloud */}
              {post.tags?.length > 0 && (
                <div className="mt-3 bg-[#161616] border border-white/[0.06]">
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#ff6b00]" />
                    <span className="font-['Barlow_Condensed'] font-black text-[10px] uppercase tracking-[0.2em] text-white/50">Tags</span>
                  </div>
                  <div className="p-3 flex flex-wrap gap-1.5">
                    {post.tags.map(t => (
                      <span key={t} className="bg-[#ff6b00]/10 border border-[#ff6b00]/20 text-[#ff6b00] text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to blog */}
              <button onClick={() => navigate("/blog")}
                className="mt-3 w-full bg-[#ff6b00] hover:bg-[#e55f00] text-white font-['Barlow_Condensed'] font-black text-[11px] uppercase tracking-[0.2em] py-3 transition-colors duration-150 cursor-pointer">
                ← All Posts
              </button>
            </aside>

          </div>

          {/* ── Mobile: Related posts ──────────────────────────────────── */}
          <div className="xl:hidden mt-10 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-[#ff6b00]" />
              <span className="font-['Barlow_Condensed'] font-black text-[11px] uppercase tracking-[0.2em] text-white/50">
                {related.length ? "Related" : "Latest Posts"}
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
            <div className="grid grid-cols-2 gap-1">
              {morePosts.slice(0, 4).map(p => <RelatedCard key={p.id} post={p} />)}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}