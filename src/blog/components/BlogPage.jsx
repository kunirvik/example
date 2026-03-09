

// import { useEffect, useState } from "react"
// import BlogFeed from "./BlogFeed"
// import SocialButtons from "../../SocialButtons/SocialButtons";

// export default function BlogPage() {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [posts, setPosts] = useState([])
//   const [error, setError] = useState(null)
//   const [loading, setLoading] = useState(true)

//   const [activeTag, setActiveTag] = useState("all")
//   const filteredPosts =
//   activeTag === "all"
//     ? posts
//     : posts.filter(post => post.tags?.includes(activeTag))
 


//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await fetch(`${API_URL}/api/blog`)
//         if (!res.ok) throw new Error("API error")
//         const data = await res.json()
//         setPosts(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
//       } catch (err) {
//         console.error(err)
//         setError("Не удалось загрузить блог")
//       } finally {
//         setLoading(false)
//       }
//     }
//     load()
//   }, [])

//   if (loading) return <p className="p-4 font-futura">Загрузка…</p>
//   if (error) return <p className="p-4 font-futura text-red-700">{error}</p>

//   return (
//     <section className="p-4">
// <SocialButtons></SocialButtons>
//       <h1 className="text-4xl font-extrabold pt-20 text-[#717171] font-futura mb-6 border-b-4 border-black inline-block">Блог</h1>
//       <div className="flex gap-3  flex-wrap mb-6">
//   {["all", "live", "construction", "parkramps",  "bmx", "skate"].map(tag => (
//     <button
//       key={tag}
//       onClick={() => setActiveTag(tag)}
//       className={`px-3 py-1 rounded-full border cursor-pointer
//         ${activeTag === tag ? "bg-black text-white" : "bg-white"}
//       `}
//     >
//       #{tag}
//     </button>
//   ))} 
// </div>

//       <BlogFeed posts={filteredPosts} />
//     </section>
//   )
// }
import { useEffect, useState, useRef, useCallback, createContext, useContext } from "react"
import BlogFeed from "./BlogFeed"
import { HeroCard, CompactCard } from "./BlogCard"
import SocialButtons from "../../SocialButtons/SocialButtons"

const PAGE_SIZE = 12
const TAGS = ["all", "live", "construction", "parkramps", "bmx", "skate"]

export const PostsContext = createContext([])
export function usePostsContext() { return useContext(PostsContext) }

export default function BlogPage() {
  const API_URL = import.meta.env.VITE_API_URL

  const [posts, setPosts]         = useState([])
  const [visible, setVisible]     = useState(PAGE_SIZE)
  const [error, setError]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [activeTag, setActiveTag] = useState("all")

  const loaderRef = useRef(null)

  const filtered = (activeTag === "all"
    ? posts
    : posts.filter(p => p.tags?.includes(activeTag))
  ).sort((a, b) => new Date(b.date) - new Date(a.date))

  const hero         = filtered[0] || null
  const sidebarPosts = filtered.slice(1, 6)       // 5 compact posts in sidebar
  const gridPosts    = filtered.slice(6, visible)  // rest in grid
  const hasMore      = visible < filtered.length

  useEffect(() => {
    fetch(`${API_URL}/api/blog`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setPosts(data))
      .catch(() => setError("Не удалось загрузить блог"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { setVisible(PAGE_SIZE) }, [activeTag])

  const handleObserver = useCallback((entries) => {
    if (entries[0].isIntersecting && hasMore) setVisible(v => v + PAGE_SIZE)
  }, [hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [handleObserver])

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin" />
        <span className="font-['Barlow_Condensed'] text-white/30 text-sm uppercase tracking-widest">Loading</span>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center">
      <p className="text-red-400 font-['Barlow']">{error}</p>
    </div>
  )

  return (
    <PostsContext.Provider value={filtered}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');

        @keyframes pbFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Thin scrollbar for dark theme */
        * { scrollbar-width: thin; scrollbar-color: #333 transparent; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #ff6b00; }
      `}</style>

      <div className="min-h-screen bg-[#111] text-white">
        <SocialButtons />

        {/* ── Top nav strip ──────────────────────────────────────────────── */}
        <div className="border-b border-white/10 bg-[#0d0d0d] sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto py-0 scrollbar-none"
              style={{ scrollbarWidth: "none" }}>
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`flex-shrink-0 px-4 py-3.5 text-[11px] font-['Barlow_Condensed'] font-black uppercase tracking-[0.15em] border-b-2 transition-all duration-150 cursor-pointer ${
                    activeTag === tag
                      ? "border-[#ff6b00] text-[#ff6b00]"
                      : "border-transparent text-white/40 hover:text-white hover:border-white/20"
                  }`}
                >
                  {tag === "all" ? "All Posts" : tag}
                </button>
              ))}

              <div className="ml-auto flex-shrink-0 pl-4 py-3 border-l border-white/10">
                <span className="font-['Barlow'] text-white/20 text-[11px] uppercase tracking-wide">
                  {filtered.length} posts
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-4 pb-16">

          {/* ── Hero + Sidebar layout ──────────────────────────────────── */}
          {hero && (
            <div className="flex gap-1 mb-1">

              {/* Hero — takes ~70% width on desktop */}
              <div className="flex-1 min-w-0">
                <HeroCard post={hero} />
              </div>

              {/* Sidebar — 5 compact posts */}
              {sidebarPosts.length > 0 && (
                <div className="w-[280px] flex-shrink-0 bg-[#161616] border border-white/[0.06] hidden lg:flex flex-col">
                  <div className="px-3 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-[#ff6b00]" />
                    <span className="font-['Barlow_Condensed'] font-black text-[11px] uppercase tracking-[0.18em] text-white/60">
                      Latest
                    </span>
                  </div>
                  <div className="px-2 flex-1 overflow-hidden">
                    {sidebarPosts.map((post, i) => (
                      <CompactCard key={post.id} post={post} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Section divider ─────────────────────────────────────────── */}
          {gridPosts.length > 0 && (
            <div className="flex items-center gap-3 mb-3 mt-6">
              <div className="w-1 h-5 bg-[#ff6b00]" />
              <span className="font-['Barlow_Condensed'] font-black text-[11px] uppercase tracking-[0.2em] text-white/50">
                More Posts
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
          )}

          {/* ── Main grid ───────────────────────────────────────────────── */}
          <BlogFeed posts={gridPosts} />

          {/* ── Infinite scroll sentinel ────────────────────────────────── */}
          <div ref={loaderRef} className="h-16 flex items-center justify-center mt-6">
            {hasMore && (
              <div className="flex items-center gap-3">
                <div className="h-px w-16 bg-white/10" />
                <span className="font-['Barlow_Condensed'] text-white/20 text-xs uppercase tracking-widest animate-pulse">
                  Loading more
                </span>
                <div className="h-px w-16 bg-white/10" />
              </div>
            )}
          </div>

        </div>
      </div>
    </PostsContext.Provider>
  )
}


// import { useEffect, useState, useRef, useCallback } from "react"
// import BlogFeed from "./BlogFeed"
// import SocialButtons from "../../SocialButtons/SocialButtons"

// const PAGE_SIZE = 9  // сколько постов грузить за раз

// export default function BlogPage() {
//   const API_URL = import.meta.env.VITE_API_URL

//   const [posts, setPosts]       = useState([])
//   const [visible, setVisible]   = useState(PAGE_SIZE)
//   const [error, setError]       = useState(null)
//   const [loading, setLoading]   = useState(true)
//   const [activeTag, setActiveTag] = useState("all")

//   const loaderRef = useRef(null)

//   // Фильтрация + сортировка новые сверху
//   const filtered = (activeTag === "all"
//     ? posts
//     : posts.filter(p => p.tags?.includes(activeTag))
//   ).sort((a, b) => new Date(b.date) - new Date(a.date))

//   const visiblePosts = filtered.slice(0, visible)
//   const hasMore = visible < filtered.length

//   // Загрузка постов
//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await fetch(`${API_URL}/api/blog`)
//         if (!res.ok) throw new Error("API error")
//         const data = await res.json()
//         setPosts(data)
//       } catch (err) {
//         console.error(err)
//         setError("Не удалось загрузить блог")
//       } finally {
//         setLoading(false)
//       }
//     }
//     load()
//   }, [])

//   // Сброс пагинации при смене тега
//   useEffect(() => {
//     setVisible(PAGE_SIZE)
//   }, [activeTag])

//   // IntersectionObserver — подгружаем когда юзер доскроллил до конца
//   const handleObserver = useCallback((entries) => {
//     if (entries[0].isIntersecting && hasMore) {
//       setVisible(v => v + PAGE_SIZE)
//     }
//   }, [hasMore])

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 })
//     if (loaderRef.current) observer.observe(loaderRef.current)
//     return () => observer.disconnect()
//   }, [handleObserver])

//   if (loading) return <p className="p-4 font-futura">Загрузка…</p>
//   if (error)   return <p className="p-4 font-futura text-red-700">{error}</p>

//   return (
//     <>
//       {/* CSS анимация */}
//       <style>{`
//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(24px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>

//       <section className="p-4">
//         <SocialButtons />
//         <h1 className="text-4xl font-extrabold pt-20 text-[#717171] font-futura mb-6 border-b-4 border-black inline-block">
//           Блог
//         </h1>

//         {/* Теги */}
//         <div className="flex gap-3 flex-wrap mb-6">
//           {["all", "live", "construction", "parkramps", "bmx", "skate"].map(tag => (
//             <button
//               key={tag}
//               onClick={() => setActiveTag(tag)}
//               className={`px-3 py-1 rounded-full border cursor-pointer transition-colors
//                 ${activeTag === tag ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
//             >
//               #{tag}
//             </button>
//           ))}
//         </div>

//         {/* Посты */}
//         <BlogFeed posts={visiblePosts} />

//         {/* Sentinel для IntersectionObserver */}
//         <div ref={loaderRef} className="h-10 flex items-center justify-center mt-4">
//           {hasMore && (
//             <span className="text-gray-400 text-sm animate-pulse">загрузка…</span>
//           )}
//         </div>
//       </section>
//     </>
//   )
// }


