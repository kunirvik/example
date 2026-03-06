

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
import SocialButtons from "../../SocialButtons/SocialButtons"

const PAGE_SIZE = 9
const TAGS = ["all", "live", "construction", "parkramps", "bmx", "skate"]

// Share full sorted post list with modal for prev/next navigation
export const PostsContext = createContext([])
export function usePostsContext() { return useContext(PostsContext) }

export default function BlogPage() {
  const API_URL = import.meta.env.VITE_API_URL

  const [posts, setPosts]         = useState([])
  const [visible, setVisible]     = useState(PAGE_SIZE)
  const [error, setError]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [activeTag, setActiveTag] = useState("all")
  const [view, setView]           = useState("grid")

  const loaderRef = useRef(null)

  const filtered = (activeTag === "all"
    ? posts
    : posts.filter(p => p.tags?.includes(activeTag))
  ).sort((a, b) => new Date(b.date) - new Date(a.date))

  const visiblePosts = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="font-['Playfair_Display'] text-2xl text-black/30 animate-pulse">Loading…</span>
    </div>
  )
  if (error) return <p className="p-8 text-red-700">{error}</p>

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  })

  return (
    <PostsContext.Provider value={filtered}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .my-masonry-grid { display: flex; gap: 20px; }
        .my-masonry-grid_column { display: flex; flex-direction: column; }
        .newspaper-rule {
          background: repeating-linear-gradient(90deg, black 0px, black 1px, transparent 1px, transparent 4px);
          height: 3px;
        }
      `}</style>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <SocialButtons />

        {/* Masthead */}
        <div className="pt-20 pb-0 text-center border-b-4 border-black mb-2">
          <p className="font-mono text-[10px] tracking-widest uppercase text-black/40 mb-1">{today}</p>
          <h1 className="font-['Playfair_Display'] font-black text-6xl md:text-8xl tracking-tight leading-none mb-2">
            THE BLOG
          </h1>
          <p className="font-['EB_Garamond'] italic text-base text-black/50 mb-3">
            All the news from the park — dispatches, builds & riding
          </p>
        </div>

        <div className="newspaper-rule mb-4" />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 text-[11px] font-black tracking-widest uppercase border transition-colors cursor-pointer
                  ${activeTag === tag ? "bg-black text-white border-black" : "bg-white text-black border-black/30 hover:border-black"}`}>
                {tag === "all" ? "ALL" : `#${tag}`}
              </button>
            ))}
          </div>

          <div className="flex border border-black/20 overflow-hidden">
            <button onClick={() => setView("grid")} title="Grid"
              className={`px-3 py-1.5 transition-colors cursor-pointer
                ${view === "grid" ? "bg-black text-white" : "bg-white text-black hover:bg-black/5"}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="0" width="6" height="6"/><rect x="10" y="0" width="6" height="6"/>
                <rect x="0" y="10" width="6" height="6"/><rect x="10" y="10" width="6" height="6"/>
              </svg>
            </button>
            <button onClick={() => setView("list")} title="List"
              className={`px-3 py-1.5 border-l border-black/20 transition-colors cursor-pointer
                ${view === "list" ? "bg-black text-white" : "bg-white text-black hover:bg-black/5"}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="1" width="16" height="2"/><rect x="0" y="7" width="16" height="2"/>
                <rect x="0" y="13" width="16" height="2"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[10px] tracking-widest text-black/35 uppercase">
            {filtered.length} dispatch{filtered.length !== 1 ? "es" : ""}
          </span>
          <div className="flex-1 border-t border-dashed border-black/15" />
        </div>

        <BlogFeed posts={visiblePosts} view={view} />

        <div ref={loaderRef} className="h-12 flex items-center justify-center mt-4">
          {hasMore && (
            <span className="font-['EB_Garamond'] italic text-black/30 text-sm animate-pulse">
              — more dispatches —
            </span>
          )}
        </div>
      </section>
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


