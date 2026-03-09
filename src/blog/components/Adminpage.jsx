import { useEffect, useState, useRef } from "react"

const API_URL   = import.meta.env.VITE_API_URL
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY

const headers = (extra = {}) => ({
  "x-admin-key": ADMIN_KEY,
  ...extra,
})

const PRESET_TAGS = ["live", "construction", "parkramps", "bmx", "skate"]

// ── Small helpers ─────────────────────────────────────────────────────────

function PostRow({ post, onEdit, onDelete }) {
  return (
    <div className="group flex items-start gap-4 p-4 border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
      {post.cover
        ? <img src={post.cover} className="w-16 h-16 object-cover rounded flex-shrink-0 bg-zinc-200" />
        : <div className="w-16 h-16 rounded flex-shrink-0 bg-zinc-100 flex items-center justify-center text-zinc-400 text-2xl">
            {post.type === "video" ? "▶" : "📄"}
          </div>
      }
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-zinc-900 truncate">{post.title}</p>
        <p className="text-xs text-zinc-400 mt-0.5">{post.date} · {post.source || "file"}</p>
        <div className="flex gap-1 mt-1 flex-wrap">
          {post.tags?.map(t => (
            <span key={t} className="text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">#{t}</span>
          ))}
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(post)}
          className="px-3 py-1.5 text-xs font-medium border border-zinc-300 rounded hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
          Изменить
        </button>
        <button onClick={() => onDelete(post.id)}
          className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 rounded hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
          Удалить
        </button>
      </div>
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-500 transition">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ── Post form ─────────────────────────────────────────────────────────────

function PostForm({ initial = {}, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    title:   "",
    content: "",
    excerpt: "",
    date:    new Date().toISOString().slice(0, 10),
    tags:    [],
    cover:   "",
    url:     "",
    videos:  [],
    ...initial,
    tags:   initial.tags   || [],
    videos: initial.videos || [],
  })

  const [uploading, setUploading] = useState(false)
  // For the custom tag input
  const [customTagInput, setCustomTagInput] = useState("")
  // For the new video URL input
  const [videoInput, setVideoInput] = useState("")

  const fileRef = useRef()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // ── File upload ───────────────────────────────────────────────────────

  async function uploadFile(file) {
    setUploading(true)
    try {
      const data = new FormData()
      data.append("file", file)
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: headers(),
        body: data,
      })
      const json = await res.json()
      if (file.type.startsWith("video")) {
        // add to videos array
        set("videos", [...form.videos, json.url])
      } else {
        set("cover", json.url)
      }
    } catch (e) {
      alert("Ошибка загрузки: " + e.message)
    } finally {
      setUploading(false)
    }
  }

  // ── Tags ──────────────────────────────────────────────────────────────

  function toggleTag(tag) {
    set("tags", form.tags.includes(tag)
      ? form.tags.filter(t => t !== tag)
      : [...form.tags, tag])
  }

  function addCustomTag() {
    const tag = customTagInput.trim().toLowerCase().replace(/[^a-zа-яё0-9_-]/gi, "")
    if (!tag || form.tags.includes(tag)) return setCustomTagInput("")
    set("tags", [...form.tags, tag])
    setCustomTagInput("")
  }

  // ── Videos ────────────────────────────────────────────────────────────

  function addVideoUrl() {
    const url = videoInput.trim()
    if (!url || form.videos.includes(url)) return setVideoInput("")
    set("videos", [...form.videos, url])
    setVideoInput("")
  }

  function removeVideo(url) {
    set("videos", form.videos.filter(v => v !== url))
  }

  function getVideoThumb(url) {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
    if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
    return null
  }

  function getVideoLabel(url) {
    if (url.includes("youtube") || url.includes("youtu.be")) return "YouTube"
    if (url.includes("rumble"))  return "Rumble"
    if (/\.(mp4|webm)/.test(url)) return "MP4"
    return "Video"
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">

      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Заголовок *</label>
        <input className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          value={form.title} onChange={e => set("title", e.target.value)} placeholder="Заголовок поста" />
      </div>

      {/* Date */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Дата</label>
        <input type="date" className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          value={form.date} onChange={e => set("date", e.target.value)} />
      </div>

      {/* Tags */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Теги</label>

        {/* Preset tags */}
        <div className="mt-1.5 flex gap-2 flex-wrap">
          {PRESET_TAGS.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)} type="button"
              className={`px-3 py-1 rounded-full text-xs border transition-all ${
                form.tags.includes(tag)
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
              }`}>
              #{tag}
            </button>
          ))}
        </div>

        {/* Custom tags already added (not in presets) */}
        {form.tags.filter(t => !PRESET_TAGS.includes(t)).length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {form.tags.filter(t => !PRESET_TAGS.includes(t)).map(tag => (
              <span key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-50 border border-blue-200 text-blue-700">
                #{tag}
                <button onClick={() => toggleTag(tag)} type="button"
                  className="ml-0.5 hover:text-red-500 font-bold leading-none">×</button>
              </span>
            ))}
          </div>
        )}

        {/* Add custom tag */}
        <div className="mt-2 flex gap-2">
          <input
            className="flex-1 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            value={customTagInput}
            onChange={e => setCustomTagInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
            placeholder="Новый тег (Enter для добавления)"
          />
          <button onClick={addCustomTag} type="button"
            className="px-3 py-1.5 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap">
            + Добавить
          </button>
        </div>
      </div>

      {/* Cover */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Обложка</label>
        <div className="mt-1 flex gap-2">
          <input className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            value={form.cover || ""} onChange={e => set("cover", e.target.value)} placeholder="URL обложки" />
          <button onClick={() => fileRef.current.click()} type="button"
            className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap"
            disabled={uploading}>
            {uploading ? "⏳" : "📎 Файл"}
          </button>
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
            onChange={e => e.target.files[0] && uploadFile(e.target.files[0])} />
        </div>
        {form.cover && <img src={form.cover} className="mt-2 h-24 object-cover rounded-lg" />}
      </div>

      {/* Videos (multiple) */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          Видео
          <span className="ml-1 text-zinc-400 font-normal normal-case">(YouTube, Rumble, mp4 — можно несколько)</span>
        </label>

        {/* Existing videos list */}
        {form.videos.length > 0 && (
          <div className="mt-2 space-y-2">
            {form.videos.map((url, i) => {
              const thumb = getVideoThumb(url)
              const label = getVideoLabel(url)
              return (
                <div key={i} className="flex items-center gap-3 p-2 border border-zinc-200 rounded-lg bg-zinc-50">
                  {thumb
                    ? <img src={thumb} className="w-14 h-10 object-cover rounded flex-shrink-0" />
                    : <div className="w-14 h-10 bg-zinc-200 rounded flex-shrink-0 flex items-center justify-center text-zinc-400 text-lg">▶</div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">{label}</p>
                    <p className="text-xs text-zinc-600 truncate">{url}</p>
                  </div>
                  <button onClick={() => removeVideo(url)} type="button"
                    className="text-red-400 hover:text-red-600 text-xs font-bold px-2 py-1 flex-shrink-0">
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Single URL field (legacy — maps to post.url for the first one) */}
        <div className="mt-2">
          <p className="text-[10px] text-zinc-400 mb-1">Основной URL (для карточки)</p>
          <input className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            value={form.url || ""} onChange={e => set("url", e.target.value)} placeholder="https://youtu.be/..." />
        </div>

        {/* Add extra video */}
        <div className="mt-2">
          <p className="text-[10px] text-zinc-400 mb-1">Добавить ещё видео</p>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              value={videoInput}
              onChange={e => setVideoInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addVideoUrl())}
              placeholder="https://youtu.be/... или ссылка на mp4"
            />
            <button onClick={addVideoUrl} type="button"
              className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap">
              + Добавить
            </button>
          </div>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Краткое описание</label>
        <input className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          value={form.excerpt || ""} onChange={e => set("excerpt", e.target.value)} placeholder="Короткое описание для карточки" />
      </div>

      {/* Content */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Текст поста</label>
        <textarea className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 h-36 resize-none"
          value={form.content || ""} onChange={e => set("content", e.target.value)} placeholder="Основной текст (поддерживает Markdown)..." />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)} disabled={!form.title || loading} type="button"
          className="flex-1 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition disabled:opacity-40">
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
        <button onClick={onCancel} type="button"
          className="px-6 py-2.5 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition">
          Отмена
        </button>
      </div>
    </div>
  )
}

// ── Admin page ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch]   = useState("")
  const [activeTag, setActiveTag] = useState("all")

  // ── Auth ──────────────────────────────────────────────────────────────
  // FIX: no auto-login — user must type the password manually
  const [authed, setAuthed]   = useState(false)
  const [keyInput, setKeyInput] = useState("")
  const [authError, setAuthError] = useState(false)

  function tryLogin() {
    if (keyInput === ADMIN_KEY) {
      setAuthed(true)
      setAuthError(false)
    } else {
      setAuthError(true)
      setKeyInput("")
    }
  }

  useEffect(() => {
    if (authed) loadPosts()
  }, [authed])

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/blog`)
      const data = await res.json()
      setPosts(data)
    } finally {
      setLoading(false)
    }
  }

  async function deletePost(id) {
    if (!confirm("Удалить пост?")) return
    await fetch(`${API_URL}/api/blog/${id}`, { method: "DELETE", headers: headers() })
    setPosts(p => p.filter(x => x.id !== id))
  }

  async function savePost(form) {
    setSaving(true)
    try {
      const isNew = !form.id
      const id = form.id || form.title
        .toLowerCase()
        .replace(/[^a-zа-яё0-9\s]/gi, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 50) + `-${Date.now()}`
      const body = { ...form, id, source: "admin" }

      await fetch(`${API_URL}/api/blog${isNew ? "" : `/${id}`}`, {
        method: isNew ? "POST" : "PUT",
        headers: headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(body),
      })
      setEditing(null)
      setCreating(false)
      loadPosts()
    } finally {
      setSaving(false)
    }
  }

  // Collect all unique tags from posts (including custom ones from DB)
  const allTags = ["all", ...new Set([...PRESET_TAGS, ...posts.flatMap(p => p.tags || [])])]

  const filtered = posts
    .filter(p => activeTag === "all" || p.tags?.includes(activeTag))
    .filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()))

  // ── Login screen ──────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <h1 className="text-2xl font-bold mb-2">Админ панель</h1>
          <p className="text-sm text-zinc-400 mb-6">Введите пароль для входа</p>
          {authError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
              Неверный пароль
            </p>
          )}
          <input
            type="password"
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            placeholder="Введите пароль"
            value={keyInput}
            autoFocus
            onChange={e => { setKeyInput(e.target.value); setAuthError(false) }}
            onKeyDown={e => e.key === "Enter" && tryLogin()}
          />
          <button
            onClick={tryLogin}
            className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition">
            Войти
          </button>
        </div>
      </div>
    )
  }

  // ── Main admin UI ─────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Блог · Админ</h1>
          <p className="text-xs text-zinc-400 mt-0.5">{posts.length} постов</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setAuthed(false); setKeyInput("") }}
            className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-100 transition">
            Выйти
          </button>
          <button onClick={() => setCreating(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition">
            + Новый пост
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-zinc-100 px-6 py-3 flex gap-3 flex-wrap items-center">
        <input
          className="border border-zinc-200 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          placeholder="Поиск..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {allTags.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${
                activeTag === tag
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
              }`}>
              {tag === "all" ? "all" : `#${tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* Posts list */}
      <div className="max-w-4xl mx-auto mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
        {loading
          ? <div className="p-12 text-center text-zinc-400">Загрузка...</div>
          : filtered.length === 0
            ? <div className="p-12 text-center text-zinc-400">Постов не найдено</div>
            : filtered.map(post => (
                <PostRow key={post.id} post={post} onEdit={setEditing} onDelete={deletePost} />
              ))
        }
      </div>

      {/* Edit modal */}
      {editing && (
        <Modal title="Редактировать пост" onClose={() => setEditing(null)}>
          <PostForm initial={editing} onSave={savePost} onCancel={() => setEditing(null)} loading={saving} />
        </Modal>
      )}

      {/* Create modal */}
      {creating && (
        <Modal title="Новый пост" onClose={() => setCreating(false)}>
          <PostForm onSave={savePost} onCancel={() => setCreating(false)} loading={saving} />
        </Modal>
      )}
    </div>
  )
}