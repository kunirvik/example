

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
// import { useParams, useNavigate, Link, useLocation } from "react-router-dom"
// import { useEffect, useState, useCallback } from "react"
// import { usePostsContext } from "./BlogPage"
//  import TelegramComments from "./TelegramComments"
// // ─── SEO ─────────────────────────────────────────────────────────────────────
 
// function useSEO(post) {
//   useEffect(() => {
//     if (!post) return
//     const prev    = document.title
//     const site    = "THE BLOG"
//     const siteUrl = window.location.origin
//     const postUrl = `${siteUrl}/blog/post/${post.id}`
 
//     let img = post.cover || null
//     if (!img && post.url) {
//       const m = post.url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
//       if (m) img = `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`
//     }
//     const desc = post.excerpt || `${post.title} — ${site}`
//     document.title = `${post.title} | ${site}`
 
//     const set = (name, content, attr = "name") => {
//       if (!content) return
//       let el = document.querySelector(`meta[${attr}="${name}"]`)
//       if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); el.setAttribute("data-sei", "1"); document.head.appendChild(el) }
//       el.setAttribute("content", content)
//     }
 
//     set("description", desc); set("keywords", (post.tags||[]).join(", "))
//     set("og:type","article","property"); set("og:title",post.title,"property")
//     set("og:description",desc,"property"); set("og:url",postUrl,"property")
//     if (img) set("og:image",img,"property")
//     set("twitter:card", img ? "summary_large_image" : "summary")
//     set("twitter:title", post.title); set("twitter:description", desc)
//     if (img) set("twitter:image", img)
 
//     let c = document.querySelector('link[rel="canonical"]')
//     if (!c) { c = document.createElement("link"); c.setAttribute("rel","canonical"); c.setAttribute("data-sei","1"); document.head.appendChild(c) }
//     c.setAttribute("href", postUrl)
 
//     const ld = document.createElement("script")
//     ld.type = "application/ld+json"; ld.setAttribute("data-sei","1")
//     ld.textContent = JSON.stringify({ "@context":"https://schema.org","@type":"Article","headline":post.title,"description":desc,"url":postUrl,"datePublished":post.date?new Date(post.date).toISOString():undefined,"keywords":(post.tags||[]).join(", "),"publisher":{"@type":"Organization","name":site,"url":siteUrl},...(img?{image:{"@type":"ImageObject","url":img}}:{}) })
//     document.head.appendChild(ld)
 
//     return () => { document.title = prev; document.querySelectorAll("[data-sei]").forEach(e=>e.remove()) }
//   }, [post])
// }
 
// // ─── URL helpers ──────────────────────────────────────────────────────────────
 
// function getYoutubeID(url = "") {
//   const m = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
//   return m ? m[1] : null
// }
// function getRumbleID(url = "") {
//   const m = url.match(/rumble\.com\/(?:embed\/)?(v[a-z0-9]+)/i)
//   return m ? m[1] : null
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
//   const items = []; const seen = new Set()
//   const push = (url, type) => { if (!url || seen.has(url)) return; seen.add(url); const t = type ?? detectType(url); if (t) items.push({ url, type: t }) }
//   if (post.cover)           push(post.cover, "image")
//   post.photos?.forEach(u => push(u, "image"))
//   if (post.video)           push(post.video, "mp4")
//   if (post.url)             push(post.url)
//   post.videos?.forEach(u => push(u))
//   return items
// }
 
// // ─── Media embed ──────────────────────────────────────────────────────────────
 
// function MediaEmbed({ item }) {
//   if (!item) return null
//   if (item.type === "image") return (
//     <img src={item.url} alt="" className="w-full h-auto block" loading="lazy" />
//   )
//   if (item.type === "mp4") return (
//     <video key={item.url} controls className="w-full h-auto block bg-black">
//       <source src={item.url} type="video/mp4" />
//     </video>
//   )
//   if (item.type === "youtube") return (
//     <div className="w-full relative bg-black" style={{ paddingBottom: "56.25%" }}>
//       <iframe key={item.url} className="absolute inset-0 w-full h-full"
//         src={`https://www.youtube.com/embed/${getYoutubeID(item.url)}?rel=0`}
//         title="YouTube" frameBorder="0"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen />
//     </div>
//   )
//   if (item.type === "rumble") return (
//     <div className="w-full relative bg-black" style={{ paddingBottom: "56.25%" }}>
//       <iframe key={item.url} className="absolute inset-0 w-full h-full"
//         src={`https://rumble.com/embed/${getRumbleID(item.url)}/`}
//         title="Rumble" frameBorder="0" allowFullScreen />
//     </div>
//   )
//   return null
// }
 
// // ─── Related post card ────────────────────────────────────────────────────────
 
// function RelatedCard({ post }) {
//   const location  = useLocation()
//   const youtubeId = post.url ? getYoutubeID(post.url) : null
//   const thumb     = youtubeId
//     ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
//     : post.cover || null
 
//   return (
//     <Link to={`/blog/post/${post.id}`} state={{ background: location }}
//       className="group block bg-[#1a1a1a] border border-white/[0.06] hover:border-[#ff6b00]/50 overflow-hidden transition-colors duration-150">
//       <div className="relative overflow-hidden bg-[#0f0f0f]" style={{ aspectRatio: "16/9" }}>
//         {thumb
//           ? <img src={thumb} alt={post.title} className="w-full h-full object-cover brightness-80 group-hover:brightness-100 group-hover:scale-[1.04] transition-all duration-300" loading="lazy" />
//           : <div className="w-full h-full flex items-center justify-center text-white/10 text-3xl">✦</div>
//         }
//         {youtubeId && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-8 h-8 bg-[#ff6b00]/90 flex items-center justify-center">
//               <span className="text-white text-xs ml-0.5">▶</span>
//             </div>
//           </div>
//         )}
//         {post.tags?.[0] && (
//           <div className="absolute top-0 left-0 bg-[#ff6b00] px-2 py-0.5">
//             <span className="text-white text-[9px] font-black uppercase tracking-widest">{post.tags[0]}</span>
//           </div>
//         )}
//       </div>
//       <div className="p-3">
//         <h3 className="font-['Barlow_Condensed'] font-bold text-white/85 text-[13px] uppercase leading-tight group-hover:text-[#ff6b00] transition-colors line-clamp-2">
//           {post.title}
//         </h3>
//         <time className="text-white/25 text-[10px] font-['Barlow'] mt-1.5 block">{post.date}</time>
//       </div>
//     </Link>
//   )
// }
 
// // ─── Prev / Next nav ──────────────────────────────────────────────────────────
 
// function PostNav({ post, direction }) {
//   const location  = useLocation()
//   const youtubeId = post.url ? getYoutubeID(post.url) : null
//   const thumb     = youtubeId
//     ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
//     : post.cover || null
 
//   return (
//     <Link to={`/blog/post/${post.id}`} state={{ background: location }}
//       className="group flex items-center gap-3 bg-[#1a1a1a] border border-white/[0.06] hover:border-[#ff6b00]/50 p-3 transition-colors duration-150 flex-1 min-w-0">
//       {direction === "prev" && <span className="text-[#ff6b00] text-lg flex-shrink-0">‹</span>}
//       {thumb && (
//         <div className="w-14 h-10 flex-shrink-0 overflow-hidden bg-[#111]">
//           <img src={thumb} alt="" className="w-full h-full object-cover brightness-70 group-hover:brightness-100 transition-all" />
//         </div>
//       )}
//       <div className="flex-1 min-w-0">
//         <p className="text-white/25 text-[9px] font-['Barlow'] uppercase tracking-widest mb-0.5">
//           {direction === "prev" ? "← Previous" : "Next →"}
//         </p>
//         <p className="font-['Barlow_Condensed'] font-bold text-white/70 text-[13px] uppercase leading-tight group-hover:text-[#ff6b00] transition-colors line-clamp-1">
//           {post.title}
//         </p>
//       </div>
//       {direction === "next" && <span className="text-[#ff6b00] text-lg flex-shrink-0">›</span>}
//     </Link>
//   )
// }
 
// function mediaThumb(item) {
//   if (item.type === "youtube") return `https://img.youtube.com/vi/${getYoutubeID(item.url)}/hqdefault.jpg`
//   if (item.type === "image")   return item.url
//   return null
// }
// function mediaLabel(item) {
//   if (item.type === "youtube") return "YT"
//   if (item.type === "rumble")  return "RBL"
//   if (item.type === "mp4")     return "VID"
//   return "IMG"
// }
// function isVideo(t) { return t === "youtube" || t === "mp4" || t === "rumble" }
 
// // ─── Last-viewed tracker ──────────────────────────────────────────────────────
// // Сохраняет timestamp последнего открытия поста.
// // Возвращает флаг isUpdated — true если пост обновился с последнего визита.
 
// function useLastViewed(postId, postUpdatedAt) {
//   const key = `lv_${postId}`
//   const [isUpdated, setIsUpdated] = useState(false)
 
//   useEffect(() => {
//     if (!postId) return
//     try {
//       const last = parseInt(localStorage.getItem(key) || "0", 10)
//       const updatedTs = postUpdatedAt ? new Date(postUpdatedAt).getTime() : 0
//       // Показываем бейдж только если пост реально обновлялся (updatedAt > date) и юзер уже видел его раньше
//       if (last > 0 && updatedTs > 0 && updatedTs > last) {
//         setIsUpdated(true)
//       }
//     } catch {}
//     // Записываем текущее время как lastViewed
//     try { localStorage.setItem(key, Date.now().toString()) } catch {}
//   }, [postId, postUpdatedAt])
 
//   return isUpdated
// }
 
// // ─── Main component ───────────────────────────────────────────────────────────
 
// export default function BlogPostModal() {
//   const { id }     = useParams()
//   const navigate   = useNavigate()
//   const API_URL    = import.meta.env.VITE_API_URL
//   const allPosts   = usePostsContext()
 
//   const [post, setPost]         = useState(null)
//   const [loading, setLoading]   = useState(true)
//   const [activeMedia, setActive] = useState(0)
 
//   const idx      = allPosts.findIndex(p => p.id === id)
//   const prevPost = idx > 0               ? allPosts[idx - 1] : null
//   const nextPost = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
//   const related  = allPosts.filter(p => p.id !== id && p.tags?.some(t => post?.tags?.includes(t))).slice(0, 4)
//   const morePosts = related.length ? related : allPosts.filter(p => p.id !== id).slice(0, 4)
 
//   const isUpdated = useLastViewed(post?.id, post?.updatedAt)
 
//   useSEO(post)
 
//   useEffect(() => {
//     setLoading(true); setActive(0); setPost(null)
//     window.scrollTo({ top: 0, behavior: "instant" })
//     fetch(`${API_URL}/api/blog/${id}`)
//       .then(r => r.ok ? r.json() : Promise.reject())
//       .then(data => setPost(data))
//       .catch(console.error)
//       .finally(() => setLoading(false))
//   }, [id])
 
//   // Keyboard prev/next post
//   const handleKey = useCallback((e) => {
//     if (e.key === "ArrowLeft"  && prevPost) navigate(`/blog/post/${prevPost.id}`)
//     if (e.key === "ArrowRight" && nextPost) navigate(`/blog/post/${nextPost.id}`)
//     if (e.key === "Escape") navigate("/blog")
//   }, [prevPost, nextPost])
//   useEffect(() => { window.addEventListener("keydown", handleKey); return () => window.removeEventListener("keydown", handleKey) }, [handleKey])
 
//   const mediaList = post ? buildMediaList(post) : []
 
//   // ── Loading skeleton ───────────────────────────────────────────────────────
//   if (loading) return (
//     <div className="min-h-screen bg-[#111] flex items-center justify-center">
//       <div className="w-8 h-8 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin" />
//     </div>
//   )
//   if (!post) return (
//     <div className="min-h-screen bg-[#111] flex items-center justify-center">
//       <p className="text-white/30 font-['Barlow_Condensed'] uppercase tracking-widest">Post not found</p>
//     </div>
//   )
 
//   const NAV_H = 44 // px — top bar height
 
//   return (
//     <>
//   <style>{`
//   .post-body { color:rgba(255,255,255,0.72); font-family:'FuturaPT',sans-serif; font-weight:500; font-size:14px; line-height:1.72; }
//   .post-body p  { margin-bottom:1em; }
//   .post-body h2 { font-family:'FuturaPT',sans-serif; font-weight:bold; font-size:1.25rem; text-transform:uppercase; color:#fff; margin:1.4em 0 0.4em; letter-spacing:0.04em; }
//   .post-body h3 { font-family:'FuturaPT',sans-serif; font-weight:bold; font-size:1rem; text-transform:uppercase; color:#fff; margin:1.1em 0 0.3em; }
//   .post-body a  { color:#ff6b00; text-decoration:underline; }
//   .post-body a:hover { color:#ff8c33; }
//   .post-body ul, .post-body ol { padding-left:1.3em; margin-bottom:0.9em; }
//   .post-body li { margin-bottom:0.25em; }
//   .post-body blockquote { border-left:3px solid #ff6b00; padding:0.5em 0.9em; margin:1em 0; background:rgba(255,107,0,0.07); color:rgba(255,255,255,0.55); font-style:oblique; font-weight:light; }
//   .post-body hr { border:none; border-top:1px solid rgba(255,255,255,0.08); margin:1.3em 0; }

//   .right-scroll { overflow-y:auto; scrollbar-width:thin; scrollbar-color:#2a2a2a transparent; }
//   .right-scroll::-webkit-scrollbar { width:4px; }
//   .right-scroll::-webkit-scrollbar-thumb { background:#2a2a2a; border-radius:2px; }
//   .right-scroll::-webkit-scrollbar-thumb:hover { background:#ff6b00; }

//   .thumb-strip { scrollbar-width:thin; scrollbar-color:#ff6b00 #1a1a1a; }
//   .thumb-strip::-webkit-scrollbar { height:3px; }
//   .thumb-strip::-webkit-scrollbar-thumb { background:#ff6b00; }
// `}</style>
 
//       {/* ── Full-screen shell ───────────────────────────────────────────────── */}
//       <div className="bg-[#111] text-white flex flex-col" style={{ height: "100dvh" }}>
 
//         {/* ── Top nav bar (fixed height) ─────────────────────────────────── */}
//         <div className="flex-shrink-0 bg-[#0d0d0d] border-b border-white/10 z-40"
//           style={{ height: NAV_H }}>
//           <div className="h-full px-4 flex items-center gap-3">
 
//             <button onClick={() => navigate("/blog")}
//               className="flex items-center gap-1.5 text-white/40 hover:text-[#ff6b00] transition-colors group cursor-pointer flex-shrink-0">
//               <span className="text-base group-hover:-translate-x-0.5 transition-transform inline-block">←</span>
//               <span className="font-['Barlow_Condensed'] font-bold text-[10px] uppercase tracking-[0.15em]">All Posts</span>
//             </button>
 
//             <span className="text-white/10 flex-shrink-0">|</span>
 
//             {/* Tags */}
//             <div className="flex gap-1.5 overflow-x-auto flex-1 min-w-0" style={{ scrollbarWidth:"none" }}>
//               {post.tags?.map(t => (
//                 <span key={t} className="flex-shrink-0 bg-[#ff6b00] text-white text-[9px] font-black uppercase tracking-widest px-2 py-1">
//                   {t}
//                 </span>
//               ))}
//               <span className="flex-shrink-0 text-white/20 font-['Barlow'] text-[11px] self-center ml-2 truncate hidden sm:block">
//                 {post.title}
//               </span>
//             </div>
 
//             {/* Prev / Next post */}
//             <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
//               {prevPost && (
//                 <button onClick={() => navigate(`/blog/post/${prevPost.id}`)}
//                   title={prevPost.title}
//                   className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-[#ff6b00] hover:text-[#ff6b00] text-white/30 transition-all cursor-pointer font-bold text-lg">
//                   ‹
//                 </button>
//               )}

//               {nextPost && (
//                 <button onClick={() => navigate(`/blog/post/${nextPost.id}`)}
//                   title={nextPost.title}
//                   className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-[#ff6b00] hover:text-[#ff6b00] text-white/30 transition-all cursor-pointer font-bold text-lg">
//                   ›
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
 
//         {/* ── Body: two panels side-by-side ─────────────────────────────── */}
//         <div className="flex flex-1 min-h-0">
 
//           {/* ══ LEFT PANEL — media ════════════════════════════════════════ */}
//           <div className="flex flex-col bg-black border-r border-white/[0.07]"
//             style={{ width: "58%", minWidth: 0 }}>
 
//             {/* Active player — fills all available height minus strip */}
//             <div className="flex-1 min-h-0 flex items-center justify-center bg-black overflow-hidden">
//               {mediaList.length > 0
//                 ? <MediaEmbed item={mediaList[activeMedia] ?? mediaList[0]} />
//                 : (
//                   <div className="flex flex-col items-center gap-3 text-white/10">
//                     <span className="text-5xl">✦</span>
//                     <span className="font-['Barlow_Condensed'] text-xs uppercase tracking-widest">No media</span>
//                   </div>
//                 )
//               }
//             </div>
 
//             {/* Thumbnail strip (only when multiple) */}
//             {mediaList.length > 1 && (
//               <div className="flex-shrink-0 bg-[#0a0a0a] border-t-2 border-[#ff6b00]">
//                 {/* strip header */}
//                 <div className="flex items-center gap-2 px-3 pt-2 pb-1">
//                   <span className="font-['Barlow_Condensed'] font-black text-[#ff6b00] text-[10px] uppercase tracking-[0.18em]">
//                     {mediaList.length} {isVideo(mediaList[0]?.type) ? "Videos" : "Media"}
//                   </span>
//                   <div className="flex-1 h-px bg-white/10" />
//                   <span className="text-white/20 font-['Barlow'] text-[10px]">{activeMedia + 1} / {mediaList.length}</span>
//                 </div>
//                 {/* thumbnails */}
//                 <div className="thumb-strip flex gap-2 px-3 pb-3 overflow-x-auto">
//                   {mediaList.map((item, i) => {
//                     const thumb = mediaThumb(item)
//                     const isAct = i === activeMedia
//                     const isVid = isVideo(item.type)
//                     return (
//                       <button key={i} onClick={() => setActive(i)}
//                         style={{ width: 120, aspectRatio: "16/9", flexShrink: 0 }}
//                         className={`relative overflow-hidden cursor-pointer transition-all duration-150 ${
//                           isAct ? "ring-2 ring-[#ff6b00]" : "opacity-45 hover:opacity-90"
//                         }`}>
//                         {thumb
//                           ? <img src={thumb} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
//                           : <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center text-white/20 text-xl">▶</div>
//                         }
//                         <div className={`absolute inset-0 ${isAct ? "bg-black/10" : "bg-black/40"}`} />
//                         {isVid && (
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <div className={`flex items-center justify-center transition-all ${isAct ? "w-8 h-8 bg-[#ff6b00]" : "w-6 h-6 bg-[#ff6b00]/70"}`}>
//                               <span className="text-white font-black text-[9px] ml-px">▶</span>
//                             </div>
//                           </div>
//                         )}
//                         {/* NEW dot — показываем на всех медиа если пост обновился */}
//                         {isUpdated && !isAct && (
//                           <div className="absolute top-1 right-1 w-2 h-2 bg-[#22c55e] rounded-full shadow-lg" />
//                         )}
//                         {/* bottom label */}
//                         <div className={`absolute bottom-0 left-0 right-0 px-1.5 py-0.5 ${isAct ? "bg-[#ff6b00]" : "bg-black/70"}`}>
//                           <span className="font-['Barlow_Condensed'] font-black text-white text-[8px] uppercase tracking-wide">
//                             {isAct ? "▶ Playing" : `#${i + 1} ${mediaLabel(item)}`}
//                           </span>
//                         </div>
//                       </button>
//                     )
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
 
//           {/* ══ RIGHT PANEL — text (independently scrollable) ════════════ */}
//           <div className="right-scroll flex flex-col flex-1 min-w-0 min-h-0"
//             style={{ overflowY: "auto" }}>
 
//             <div className="p-5 flex flex-col gap-5 flex-1">
 
//               {/* ── Article header ── */}
//               <div className="pb-4 border-b border-white/10">
//                 {/* Tags + UPDATED badge */}
//                 <div className="flex flex-wrap gap-1.5 mb-3 items-center">
//                   {post.tags?.map(t => (
//                     <span key={t} className="bg-[#ff6b00] text-white text-[9px] font-black uppercase tracking-[0.18em] px-2 py-1">
//                       {t}
//                     </span>
//                   ))}
//                   {isUpdated && (
//                     <span className="flex items-center gap-1 bg-[#22c55e] text-white text-[9px] font-black uppercase tracking-[0.18em] px-2 py-1 animate-pulse">
//                       ↑ Updated
//                     </span>
//                   )}
//                 </div>
 
//                 {/* Title */}
//                 <h1 className="font-['Barlow_Condensed'] font-black text-white text-2xl xl:text-3xl uppercase leading-[1.04] tracking-tight mb-3">
//                   {post.title}
//                 </h1>
 
//                 {/* Excerpt */}
//                 {post.excerpt && (
//                   <p className="text-white/50 font-['Barlow'] text-sm leading-relaxed border-l-2 border-[#ff6b00] pl-3 mb-3">
//                     {post.excerpt}
//                   </p>
//                 )}
 
//                 {/* Meta */}
//                 <div className="flex flex-wrap items-center gap-3 text-[10px] font-['Barlow'] uppercase tracking-wide text-white/30">
//                   <time>{post.date}</time>
//                   {post.source && <><span className="w-0.5 h-0.5 bg-white/20 rounded-full" /><span>{post.source}</span></>}
//                   {mediaList.length > 1 && <><span className="w-0.5 h-0.5 bg-white/20 rounded-full" /><span>{mediaList.length} media</span></>}
//                   {isUpdated && post.updatedAt && (
//                     <><span className="w-0.5 h-0.5 bg-white/20 rounded-full" />
//                     <span className="text-[#22c55e]">
//                       updated {new Date(post.updatedAt).toLocaleDateString("ru-RU")}
//                     </span></>
//                   )}
//                 </div>
//               </div>
 
//               {/* ── Body ── */}
//               <div className="flex-1">
//                 {isUpdated && (
//                   <div className="mb-3 flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/30 px-3 py-2">
//                     <span className="text-[#22c55e] text-[10px] font-black uppercase tracking-widest">↑ Пост обновлён — новый контент ниже</span>
//                   </div>
//                 )}
//                 {post.content
//                   ? <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
//                   : <p className="text-white/15 font-['Barlow'] italic text-sm">— No body text —</p>
//                 }
//               </div>
 
//               {/* ── Related posts ── */}
//               {morePosts.length > 0 && (
//                 <div className="pt-4 border-t border-white/10">
//                   <div className="flex items-center gap-2 mb-3">
//                     <div className="w-1 h-4 bg-[#ff6b00]" />
//                     <span className="font-['Barlow_Condensed'] font-black text-[10px] uppercase tracking-[0.2em] text-white/40">
//                       {related.length ? "Related" : "More Posts"}
//                     </span>
//                     <div className="flex-1 h-px bg-white/[0.06]" />
//                   </div>
//                   <div className="grid grid-cols-2 gap-1">
//                     {morePosts.slice(0, 4).map(p => <RelatedCard key={p.id} post={p} />)}
//                   </div>
//                 </div>
//               )}
//                {post.telegramUrl && (
//   <TelegramComments telegramUrl={post.telegramUrl} dark={true} />
// )}
//               {/* ── Prev / Next ── */}
//               {(prevPost || nextPost) && (
//                 <div className="flex gap-2 pt-2">
//                   {prevPost && <PostNav post={prevPost} direction="prev" />}
//                   {nextPost && <PostNav post={nextPost} direction="next" />}
//                 </div>
//               )}
 
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useCallback, memo } from "react"
import { usePostsContext } from "./BlogPage"
import TelegramComments from "../components/TelegramComments"

// ─── Helpers ──────────────────────────────────────────────────────────────

function getYoutubeID(url = "") {
  const m = url?.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

function getRumbleID(url = "") {
  const m = url?.match(/rumble\.com\/(?:embed\/)?(v[a-z0-9]+)/i)
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
  const items = []
  const push = (url, forcedType) => {
    const type = forcedType ?? detectType(url)
    if (type) items.push({ url, type })
  }

  if (post.cover) push(post.cover, "image")
  post.photos?.forEach(u => push(u, "image"))
  if (post.video) push(post.video, "mp4")
  if (post.url) push(post.url)
  post.videos?.forEach(u => push(u))

  return items
}

function mediaThumb(item) {
  if (item.type === "image") return item.url
  if (item.type === "youtube") {
    const id = getYoutubeID(item.url)
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
  }
  return null
}

function isVideo(type) {
  return ["youtube", "rumble", "mp4"].includes(type)
}

function mediaLabel(item) {
  if (item.type === "youtube") return "YouTube"
  if (item.type === "rumble") return "Rumble"
  if (item.type === "mp4") return "Video"
  if (item.type === "image") return "Photo"
  return "Media"
}

// ─── Media Embed Component (memoized) ─────────────────────────────────────

const MediaEmbed = memo(({ item }) => {
  if (!item) return null

  if (item.type === "image") {
    return (
      <img
        src={item.url}
        alt=""
        className="w-full h-full object-contain"
        loading="lazy"
      />
    )
  }

  if (item.type === "mp4") {
    return (
      <video key={item.url} controls className="w-full h-full object-contain">
        <source src={item.url} type="video/mp4" />
      </video>
    )
  }

  if (item.type === "youtube") {
    return (
      <iframe
        key={item.url}
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${getYoutubeID(item.url)}`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  if (item.type === "rumble") {
    return (
      <iframe
        key={item.url}
        className="w-full h-full"
        src={`https://rumble.com/embed/${getRumbleID(item.url)}/`}
        title="Rumble video"
        frameBorder="0"
        allowFullScreen
      />
    )
  }

  return null
})

// ─── Related Card Component (memoized) ────────────────────────────────────

const RelatedCard = memo(({ post }) => {
  const navigate = useNavigate()
  const thumb = post.cover || (post.url && getYoutubeID(post.url)
    ? `https://img.youtube.com/vi/${getYoutubeID(post.url)}/mqdefault.jpg`
    : null)

  return (
    <button
      onClick={() => navigate(`/blog/post/${post.id}`)}
      className="group relative overflow-hidden bg-[#1a1a1a] border border-white/[0.08] hover:border-[#ff1493]/50 transition-all cursor-pointer text-left"
      style={{ aspectRatio: "16/9" }}
    >
      {thumb && (
        <img
          src={thumb}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="font-futura font-bold text-white text-[11px] leading-tight line-clamp-2 group-hover:text-[#ff1493] transition-colors">
          {post.title}
        </p>
      </div>
    </button>
  )
})

// ─── Post Navigation Component ────────────────────────────────────────────

const PostNav = memo(({ post, direction }) => {
  const navigate = useNavigate()
  const isPrev = direction === "prev"
  
  return (
    <button
      onClick={() => navigate(`/blog/post/${post.id}`)}
      className="flex-1 p-3 bg-[#1a1a1a] border border-white/[0.08] hover:border-[#ff1493]/50 transition-all cursor-pointer group"
    >
      <div className={`flex items-center gap-2 ${isPrev ? "" : "flex-row-reverse"}`}>
        <span className="text-[#ff1493] text-xl font-bold group-hover:scale-110 transition-transform">
          {isPrev ? "‹" : "›"}
        </span>
        <div className={`flex-1 min-w-0 ${isPrev ? "text-left" : "text-right"}`}>
          <span className="text-[10px] font-futura uppercase tracking-wide text-white/30 block">
            {isPrev ? "Previous" : "Next"}
          </span>
          <p className="font-futura font-bold text-white/80 text-[12px] leading-tight line-clamp-1 group-hover:text-[#ff1493] transition-colors">
            {post.title}
          </p>
        </div>
      </div>
    </button>
  )
})

// ─── Main Modal Component ─────────────────────────────────────────────────

export default function BlogPostModal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  const [post, setPost] = useState(null)
  const [show, setShow] = useState(false)
  const [activeMedia, setActive] = useState(0)

  const allPosts = usePostsContext()

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "auto" }
  }, [])

  // Fade-in
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10)
    return () => clearTimeout(timer)
  }, [])

  // Load post
  useEffect(() => {
    fetch(`${API_URL}/api/blog/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject("Not found"))
      .then(data => setPost(data))
      .catch(() => navigate("/blog"))
  }, [id, API_URL, navigate])

  // Close handler
  const close = useCallback(() => {
    setShow(false)
    setTimeout(() => navigate(-1), 200)
  }, [navigate])

  // Keyboard navigation
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft" && activeMedia > 0) setActive(activeMedia - 1)
      if (e.key === "ArrowRight" && activeMedia < mediaList.length - 1) setActive(activeMedia + 1)
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [close, activeMedia])

  if (!post) return null

  const mediaList = buildMediaList(post)
  const currentIndex = allPosts.findIndex(p => p.id === post.id)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  const related = allPosts.filter(p =>
    p.id !== post.id && p.tags?.some(t => post.tags?.includes(t))
  )
  const morePosts = related.length ? related.slice(0, 4) : allPosts.slice(0, 4).filter(p => p.id !== post.id)

  const isUpdated = post.updatedAt && new Date(post.updatedAt) - new Date(post.date) > 86400000

  return (
    <>
      <style>{`
        .post-body {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          font-family: 'Futura', sans-serif;
        }
        .post-body h1, .post-body h2, .post-body h3 {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 900;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .post-body p { margin-bottom: 1em; }
        .post-body a {
          color: #ff1493;
          text-decoration: none;
          border-bottom: 1px solid #ff1493;
        }
        .post-body a:hover {
          color: #ff69b4;
          border-bottom-color: #ff69b4;
        }
        .post-body img {
          max-width: 100%;
          border-radius: 4px;
          margin: 1.5em 0;
        }
        .post-body ul, .post-body ol {
          margin-left: 1.5em;
          margin-bottom: 1em;
        }
        .post-body code {
          background: rgba(255, 20, 147, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
        }
        .post-body blockquote {
          border-left: 3px solid #ff1493;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: rgba(255, 255, 255, 0.5);
        }
        
        /* Custom scrollbar */
        .right-scroll::-webkit-scrollbar { width: 8px; }
        .right-scroll::-webkit-scrollbar-track { background: #0a0a0a; }
        .right-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .right-scroll::-webkit-scrollbar-thumb:hover { background: #444; }
        
        .thumb-strip::-webkit-scrollbar { height: 6px; }
        .thumb-strip::-webkit-scrollbar-track { background: #0a0a0a; }
        .thumb-strip::-webkit-scrollbar-thumb { background: #ff1493; border-radius: 3px; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black z-[9998] transition-opacity duration-200 ${
          show ? "opacity-95" : "opacity-0"
        }`}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-4 transition-all duration-200 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="relative w-full h-full md:max-w-[95vw] md:max-h-[95vh] md:h-auto bg-[#0a0a0a] border-0 md:border md:border-white/[0.1] shadow-2xl flex flex-col overflow-hidden">
          
          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="flex-shrink-0 bg-[#1a1a1a] border-b border-white/[0.08]">
            <div className="h-12 md:h-14 px-3 md:px-4 flex items-center justify-between gap-3">
              {/* Close button */}
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-[#ff1493] hover:text-[#ff1493] text-white/40 transition-all cursor-pointer text-lg font-bold flex-shrink-0"
              >
                ✕
              </button>

              {/* Title (hidden on mobile) */}
              <div className="hidden md:block flex-1 min-w-0 px-3">
                <span className="font-futura font-black text-white/60 text-xs uppercase tracking-[0.2em] block truncate">
                  {post.title}
                </span>
              </div>

              {/* Prev / Next */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {prevPost && (
                  <button
                    onClick={() => navigate(`/blog/post/${prevPost.id}`)}
                    title={prevPost.title}
                    className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-[#ff1493] hover:text-[#ff1493] text-white/30 transition-all cursor-pointer font-bold text-lg"
                  >
                    ‹
                  </button>
                )}
                {nextPost && (
                  <button
                    onClick={() => navigate(`/blog/post/${nextPost.id}`)}
                    title={nextPost.title}
                    className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-[#ff1493] hover:text-[#ff1493] text-white/30 transition-all cursor-pointer font-bold text-lg"
                  >
                    ›
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Body ───────────────────────────────────────────────────── */}
          <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
            {/* Desktop: side-by-side, Mobile: stacked */}
            <div className="flex flex-col md:flex-row h-full">
              
              {/* ══ MEDIA PANEL ═══════════════════════════════════════════ */}
              <div className="flex flex-col bg-black md:border-r md:border-white/[0.07] w-full md:w-[58%]">
                
                {/* Active player */}
                <div className="flex-shrink-0 md:flex-1 md:min-h-0 flex items-center justify-center bg-black overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  {mediaList.length > 0 ? (
                    <MediaEmbed item={mediaList[activeMedia] ?? mediaList[0]} />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-white/10 py-12">
                      <span className="text-5xl">✦</span>
                      <span className="font-futura text-xs uppercase tracking-widest">No media</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail strip (only when multiple) */}
                {mediaList.length > 1 && (
                  <div className="flex-shrink-0 bg-[#0a0a0a] border-t-2 border-[#ff1493]">
                    <div className="flex items-center gap-2 px-3 pt-2 pb-1">
                      <span className="font-futura font-black text-[#ff1493] text-[10px] uppercase tracking-[0.18em]">
                        {mediaList.length} {isVideo(mediaList[0]?.type) ? "Videos" : "Media"}
                      </span>
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-white/20 font-futura text-[10px]">
                        {activeMedia + 1} / {mediaList.length}
                      </span>
                    </div>
                    <div className="thumb-strip flex gap-2 px-3 pb-3 overflow-x-auto">
                      {mediaList.map((item, i) => {
                        const thumb = mediaThumb(item)
                        const isAct = i === activeMedia
                        const isVid = isVideo(item.type)
                        return (
                          <button
                            key={i}
                            onClick={() => setActive(i)}
                            style={{ width: 120, aspectRatio: "16/9", flexShrink: 0 }}
                            className={`relative overflow-hidden cursor-pointer transition-all duration-150 ${
                              isAct ? "ring-2 ring-[#ff1493]" : "opacity-45 hover:opacity-90"
                            }`}
                          >
                            {thumb ? (
                              <img
                                src={thumb}
                                alt=""
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center text-white/20 text-xl">
                                ▶
                              </div>
                            )}
                            <div className={`absolute inset-0 ${isAct ? "bg-black/10" : "bg-black/40"}`} />
                            {isVid && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                  className={`flex items-center justify-center transition-all ${
                                    isAct ? "w-8 h-8 bg-[#ff1493]" : "w-6 h-6 bg-[#ff1493]/70"
                                  }`}
                                >
                                  <span className="text-white font-black text-[9px] ml-px">▶</span>
                                </div>
                              </div>
                            )}
                            <div className={`absolute bottom-0 left-0 right-0 px-1.5 py-0.5 ${isAct ? "bg-[#ff1493]" : "bg-black/70"}`}>
                              <span className="font-futura font-black text-white text-[8px] uppercase tracking-wide">
                                {isAct ? "▶ Playing" : `#${i + 1} ${mediaLabel(item)}`}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ══ TEXT PANEL ════════════════════════════════════════════ */}
              <div className="right-scroll flex flex-col flex-1 min-w-0 overflow-y-auto">
                <div className="p-4 md:p-5 flex flex-col gap-4 md:gap-5">
                  
                  {/* ── Article header ── */}
                  <div className="pb-3 md:pb-4 border-b border-white/10">
                    {/* Tags + UPDATED badge */}
                    <div className="flex flex-wrap gap-1.5 mb-3 items-center">
                      {post.tags?.map(t => (
                        <span
                          key={t}
                          className="bg-[#ff1493] text-white text-[9px] font-black uppercase tracking-[0.18em] px-2 py-1 font-futura"
                        >
                          {t}
                        </span>
                      ))}
                      {isUpdated && (
                        <span className="flex items-center gap-1 bg-[#22c55e] text-white text-[9px] font-black uppercase tracking-[0.18em] px-2 py-1 animate-pulse font-futura">
                          ↑ Updated
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h1 className="font-futura font-black text-white text-xl md:text-2xl xl:text-3xl uppercase leading-[1.04] tracking-tight mb-3">
                      {post.title}
                    </h1>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-white/50 font-futura text-sm leading-relaxed border-l-2 border-[#ff1493] pl-3 mb-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] font-futura uppercase tracking-wide text-white/30">
                      <time>{post.date}</time>
                      {mediaList.length > 1 && (
                        <>
                          <span className="w-0.5 h-0.5 bg-white/20 rounded-full" />
                          <span>{mediaList.length} media</span>
                        </>
                      )}
                      {isUpdated && post.updatedAt && (
                        <>
                          <span className="w-0.5 h-0.5 bg-white/20 rounded-full" />
                          <span className="text-[#22c55e]">
                            updated {new Date(post.updatedAt).toLocaleDateString("en-US")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Body ── */}
                  <div className="flex-1">
                    {isUpdated && (
                      <div className="mb-3 flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/30 px-3 py-2">
                        <span className="text-[#22c55e] text-[10px] font-black uppercase tracking-widest font-futura">
                          ↑ Post updated — new content below
                        </span>
                      </div>
                    )}
                    {post.content ? (
                      <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                      <p className="text-white/15 font-futura italic text-sm">— No body text —</p>
                    )}
                  </div>

                  {/* ── Related posts ── */}
                  {morePosts.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-[#ff1493]" />
                        <span className="font-futura font-black text-[10px] uppercase tracking-[0.2em] text-white/40">
                          {related.length ? "Related" : "More Posts"}
                        </span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {morePosts.slice(0, 4).map(p => (
                          <RelatedCard key={p.id} post={p} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Telegram Comments ── */}
                  {post.telegramUrl && <TelegramComments telegramUrl={post.telegramUrl} />}

                  {/* ── Prev / Next ── */}
                  {(prevPost || nextPost) && (
                    <div className="flex gap-2 pt-2">
                      {prevPost && <PostNav post={prevPost} direction="prev" />}
                      {nextPost && <PostNav post={nextPost} direction="next" />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}