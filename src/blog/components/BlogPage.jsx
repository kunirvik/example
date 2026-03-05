

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

import { useEffect, useState, useRef, useCallback } from "react"
import BlogFeed from "./BlogFeed"
import SocialButtons from "../../SocialButtons/SocialButtons"

const PAGE_SIZE = 9  // сколько постов грузить за раз

export default function BlogPage() {
  const API_URL = import.meta.env.VITE_API_URL

  const [posts, setPosts]       = useState([])
  const [visible, setVisible]   = useState(PAGE_SIZE)
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const [activeTag, setActiveTag] = useState("all")

  const loaderRef = useRef(null)

  // Фильтрация + сортировка новые сверху
  const filtered = (activeTag === "all"
    ? posts
    : posts.filter(p => p.tags?.includes(activeTag))
  ).sort((a, b) => new Date(b.date) - new Date(a.date))

  const visiblePosts = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  // Загрузка постов
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/blog`)
        if (!res.ok) throw new Error("API error")
        const data = await res.json()
        setPosts(data)
      } catch (err) {
        console.error(err)
        setError("Не удалось загрузить блог")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Сброс пагинации при смене тега
  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [activeTag])

  // IntersectionObserver — подгружаем когда юзер доскроллил до конца
  const handleObserver = useCallback((entries) => {
    if (entries[0].isIntersecting && hasMore) {
      setVisible(v => v + PAGE_SIZE)
    }
  }, [hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [handleObserver])

  if (loading) return <p className="p-4 font-futura">Загрузка…</p>
  if (error)   return <p className="p-4 font-futura text-red-700">{error}</p>

  return (
    <>
      {/* CSS анимация */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="p-4">
        <SocialButtons />
        <h1 className="text-4xl font-extrabold pt-20 text-[#717171] font-futura mb-6 border-b-4 border-black inline-block">
          Блог
        </h1>

        {/* Теги */}
        <div className="flex gap-3 flex-wrap mb-6">
          {["all", "live", "construction", "parkramps", "bmx", "skate"].map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 rounded-full border cursor-pointer transition-colors
                ${activeTag === tag ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Посты */}
        <BlogFeed posts={visiblePosts} />

        {/* Sentinel для IntersectionObserver */}
        <div ref={loaderRef} className="h-10 flex items-center justify-center mt-4">
          {hasMore && (
            <span className="text-gray-400 text-sm animate-pulse">загрузка…</span>
          )}
        </div>
      </section>
    </>
  )
}