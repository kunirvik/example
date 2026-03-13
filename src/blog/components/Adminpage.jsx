import { useEffect, useState, useRef, useCallback } from "react"

const API_URL   = import.meta.env.VITE_API_URL
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY

const headers = (extra = {}) => ({ "x-admin-key": ADMIN_KEY, ...extra })

const TAGS = ["live", "construction", "parkramps", "bmx", "skate"]

// ─── Emoji dataset ────────────────────────────────────────────────────────────

const EMOJI_CATS = [
  { id: "recent",     icon: "🕐", label: "Недавние",   emojis: [] },
  { id: "smileys",    icon: "😀", label: "Смайлы",     emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😚","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","☹️","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"] },
  { id: "gestures",   icon: "👋", label: "Жесты",      emojis: ["👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💅","💪","🦾","👀","👅","👄","💋"] },
  { id: "animals",    icon: "🐶", label: "Животные",   emojis: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐒","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🦋","🐌","🐞","🐜","🕷️","🦂","🐢","🐍","🦎","🐙","🦑","🐬","🐳","🐋","🦈","🦭","🐊","🐅","🐆","🦓","🦍","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🐐","🦌","🐕","🐩","🐈"] },
  { id: "food",       icon: "🍕", label: "Еда",        emojis: ["🍎","🍊","🍋","🍇","🍓","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🥑","🍆","🥦","🥬","🥒","🌶️","🧄","🧅","🥔","🌽","🥕","🥗","🥙","🌮","🌯","🍔","🍟","🍕","🌭","🥪","🥚","🍳","🥘","🍲","🥣","🍿","🧈","🥞","🧇","🥐","🥖","🥨","🧀","🍞","🥓","🥩","🍗","🍖","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍩","🍪","🍦","🍧","🍨","🧃","🥤","🧋","☕","🍵","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾"] },
  { id: "travel",     icon: "✈️", label: "Транспорт",  emojis: ["🚗","🚕","🚙","🛻","🚌","🏎️","🚓","🚑","🚒","🛵","🏍️","🚲","🛴","🛹","🛼","⛵","🚤","🛳️","🚢","✈️","🛩️","🚁","🚀","🛸","🪐","🌍","🌎","🌏","🏔️","⛰️","🌋","🏕️","🏖️","🏜️","🏝️","🏟️","🏛️","🏗️","🏠","🏢","🏥","🏦","🏨","🏪","🏫","🏬","🏭","🏯","🏰","🗼","🗽","⛩️","🕌","⛪"] },
  { id: "activities", icon: "⚽", label: "Спорт",      emojis: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🎱","🏓","🏸","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","⛳","🎯","🏹","🎣","🤿","🥌","🎿","⛷️","🏂","🪂","🏋️","🤼","🤸","🤺","🤾","🏌️","🏇","🧘","🎪","🎭","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🎻","🎲","♟️","🎯","🎳","🎮","🎰","🧩"] },
  { id: "symbols",    icon: "❤️", label: "Символы",    emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","❣️","💕","💞","💓","💗","💖","💘","💝","💟","✅","❌","⭕","🔥","💥","⚡","🌟","⭐","🌙","☀️","🌈","❄️","🌊","💫","✨","🎉","🎊","🎈","🏆","🥇","🥈","🥉","🎖️","🏅","🎗️","🎀","🎁","💯","🔑","🗝️","🔒","🔓","💡","🔔","🔕","📢","📣","💬","💭","🗯️","📌","📍","🗺️","🧭","⏰","⌛","⏳","📅","📆","📊","📈","📉","🔍","🔎","📝","✏️","🖊️","📌","🔗","📎","✂️","🗑️"] },
]

const RECENT_KEY = "ap_emoji_recent"
const MAX_RECENT = 24

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]") } catch { return [] }
}
function saveRecent(arr) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(arr)) } catch {}
}

// ─── Emoji Picker ─────────────────────────────────────────────────────────────

function EmojiPicker({ onSelect, onClose, anchor = "bottom" }) {
  const [search, setSearch]   = useState("")
  const [activeCat, setActive] = useState("smileys")
  const [recent, setRecent]   = useState(getRecent)
  const searchRef = useRef(null)
  const bodyRef   = useRef(null)
  const wrapRef   = useRef(null)

  useEffect(() => { searchRef.current?.focus() }, [])

  // Close on outside click
  useEffect(() => {
    const fn = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) onClose() }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [onClose])

  const pick = useCallback((emoji) => {
    const next = [emoji, ...recent.filter(e => e !== emoji)].slice(0, MAX_RECENT)
    setRecent(next); saveRecent(next)
    onSelect(emoji)
  }, [recent, onSelect])

  const q = search.trim().toLowerCase()
  const allEmojis = EMOJI_CATS.flatMap(c => c.id === "recent" ? [] : c.emojis)

  const cats = EMOJI_CATS.map(c => c.id === "recent" ? { ...c, emojis: recent } : c)
    .filter(c => c.id !== "recent" || recent.length > 0)

  const display = q
    ? [{ id: "__q__", label: `Поиск`, emojis: allEmojis.filter(e => e.includes(q)) }]
    : cats

  const posClass = anchor === "top"
    ? "bottom-full mb-1"
    : "top-full mt-1"

  return (
    <div ref={wrapRef}
      className={`absolute right-0 ${posClass} z-[100] w-[320px] bg-white border border-zinc-200 rounded-xl shadow-2xl flex flex-col overflow-hidden`}
      onClick={e => e.stopPropagation()}>

      {/* header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 bg-zinc-50">
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Эмодзи</span>
        <button onClick={onClose} className="text-zinc-300 hover:text-zinc-600 text-base leading-none transition-colors cursor-pointer">✕</button>
      </div>

      {/* search */}
      <div className="px-3 pt-2 pb-1.5 border-b border-zinc-100">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-300 text-sm">🔍</span>
          <input ref={searchRef} type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full text-sm pl-8 pr-8 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 text-xs cursor-pointer">✕</button>
          )}
        </div>
      </div>

      {/* category tabs */}
      {!search && (
        <div className="flex overflow-x-auto bg-zinc-50 border-b border-zinc-100" style={{ scrollbarWidth: "none" }}>
          {cats.map(cat => (
            <button key={cat.id} onClick={() => {
              setActive(cat.id)
              bodyRef.current?.querySelector(`[data-cat="${cat.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
              title={cat.label}
              className={`flex-shrink-0 w-9 h-8 flex items-center justify-center text-base transition-all cursor-pointer border-b-2 ${
                activeCat === cat.id ? "border-zinc-900 bg-white" : "border-transparent hover:bg-zinc-100"
              }`}>
              <span className="text-[16px] leading-none">{cat.icon}</span>
            </button>
          ))}
        </div>
      )}

      {/* grid */}
      <div ref={bodyRef}
        style={{ height: 240, overflowY: "auto", scrollbarWidth: "thin" }}
        onScroll={e => {
          if (search) return
          const sections = bodyRef.current?.querySelectorAll("[data-cat]") || []
          const top = e.target.scrollTop + 4
          for (const s of [...sections].reverse()) {
            if (s.offsetTop <= top) { setActive(s.getAttribute("data-cat")); break }
          }
        }}>
        {display.map(cat => (
          <div key={cat.id} data-cat={cat.id}>
            <div className="sticky top-0 z-10 px-3 py-1 bg-white/95 backdrop-blur-sm border-b border-zinc-50">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">{cat.label}</span>
            </div>
            <div className="grid p-1.5" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
              {cat.emojis.length === 0
                ? <div className="col-span-8 py-5 text-center text-zinc-300 text-[11px] uppercase tracking-widest">пусто</div>
                : cat.emojis.map((emoji, i) => (
                    <button key={`${emoji}${i}`} onClick={() => pick(emoji)}
                      className="w-9 h-9 flex items-center justify-center text-[19px] hover:bg-zinc-100 active:scale-90 transition-all rounded-md cursor-pointer">
                      {emoji}
                    </button>
                  ))
              }
            </div>
          </div>
        ))}
        {q && display[0]?.emojis.length === 0 && (
          <div className="py-10 text-center text-zinc-300 text-[11px] uppercase tracking-widest">Ничего не найдено</div>
        )}
      </div>

      {/* footer */}
      <div className="px-3 py-1.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-zinc-300 text-[9px]">
          {recent.length > 0 ? `Недавние: ${recent.slice(0, 5).join(" ")}` : "Выберите эмодзи"}
        </span>
        {recent.length > 0 && (
          <button onClick={() => { saveRecent([]); setRecent([]) }}
            className="text-zinc-300 hover:text-zinc-500 text-[9px] cursor-pointer transition-colors">
            Очистить
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Hook: вставка в позицию курсора (работает с React controlled inputs) ─────

function useEmojiInsert(value, onChange) {
  const ref = useRef(null)

  const insert = useCallback((emoji) => {
    const el = ref.current
    if (!el) { onChange(value + emoji); return }
    const start = el.selectionStart ?? value.length
    const end   = el.selectionEnd   ?? value.length
    const next  = value.slice(0, start) + emoji + value.slice(end)
    onChange(next)
    // Restore cursor after React re-render
    const pos = start + emoji.length
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(pos, pos)
    })
  }, [value, onChange])

  return { ref, insert }
}

// ─── EmojiFieldButton — кнопка с пикером для поля ────────────────────────────

function EmojiFieldButton({ value, onChange, anchor = "bottom" }) {
  const [open, setOpen] = useState(false)
  const { insert } = useEmojiInsert(value, onChange)

  return (
    <div className="relative flex-shrink-0">
      <button type="button"
        onClick={() => setOpen(v => !v)}
        title="Вставить эмодзи"
        className={`h-9 w-9 flex items-center justify-center border rounded-lg text-base transition-all cursor-pointer ${
          open ? "bg-zinc-900 border-zinc-900 text-white" : "border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-700"
        }`}>
        😊
      </button>
      {open && (
        <EmojiPicker
          anchor={anchor}
          onSelect={(emoji) => insert(emoji)}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

// ─── PostRow ──────────────────────────────────────────────────────────────────

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

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-500 transition">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── PostForm ─────────────────────────────────────────────────────────────────

function PostForm({ initial = {}, onSave, onCancel, onBump, loading }) {
  const [form, setForm] = useState({
    title:   "",
    content: "",
    excerpt: "",
    date:    new Date().toISOString().slice(0, 10),
    tags:    [],
    cover:   "",
    url:     "",
    videos:  [],
    photos:  [],
    ...initial,
    tags:   initial.tags   || [],
    videos: initial.videos || [],
    photos: initial.photos || [],
  })
  const [uploading, setUploading]         = useState(false)
  const [uploadingExtra, setUploadingExtra] = useState(false)
  const fileRef      = useRef()
  const videosRef    = useRef()
  const photosRef    = useRef()

  // Refs for emoji insert
  const titleRef   = useRef()
  const excerptRef = useRef()
  const contentRef = useRef()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Per-field emoji insert (cursor-aware)
  function makeInsert(field, ref) {
    return (emoji) => {
      const el    = ref.current
      const value = form[field]
      if (!el) { set(field, value + emoji); return }
      const start = el.selectionStart ?? value.length
      const end   = el.selectionEnd   ?? value.length
      const next  = value.slice(0, start) + emoji + value.slice(end)
      set(field, next)
      const pos = start + emoji.length
      requestAnimationFrame(() => { el.focus(); el.setSelectionRange(pos, pos) })
    }
  }

  async function uploadFile(file, target = "cover") {
    target === "cover" ? setUploading(true) : setUploadingExtra(true)
    try {
      const data = new FormData()
      data.append("file", file)
      const res  = await fetch(`${API_URL}/api/upload`, { method: "POST", headers: headers(), body: data })
      const json = await res.json()
      if (target === "cover") {
        if (file.type.startsWith("video")) set("video", json.url)
        else set("cover", json.url)
      } else if (target === "videos") {
        set("videos", [...(form.videos || []), json.url])
      } else if (target === "photos") {
        set("photos", [...(form.photos || []), json.url])
      }
    } catch (e) {
      alert("Ошибка загрузки: " + e.message)
    } finally {
      target === "cover" ? setUploading(false) : setUploadingExtra(false)
    }
  }

  function toggleTag(tag) {
    set("tags", form.tags.includes(tag)
      ? form.tags.filter(t => t !== tag)
      : [...form.tags, tag])
  }

  return (
    <div className="space-y-4">

      {/* ── Заголовок ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Заголовок *</label>
        <div className="mt-1 flex gap-1.5 items-center relative">
          <input
            ref={titleRef}
            className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            value={form.title}
            onChange={e => set("title", e.target.value)}
            placeholder="Заголовок поста"
          />
          <EmojiFieldButton
            value={form.title}
            onChange={v => set("title", v)}
            anchor="bottom"
          />
        </div>
      </div>

      {/* ── Дата ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Дата</label>
        <input type="date"
          className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          value={form.date} onChange={e => set("date", e.target.value)} />
      </div>

      {/* ── Теги ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Теги</label>
        <div className="mt-1 flex gap-2 flex-wrap">
          {TAGS.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${
                form.tags.includes(tag)
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
              }`}>
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Обложка ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Обложка / Фото</label>
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
            onChange={e => e.target.files[0] && uploadFile(e.target.files[0], "cover")} />
        </div>
        {form.cover && <img src={form.cover} className="mt-2 h-24 object-cover rounded-lg" />}
      </div>

      {/* ── URL ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">YouTube / Rumble URL</label>
        <input
          className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          value={form.url || ""} onChange={e => set("url", e.target.value)}
          placeholder="https://youtu.be/..." />
      </div>

      {/* ── Дополнительные видео ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          Дополнительные видео
          <span className="ml-1 text-zinc-300 normal-case font-normal">(mp4, YouTube, Rumble)</span>
        </label>
        <div className="mt-1 space-y-1.5">
          {(form.videos || []).map((v, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                value={v}
                onChange={e => {
                  const arr = [...form.videos]
                  arr[i] = e.target.value
                  set("videos", arr)
                }}
                placeholder="URL видео"
              />
              <button type="button"
                onClick={() => set("videos", form.videos.filter((_, j) => j !== i))}
                className="w-8 h-9 flex items-center justify-center border border-red-200 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-lg text-sm transition-all cursor-pointer flex-shrink-0">
                ✕
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <button type="button"
              onClick={() => set("videos", [...(form.videos || []), ""])}
              className="flex-1 py-2 border border-dashed border-zinc-300 rounded-lg text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-600 transition-all cursor-pointer">
              + Добавить URL видео
            </button>
            <button type="button"
              onClick={() => videosRef.current.click()}
              disabled={uploadingExtra}
              className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap cursor-pointer disabled:opacity-50">
              {uploadingExtra ? "⏳" : "📎 Загрузить"}
            </button>
            <input ref={videosRef} type="file" accept="video/*" className="hidden" multiple
              onChange={e => {
                [...e.target.files].forEach(f => uploadFile(f, "videos"))
                e.target.value = ""
              }} />
          </div>
        </div>
      </div>

      {/* ── Дополнительные фото ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          Дополнительные фото
        </label>
        <div className="mt-1 space-y-1.5">
          {(form.photos || []).map((p, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                value={p}
                onChange={e => {
                  const arr = [...form.photos]
                  arr[i] = e.target.value
                  set("photos", arr)
                }}
                placeholder="URL фото"
              />
              <img src={p} onError={e => e.target.style.display="none"}
                className="w-10 h-9 object-cover rounded border border-zinc-100 flex-shrink-0" />
              <button type="button"
                onClick={() => set("photos", form.photos.filter((_, j) => j !== i))}
                className="w-8 h-9 flex items-center justify-center border border-red-200 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-lg text-sm transition-all cursor-pointer flex-shrink-0">
                ✕
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <button type="button"
              onClick={() => set("photos", [...(form.photos || []), ""])}
              className="flex-1 py-2 border border-dashed border-zinc-300 rounded-lg text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-600 transition-all cursor-pointer">
              + Добавить URL фото
            </button>
            <button type="button"
              onClick={() => photosRef.current.click()}
              disabled={uploadingExtra}
              className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap cursor-pointer disabled:opacity-50">
              {uploadingExtra ? "⏳" : "📎 Загрузить"}
            </button>
            <input ref={photosRef} type="file" accept="image/*" className="hidden" multiple
              onChange={e => {
                [...e.target.files].forEach(f => uploadFile(f, "photos"))
                e.target.value = ""
              }} />
          </div>
          {(form.photos || []).length > 0 && (
            <div className="flex gap-2 flex-wrap mt-1">
              {form.photos.map((p, i) => (
                <img key={i} src={p} onError={e => e.target.style.display="none"}
                  className="h-16 w-24 object-cover rounded-lg border border-zinc-100" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Краткое описание ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Краткое описание</label>
        <div className="mt-1 flex gap-1.5 items-center relative">
          <input
            ref={excerptRef}
            className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            value={form.excerpt || ""}
            onChange={e => set("excerpt", e.target.value)}
            placeholder="Короткое описание для карточки"
          />
          <EmojiFieldButton
            value={form.excerpt || ""}
            onChange={v => set("excerpt", v)}
            anchor="bottom"
          />
        </div>
      </div>

      {/* ── Текст поста ── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Текст поста</label>
          {/* emoji button сверху-справа от label */}
          <div className="relative">
            <EmojiFieldButton
              value={form.content || ""}
              onChange={v => set("content", v)}
              anchor="top"
            />
          </div>
        </div>
        <textarea
          ref={contentRef}
          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 h-40 resize-none"
          value={form.content || ""}
          onChange={e => set("content", e.target.value)}
          placeholder="Основной текст..."
        />
        <p className="text-[10px] text-zinc-300 mt-1">
          Нажмите 😊 выше → выберите эмодзи → он вставится в позицию курсора
        </p>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)} disabled={!form.title || loading}
          className="flex-1 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition disabled:opacity-40">
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
        {initial.id && onBump && (
          <button type="button" onClick={() => onBump(initial.id)}
            title="Поднять пост наверх ленты"
            className="px-4 py-2.5 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition whitespace-nowrap">
            ↑ Поднять
          </button>
        )}
        <button onClick={onCancel}
          className="px-6 py-2.5 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition">
          Отмена
        </button>
      </div>
    </div>
  )
}

// ─── AdminPage ────────────────────────────────────────────────────────────────

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

  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "1") setAuthed(true)
  }, [])

  useEffect(() => { if (authed) loadPosts() }, [authed])

  function login() {
    if (keyInput === ADMIN_KEY) {
      sessionStorage.setItem("admin_authed", "1")
      setAuthed(true)
    } else {
      alert("Неверный ключ")
    }
  }

  function logout() {
    sessionStorage.removeItem("admin_authed")
    setAuthed(false)
    setKeyInput("")
  }

  async function loadPosts() {
    setLoading(true)
    try {
      const res  = await fetch(`${API_URL}/api/blog`)
      const data = await res.json()
      setPosts(data)
    } finally { setLoading(false) }
  }

  async function deletePost(id) {
    if (!confirm("Удалить пост?")) return
    await fetch(`${API_URL}/api/blog/${id}`, { method: "DELETE", headers: headers() })
    setPosts(p => p.filter(x => x.id !== id))
  }

  async function bumpPost(id) {
    await fetch(`${API_URL}/api/blog/${id}/bump`, { method: "POST", headers: headers() })
    loadPosts()
  }

  async function savePost(form) {
    setSaving(true)
    try {
      const isNew = !form.id
      const id    = form.id || form.title.toLowerCase().replace(/[^a-zа-яё0-9\s]/gi, "").trim().replace(/\s+/g, "-").slice(0, 50) + `-${Date.now()}`
      const body  = { ...form, id, source: "admin" }
      await fetch(`${API_URL}/api/blog${isNew ? "" : `/${id}`}`, {
        method: isNew ? "POST" : "PUT",
        headers: headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(body),
      })
      setEditing(null); setCreating(false)
      loadPosts()
    } finally { setSaving(false) }
  }

  const filtered = posts
    .filter(p => activeTag === "all" || p.tags?.includes(activeTag))
    .filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()))

  if (!authed) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <h1 className="text-2xl font-bold mb-6">Админ панель</h1>
        <input type="password"
          className="w-full border border-zinc-200 rounded-lg px-3 py-2 mb-3 text-sm"
          placeholder="Admin key" value={keyInput}
          onChange={e => setKeyInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()} />
        <button onClick={login}
          className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition">
          Войти
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Блог · Админ</h1>
          <p className="text-xs text-zinc-400 mt-0.5">{posts.length} постов</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCreating(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition">
            + Новый пост
          </button>
          <button onClick={logout}
            className="px-4 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition">
            Выйти
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-zinc-100 px-6 py-3 flex gap-3 flex-wrap items-center">
        <input className="border border-zinc-200 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex gap-2 flex-wrap">
          {["all", ...TAGS].map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${
                activeTag === tag ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
              }`}>
              #{tag}
            </button>
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
          <PostForm initial={editing} onSave={savePost} onCancel={() => setEditing(null)} onBump={bumpPost} loading={saving} />
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