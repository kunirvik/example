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

// ─── Top Media Player ─────────────────────────────────────────────────────────
// All media in one unified block at the top of the page.
// Single item → just the player. Multiple → player + thumbnail strip below.

function mediaThumb(item) {
  if (item.type === "youtube") return `https://img.youtube.com/vi/${getYoutubeID(item.url)}/hqdefault.jpg`
  if (item.type === "image")   return item.url
  return null
}
function mediaLabel(item) {
  if (item.type === "youtube") return "YT"
  if (item.type === "rumble")  return "RBL"
  if (item.type === "mp4")     return "VID"
  return "IMG"
}
function isVideo(t) { return t === "youtube" || t === "mp4" || t === "rumble" }

function TopMediaPlayer({ items, activeIndex, onSelect, postTitle }) {
  const active  = items[activeIndex] ?? items[0]
  const actIdx  = Math.max(0, activeIndex)
  const hasMany = items.length > 1

  return (
    <div className="w-full bg-black">

      {/* ── Main player ── */}
      <div className="w-full max-w-6xl mx-auto">
        {active.type === "image" ? (
          <img
            src={active.url}
            alt={postTitle}
            className="w-full h-auto block"
            style={{ maxHeight: "72vh", objectFit: "contain", objectPosition: "center" }}
            loading="eager"
          />
        ) : (
          <MediaEmbed item={active} />
        )}
      </div>

      {/* ── Strip (only when multiple items) ── */}
      {hasMany && (
        <div className="border-t-2 border-[#ff6b00] bg-[#0d0d0d]">

          {/* strip header */}
          <div className="max-w-6xl mx-auto px-3 pt-2 pb-1 flex items-center gap-2">
            <span className="font-['Barlow_Condensed'] font-black text-[#ff6b00] text-[10px] uppercase tracking-[0.2em]">
              {isVideo(items[0]?.type) ? "▶ " : ""}
              {items.length} {isVideo(items[0]?.type) ? "Videos" : "Media"} in this post
            </span>
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-[10px] font-['Barlow'] uppercase tracking-wide">
              {actIdx + 1} / {items.length}
            </span>
          </div>

          {/* scrollable thumbnail row */}
          <div
            className="max-w-6xl mx-auto px-3 pb-3 flex gap-2 overflow-x-auto"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#ff6b00 #1a1a1a" }}
          >
            {items.map((item, i) => {
              const thumb  = mediaThumb(item)
              const isAct  = i === actIdx
              const isVid  = isVideo(item.type)
              return (
                <button
                  key={i}
                  onClick={() => onSelect(i)}
                  title={`Item ${i + 1}`}
                  className={`group relative flex-shrink-0 overflow-hidden cursor-pointer transition-all duration-150 ${
                    isAct
                      ? "ring-2 ring-[#ff6b00]"
                      : "opacity-50 hover:opacity-90"
                  }`}
                  style={{ width: 148, aspectRatio: "16/9" }}
                >
                  {/* thumb */}
                  {thumb ? (
                    <img src={thumb} alt="" loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                      <span className="text-white/20 text-2xl">▶</span>
                    </div>
                  )}

                  {/* dark overlay */}
                  <div className={`absolute inset-0 transition-colors ${isAct ? "bg-black/10" : "bg-black/40 group-hover:bg-black/20"}`} />

                  {/* play icon */}
                  {isVid && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`flex items-center justify-center transition-all ${isAct ? "w-9 h-9 bg-[#ff6b00]" : "w-7 h-7 bg-[#ff6b00]/75 group-hover:w-9 group-hover:h-9 group-hover:bg-[#ff6b00]"}`}>
                        <span className="text-white font-black text-[10px] ml-px">▶</span>
                      </div>
                    </div>
                  )}

                  {/* number + type label */}
                  <div className={`absolute bottom-0 left-0 right-0 flex items-center justify-between px-1.5 py-1 ${isAct ? "bg-[#ff6b00]" : "bg-black/70"}`}>
                    <span className="font-['Barlow_Condensed'] font-black text-white text-[9px] uppercase tracking-wider">
                      {isAct ? "▶ Playing" : `#${i + 1}`}
                    </span>
                    <span className="font-['Barlow_Condensed'] font-black text-white/60 text-[9px] uppercase">
                      {mediaLabel(item)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
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

        {/* ── Top media player (all media in one place) ───────────────────── */}
        {mediaList.length > 0 && (
          <TopMediaPlayer
            items={mediaList}
            activeIndex={activeMedia}
            onSelect={setActive}
            postTitle={post.title}
          />
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