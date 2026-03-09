import { useEffect, useState, useRef } from "react"

const API_URL = import.meta.env.VITE_API_URL
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY

const headers = (extra = {}) => ({
  "x-admin-key": ADMIN_KEY,
  ...extra,
})

const TAGS = ["live", "construction", "parkramps", "bmx", "skate"]

const EMOJI_GROUPS = {
  "🏃 Спорт": ["🛹","🚵","🏂","⛷️","🏋️","🤸","🛼","🚴","🏄","🤾","🥇","🏆","🎯","💪","🔥"],
  "🔨 Стройка": ["🔨","🪚","🔧","🪛","📐","📏","🧱","🪵","⚙️","🛠️","🔩","🪤","🏗️","🧰","✏️"],
  "😊 Эмоции": ["😊","😎","🤙","👊","✌️","🙌","👏","🤩","😍","🥳","😤","💯","🔥","❤️","⚡"],
  "🌍 Места": ["🏙️","🌆","🏞️","🌄","🏖️","🌊","🏔️","🌿","🌳","🌟","☀️","🌙","⛅","🌈","🎆"],
  "📸 Медиа": ["📸","🎥","🎬","📹","🎞️","📡","🎙️","🎤","📻","💻","📱","🖥️","⌨️","🖱️","💾"],
}

function EmojiPicker({ onSelect, onClose }) {
  const [activeGroup, setActiveGroup] = useState(Object.keys(EMOJI_GROUPS)[0])
  const ref = useRef()

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  return (
    <div ref={ref} className="absolute z-50 bottom-10 left-0 bg-white border border-zinc-200 rounded-xl shadow-xl w-72 overflow-hidden">
      {/* Group tabs */}
      <div className="flex overflow-x-auto border-b border-zinc-100 bg-zinc-50">
        {Object.keys(EMOJI_GROUPS).map(group => (
          <button key={group} onClick={() => setActiveGroup(group)}
            className={`px-3 py-2 text-xs whitespace-nowrap transition-colors ${
              activeGroup === group ? "bg-white border-b-2 border-zinc-900 font-semibold" : "text-zinc-400 hover:text-zinc-700"
            }`}>
            {group.split(" ")[0]}
          </button>
        ))}
      </div>
      {/* Emojis */}
      <div className="p-3 grid grid-cols-8 gap-1">
        {EMOJI_GROUPS[activeGroup].map(emoji => (
          <button key={emoji} onClick={() => onSelect(emoji)}
            className="text-xl hover:bg-zinc-100 rounded-lg p-1 transition-colors leading-none">
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

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

// Textarea с emoji picker
function EmojiTextarea({ value, onChange, placeholder, className }) {
  const [showPicker, setShowPicker] = useState(false)
  const textareaRef = useRef()

  function insertEmoji(emoji) {
    const el = textareaRef.current
    const start = el.selectionStart
    const end = el.selectionEnd
    const newVal = value.slice(0, start) + emoji + value.slice(end)
    onChange(newVal)
    // Восстановить курсор после emoji
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + emoji.length, start + emoji.length)
    }, 0)
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className={className}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPicker(p => !p)}
        className="absolute bottom-2 right-2 text-lg hover:scale-110 transition-transform leading-none"
        title="Добавить эмодзи"
      >
        😊
      </button>
      {showPicker && (
        <EmojiPicker
          onSelect={emoji => { insertEmoji(emoji); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}

// Input с emoji picker
function EmojiInput({ value, onChange, placeholder, className }) {
  const [showPicker, setShowPicker] = useState(false)
  const inputRef = useRef()

  function insertEmoji(emoji) {
    const el = inputRef.current
    const start = el.selectionStart
    const end = el.selectionEnd
    const newVal = value.slice(0, start) + emoji + value.slice(end)
    onChange(newVal)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + emoji.length, start + emoji.length)
    }, 0)
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className={className}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPicker(p => !p)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-lg hover:scale-110 transition-transform leading-none"
      >
        😊
      </button>
      {showPicker && (
        <EmojiPicker
          onSelect={emoji => { insertEmoji(emoji); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}

function PostForm({ initial = {}, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    title: "", content: "", excerpt: "",
    date: new Date().toISOString().slice(0, 10),
    tags: [], cover: "", url: "",
    ...initial,
    tags: initial.tags || [],
  })
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function uploadFile(file) {
    setUploading(true)
    try {
      const data = new FormData()
      data.append("file", file)
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST", headers: headers(), body: data,
      })
      const json = await res.json()
      if (file.type.startsWith("video")) set("video", json.url)
      else set("cover", json.url)
    } catch (e) {
      alert("Ошибка загрузки: " + e.message)
    } finally {
      setUploading(false)
    }
  }

  function toggleTag(tag) {
    set("tags", form.tags.includes(tag)
      ? form.tags.filter(t => t !== tag)
      : [...form.tags, tag])
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Заголовок *</label>
        <EmojiInput
          className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          value={form.title} onChange={v => set("title", v)}
          placeholder="Заголовок поста"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Дата</label>
        <input type="date"
          className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          value={form.date} onChange={e => set("date", e.target.value)} />
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Теги</label>
        <div className="mt-1 flex gap-2 flex-wrap">
          {TAGS.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${
                form.tags.includes(tag)
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
              }`}>#{tag}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Обложка</label>
        <div className="mt-1 flex gap-2">
          <input
            className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            value={form.cover || ""} onChange={e => set("cover", e.target.value)}
            placeholder="URL или загрузи файл" />
          <button onClick={() => fileRef.current.click()} disabled={uploading}
            className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap">
            {uploading ? "⏳" : "📎 Загрузить"}
          </button>
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
            onChange={e => e.target.files[0] && uploadFile(e.target.files[0])} />
        </div>
        {form.cover && <img src={form.cover} className="mt-2 h-24 object-cover rounded-lg" />}
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">YouTube / Rumble URL</label>
        <input
          className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          value={form.url || ""} onChange={e => set("url", e.target.value)}
          placeholder="https://youtu.be/..." />
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Краткое описание</label>
        <EmojiInput
          className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          value={form.excerpt || ""} onChange={v => set("excerpt", v)}
          placeholder="Короткое описание для карточки"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Текст поста</label>
        <EmojiTextarea
          className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 h-36 resize-none"
          value={form.content || ""} onChange={v => set("content", v)}
          placeholder="Основной текст..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)} disabled={!form.title || loading}
          className="flex-1 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition disabled:opacity-40">
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
        <button onClick={onCancel}
          className="px-6 py-2.5 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition">
          Отмена
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch]   = useState("")
  const [activeTag, setActiveTag] = useState("all")
  const [authed, setAuthed]   = useState(false)
  const [keyInput, setKeyInput] = useState("")

  useEffect(() => { if (ADMIN_KEY) setAuthed(true) }, [])
  useEffect(() => { if (authed) loadPosts() }, [authed])

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/blog`)
      setPosts(await res.json())
    } finally { setLoading(false) }
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
      const id = form.id || form.title.toLowerCase().replace(/[^a-zа-яё0-9\s]/gi, "").trim().replace(/\s+/g, "-").slice(0, 50) + `-${Date.now()}`
      await fetch(`${API_URL}/api/blog${isNew ? "" : `/${id}`}`, {
        method: isNew ? "POST" : "PUT",
        headers: headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ ...form, id, source: "admin" }),
      })
      setEditing(null)
      setCreating(false)
      loadPosts()
    } finally { setSaving(false) }
  }

  const filtered = posts
    .filter(p => activeTag === "all" || p.tags?.includes(activeTag))
    .filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()))

  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <h1 className="text-2xl font-bold mb-6">Админ панель</h1>
          <input type="password"
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 mb-3 text-sm"
            placeholder="Admin key" value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            onKeyDown={e => {
              if (e.key !== "Enter") return
              if (!ADMIN_KEY) { alert("VITE_ADMIN_KEY не задан — передеплой Vercel"); return }
              keyInput === ADMIN_KEY ? setAuthed(true) : alert("Неверный ключ")
            }} />
          <button onClick={() => {
            if (!ADMIN_KEY) { alert("VITE_ADMIN_KEY не задан — передеплой Vercel"); return }
            keyInput === ADMIN_KEY ? setAuthed(true) : alert("Неверный ключ")
          }} className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition">
            Войти
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Блог · Админ</h1>
          <p className="text-xs text-zinc-400 mt-0.5">{posts.length} постов</p>
        </div>
        <button onClick={() => setCreating(true)}
          className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition">
          + Новый пост
        </button>
      </div>

      <div className="bg-white border-b border-zinc-100 px-6 py-3 flex gap-3 flex-wrap items-center">
        <input className="border border-zinc-200 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex gap-2 flex-wrap">
          {["all", ...TAGS].map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${
                activeTag === tag ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
              }`}>#{tag}</button>
          ))}
        </div>
      </div>

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

      {editing && (
        <Modal title="Редактировать пост" onClose={() => setEditing(null)}>
          <PostForm initial={editing} onSave={savePost} onCancel={() => setEditing(null)} loading={saving} />
        </Modal>
      )}

      {creating && (
        <Modal title="Новый пост" onClose={() => setCreating(false)}>
          <PostForm onSave={savePost} onCancel={() => setCreating(false)} loading={saving} />
        </Modal>
      )}
    </div>
  )
}