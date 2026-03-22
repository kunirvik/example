// import { useEffect, useState, useRef, useCallback } from "react"

// const API_URL   = import.meta.env.VITE_API_URL
// const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY

// const headers = (extra = {}) => ({ "x-admin-key": ADMIN_KEY, ...extra })

// const TAGS = ["live", "construction", "parkramps", "bmx", "skate"]

// // ─── Emoji dataset ────────────────────────────────────────────────────────────

// const EMOJI_CATS = [
//   { id: "recent",     icon: "🕐", label: "Недавние",   emojis: [] },
//   { id: "smileys",    icon: "😀", label: "Смайлы",     emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😚","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","☹️","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"] },
//   { id: "gestures",   icon: "👋", label: "Жесты",      emojis: ["👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💅","💪","🦾","👀","👅","👄","💋"] },
//   { id: "animals",    icon: "🐶", label: "Животные",   emojis: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐒","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🦋","🐌","🐞","🐜","🕷️","🦂","🐢","🐍","🦎","🐙","🦑","🐬","🐳","🐋","🦈","🦭","🐊","🐅","🐆","🦓","🦍","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🐐","🦌","🐕","🐩","🐈"] },
//   { id: "food",       icon: "🍕", label: "Еда",        emojis: ["🍎","🍊","🍋","🍇","🍓","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🥑","🍆","🥦","🥬","🥒","🌶️","🧄","🧅","🥔","🌽","🥕","🥗","🥙","🌮","🌯","🍔","🍟","🍕","🌭","🥪","🥚","🍳","🥘","🍲","🥣","🍿","🧈","🥞","🧇","🥐","🥖","🥨","🧀","🍞","🥓","🥩","🍗","🍖","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍩","🍪","🍦","🍧","🍨","🧃","🥤","🧋","☕","🍵","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾"] },
//   { id: "travel",     icon: "✈️", label: "Транспорт",  emojis: ["🚗","🚕","🚙","🛻","🚌","🏎️","🚓","🚑","🚒","🛵","🏍️","🚲","🛴","🛹","🛼","⛵","🚤","🛳️","🚢","✈️","🛩️","🚁","🚀","🛸","🪐","🌍","🌎","🌏","🏔️","⛰️","🌋","🏕️","🏖️","🏜️","🏝️","🏟️","🏛️","🏗️","🏠","🏢","🏥","🏦","🏨","🏪","🏫","🏬","🏭","🏯","🏰","🗼","🗽","⛩️","🕌","⛪"] },
//   { id: "activities", icon: "⚽", label: "Спорт",      emojis: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🎱","🏓","🏸","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","⛳","🎯","🏹","🎣","🤿","🥌","🎿","⛷️","🏂","🪂","🏋️","🤼","🤸","🤺","🤾","🏌️","🏇","🧘","🎪","🎭","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🎻","🎲","♟️","🎯","🎳","🎮","🎰","🧩"] },
//   { id: "symbols",    icon: "❤️", label: "Символы",    emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","❣️","💕","💞","💓","💗","💖","💘","💝","💟","✅","❌","⭕","🔥","💥","⚡","🌟","⭐","🌙","☀️","🌈","❄️","🌊","💫","✨","🎉","🎊","🎈","🏆","🥇","🥈","🥉","🎖️","🏅","🎗️","🎀","🎁","💯","🔑","🗝️","🔒","🔓","💡","🔔","🔕","📢","📣","💬","💭","🗯️","📌","📍","🗺️","🧭","⏰","⌛","⏳","📅","📆","📊","📈","📉","🔍","🔎","📝","✏️","🖊️","📌","🔗","📎","✂️","🗑️"] },
// ]

// const RECENT_KEY = "ap_emoji_recent"
// const MAX_RECENT = 24

// function getRecent() {
//   try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]") } catch { return [] }
// }
// function saveRecent(arr) {
//   try { localStorage.setItem(RECENT_KEY, JSON.stringify(arr)) } catch {}
// }

// // ─── Emoji Picker ─────────────────────────────────────────────────────────────

// function EmojiPicker({ onSelect, onClose, anchor = "bottom" }) {
//   const [search, setSearch]   = useState("")
//   const [activeCat, setActive] = useState("smileys")
//   const [recent, setRecent]   = useState(getRecent)
//   const searchRef = useRef(null)
//   const bodyRef   = useRef(null)
//   const wrapRef   = useRef(null)

//   useEffect(() => { searchRef.current?.focus() }, [])

//   // Close on outside click
//   useEffect(() => {
//     const fn = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) onClose() }
//     document.addEventListener("mousedown", fn)
//     return () => document.removeEventListener("mousedown", fn)
//   }, [onClose])

//   const pick = useCallback((emoji) => {
//     const next = [emoji, ...recent.filter(e => e !== emoji)].slice(0, MAX_RECENT)
//     setRecent(next); saveRecent(next)
//     onSelect(emoji)
//   }, [recent, onSelect])

//   const q = search.trim().toLowerCase()
//   const allEmojis = EMOJI_CATS.flatMap(c => c.id === "recent" ? [] : c.emojis)

//   const cats = EMOJI_CATS.map(c => c.id === "recent" ? { ...c, emojis: recent } : c)
//     .filter(c => c.id !== "recent" || recent.length > 0)

//   const display = q
//     ? [{ id: "__q__", label: `Поиск`, emojis: allEmojis.filter(e => e.includes(q)) }]
//     : cats

//   const posClass = anchor === "top"
//     ? "bottom-full mb-1"
//     : "top-full mt-1"

//   return (
//     <div ref={wrapRef}
//       className={`absolute right-0 ${posClass} z-[100] w-[320px] bg-white border border-zinc-200 rounded-xl shadow-2xl flex flex-col overflow-hidden`}
//       onClick={e => e.stopPropagation()}>

//       {/* header */}
//       <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 bg-zinc-50">
//         <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Эмодзи</span>
//         <button onClick={onClose} className="text-zinc-300 hover:text-zinc-600 text-base leading-none transition-colors cursor-pointer">✕</button>
//       </div>

//       {/* search */}
//       <div className="px-3 pt-2 pb-1.5 border-b border-zinc-100">
//         <div className="relative">
//           <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-300 text-sm">🔍</span>
//           <input ref={searchRef} type="text" value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Поиск..."
//             className="w-full text-sm pl-8 pr-8 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
//           />
//           {search && (
//             <button onClick={() => setSearch("")}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 text-xs cursor-pointer">✕</button>
//           )}
//         </div>
//       </div>

//       {/* category tabs */}
//       {!search && (
//         <div className="flex overflow-x-auto bg-zinc-50 border-b border-zinc-100" style={{ scrollbarWidth: "none" }}>
//           {cats.map(cat => (
//             <button key={cat.id} onClick={() => {
//               setActive(cat.id)
//               bodyRef.current?.querySelector(`[data-cat="${cat.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" })
//             }}
//               title={cat.label}
//               className={`flex-shrink-0 w-9 h-8 flex items-center justify-center text-base transition-all cursor-pointer border-b-2 ${
//                 activeCat === cat.id ? "border-zinc-900 bg-white" : "border-transparent hover:bg-zinc-100"
//               }`}>
//               <span className="text-[16px] leading-none">{cat.icon}</span>
//             </button>
//           ))}
//         </div>
//       )}

//       {/* grid */}
//       <div ref={bodyRef}
//         style={{ height: 240, overflowY: "auto", scrollbarWidth: "thin" }}
//         onScroll={e => {
//           if (search) return
//           const sections = bodyRef.current?.querySelectorAll("[data-cat]") || []
//           const top = e.target.scrollTop + 4
//           for (const s of [...sections].reverse()) {
//             if (s.offsetTop <= top) { setActive(s.getAttribute("data-cat")); break }
//           }
//         }}>
//         {display.map(cat => (
//           <div key={cat.id} data-cat={cat.id}>
//             <div className="sticky top-0 z-10 px-3 py-1 bg-white/95 backdrop-blur-sm border-b border-zinc-50">
//               <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">{cat.label}</span>
//             </div>
//             <div className="grid p-1.5" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
//               {cat.emojis.length === 0
//                 ? <div className="col-span-8 py-5 text-center text-zinc-300 text-[11px] uppercase tracking-widest">пусто</div>
//                 : cat.emojis.map((emoji, i) => (
//                     <button key={`${emoji}${i}`} onClick={() => pick(emoji)}
//                       className="w-9 h-9 flex items-center justify-center text-[19px] hover:bg-zinc-100 active:scale-90 transition-all rounded-md cursor-pointer">
//                       {emoji}
//                     </button>
//                   ))
//               }
//             </div>
//           </div>
//         ))}
//         {q && display[0]?.emojis.length === 0 && (
//           <div className="py-10 text-center text-zinc-300 text-[11px] uppercase tracking-widest">Ничего не найдено</div>
//         )}
//       </div>

//       {/* footer */}
//       <div className="px-3 py-1.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
//         <span className="text-zinc-300 text-[9px]">
//           {recent.length > 0 ? `Недавние: ${recent.slice(0, 5).join(" ")}` : "Выберите эмодзи"}
//         </span>
//         {recent.length > 0 && (
//           <button onClick={() => { saveRecent([]); setRecent([]) }}
//             className="text-zinc-300 hover:text-zinc-500 text-[9px] cursor-pointer transition-colors">
//             Очистить
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }

// // ─── Hook: вставка в позицию курсора (работает с React controlled inputs) ─────

// function useEmojiInsert(value, onChange) {
//   const ref = useRef(null)

//   const insert = useCallback((emoji) => {
//     const el = ref.current
//     if (!el) { onChange(value + emoji); return }
//     const start = el.selectionStart ?? value.length
//     const end   = el.selectionEnd   ?? value.length
//     const next  = value.slice(0, start) + emoji + value.slice(end)
//     onChange(next)
//     // Restore cursor after React re-render
//     const pos = start + emoji.length
//     requestAnimationFrame(() => {
//       el.focus()
//       el.setSelectionRange(pos, pos)
//     })
//   }, [value, onChange])

//   return { ref, insert }
// }

// // ─── EmojiFieldButton — кнопка с пикером для поля ────────────────────────────

// function EmojiFieldButton({ value, onChange, anchor = "bottom" }) {
//   const [open, setOpen] = useState(false)
//   const { insert } = useEmojiInsert(value, onChange)

//   return (
//     <div className="relative flex-shrink-0">
//       <button type="button"
//         onClick={() => setOpen(v => !v)}
//         title="Вставить эмодзи"
//         className={`h-9 w-9 flex items-center justify-center border rounded-lg text-base transition-all cursor-pointer ${
//           open ? "bg-zinc-900 border-zinc-900 text-white" : "border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-700"
//         }`}>
//         😊
//       </button>
//       {open && (
//         <EmojiPicker
//           anchor={anchor}
//           onSelect={(emoji) => insert(emoji)}
//           onClose={() => setOpen(false)}
//         />
//       )}
//     </div>
//   )
// }

// // ─── PostRow ──────────────────────────────────────────────────────────────────

// function PostRow({ post, onEdit, onDelete, onApprove }) {
//   return (
//     <div className={`group flex items-start gap-4 p-4 border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${
//       post.status === "pending" ? "bg-amber-50 border-l-4 border-l-amber-400" : ""
//     }`}>
//       {/* обложка — без изменений */}
//       {post.cover
//         ? <img src={post.cover} className="w-16 h-16 object-cover rounded flex-shrink-0 bg-zinc-200" />
//         : <div className="w-16 h-16 rounded flex-shrink-0 bg-zinc-100 flex items-center justify-center text-zinc-400 text-2xl">
//             {post.type === "video" ? "▶" : "📄"}
//           </div>
//       }

//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2">
//           <p className="font-semibold text-zinc-900 truncate">{post.title}</p>
//           {post.status === "pending" && (
//             <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
//               ожидает
//             </span>
//           )}
//         </div>
//         <p className="text-xs text-zinc-400 mt-0.5">{post.date} · {post.source || "file"}</p>
//         <div className="flex gap-1 mt-1 flex-wrap">
//           {post.tags?.map(t => (
//             <span key={t} className="text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">#{t}</span>
//           ))}
//         </div>
//       </div>

//       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//         {/* Кнопка апрува — только для pending */}
//         {post.status === "pending" && (
//           <button onClick={() => onApprove(post.id)}
//             className="px-3 py-1.5 text-xs font-bold border border-green-300 text-green-600 rounded hover:bg-green-500 hover:text-white hover:border-green-500 transition-all">
//             ✓ Опубликовать
//           </button>
//         )}
//         <button onClick={() => onEdit(post)}
//           className="px-3 py-1.5 text-xs font-medium border border-zinc-300 rounded hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
//           Изменить
//         </button>
//         <button onClick={() => onDelete(post.id)}
//           className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 rounded hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
//           Удалить
//         </button>
//       </div>
//     </div>
//   )
// }

// // ─── Modal ────────────────────────────────────────────────────────────────────

// function Modal({ title, onClose, children }) {
//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
//       onClick={onClose}>
//       <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
//         onClick={e => e.stopPropagation()}>
//         <div className="flex items-center justify-between p-6 border-b border-zinc-100">
//           <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
//           <button onClick={onClose}
//             className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-500 transition">✕</button>
//         </div>
//         <div className="p-6">{children}</div>
//       </div>
//     </div>
//   )
// }

// // ─── PostForm ─────────────────────────────────────────────────────────────────

// function PostForm({ initial = {}, onSave, onCancel, onBump, loading }) {
//   const [form, setForm] = useState({
//     title:   "",
//     content: "",
//     excerpt: "",
//     date:    new Date().toISOString().slice(0, 10),
//     tags:    [],
//     cover:   "",
//     url:     "",
//     videos:  [],
//     photos:  [],
//     ...initial,
//     tags:   initial.tags   || [],
//     videos: initial.videos || [],
//     photos: initial.photos || [],
//   })
//   const [uploading, setUploading]         = useState(false)
//   const [uploadingExtra, setUploadingExtra] = useState(false)
//   const fileRef      = useRef()
//   const videosRef    = useRef()
//   const photosRef    = useRef()

//   // Refs for emoji insert
//   const titleRef   = useRef()
//   const excerptRef = useRef()
//   const contentRef = useRef()

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

//   // Per-field emoji insert (cursor-aware)
//   function makeInsert(field, ref) {
//     return (emoji) => {
//       const el    = ref.current
//       const value = form[field]
//       if (!el) { set(field, value + emoji); return }
//       const start = el.selectionStart ?? value.length
//       const end   = el.selectionEnd   ?? value.length
//       const next  = value.slice(0, start) + emoji + value.slice(end)
//       set(field, next)
//       const pos = start + emoji.length
//       requestAnimationFrame(() => { el.focus(); el.setSelectionRange(pos, pos) })
//     }
//   }

//   async function uploadFile(file, target = "cover") {
//     target === "cover" ? setUploading(true) : setUploadingExtra(true)
//     try {
//       const data = new FormData()
//       data.append("file", file)
//       const res  = await fetch(`${API_URL}/api/upload`, { method: "POST", headers: headers(), body: data })
//       const json = await res.json()
//       if (target === "cover") {
//         if (file.type.startsWith("video")) set("video", json.url)
//         else set("cover", json.url)
//       } else if (target === "videos") {
//         set("videos", [...(form.videos || []), json.url])
//       } else if (target === "photos") {
//         set("photos", [...(form.photos || []), json.url])
//       }
//     } catch (e) {
//       alert("Ошибка загрузки: " + e.message)
//     } finally {
//       target === "cover" ? setUploading(false) : setUploadingExtra(false)
//     }
//   }

//   function toggleTag(tag) {
//     set("tags", form.tags.includes(tag)
//       ? form.tags.filter(t => t !== tag)
//       : [...form.tags, tag])
//   }

//   return (
//     <div className="space-y-4">

//       {/* ── Заголовок ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Заголовок *</label>
//         <div className="mt-1 flex gap-1.5 items-center relative">
//           <input
//             ref={titleRef}
//             className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//             value={form.title}
//             onChange={e => set("title", e.target.value)}
//             placeholder="Заголовок поста"
//           />
//           <EmojiFieldButton
//             value={form.title}
//             onChange={v => set("title", v)}
//             anchor="bottom"
//           />
//         </div>
//       </div>

//       {/* ── Дата ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Дата</label>
//         <input type="date"
//           className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//           value={form.date} onChange={e => set("date", e.target.value)} />
//       </div>

//       {/* ── Теги ──
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Теги</label>
//         <div className="mt-1 flex gap-2 flex-wrap">
//           {TAGS.map(tag => (
//             <button key={tag} onClick={() => toggleTag(tag)}
//               className={`px-3 py-1 rounded-full text-xs border transition-all ${
//                 form.tags.includes(tag)
//                   ? "bg-zinc-900 text-white border-zinc-900"
//                   : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
//               }`}>
//               #{tag}
//             </button>
//           ))}
//         </div>
//       </div> */}

//       {/* ── Теги ── */}
// <div>
//   <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Теги</label>

//   {/* Активные теги — с крестиком */}
//   <div className="mt-1 flex gap-1.5 flex-wrap mb-2">
//     {form.tags.map(tag => (
//       <span key={tag}
//         className="flex items-center gap-1 px-2.5 py-0.5 bg-zinc-900 text-white text-xs rounded-full">
//         #{tag}
//         <button type="button" onClick={() => set("tags", form.tags.filter(t => t !== tag))}
//           className="text-white/50 hover:text-white leading-none cursor-pointer">✕</button>
//       </span>
//     ))}
//   </div>

//   {/* Быстрые пресеты */}
//   <div className="flex gap-1.5 flex-wrap mb-2">
//     {TAGS.filter(t => !form.tags.includes(t)).map(tag => (
//       <button key={tag} type="button" onClick={() => toggleTag(tag)}
//         className="px-2.5 py-0.5 rounded-full text-xs border border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-600 hover:text-zinc-700 transition-all cursor-pointer">
//         +#{tag}
//       </button>
//     ))}
//   </div>

//   {/* Произвольный тег — Enter чтобы добавить */}
//   <input
//     className="w-full border border-zinc-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//     placeholder="Новый тег → Enter"
//     onKeyDown={e => {
//       if (e.key !== "Enter") return
//       e.preventDefault()
//       const val = e.target.value.trim().toLowerCase().replace(/\s+/g, "-")
//       if (val && !form.tags.includes(val)) set("tags", [...form.tags, val])
//       e.target.value = ""
//     }}
//   />
// </div>

//       {/* ── Обложка ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Обложка / Фото</label>
//         <div className="mt-1 flex gap-2">
//           <input
//             className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//             value={form.cover || ""} onChange={e => set("cover", e.target.value)}
//             placeholder="URL или загрузи файл" />
//           <button onClick={() => fileRef.current.click()} disabled={uploading}
//             className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap">
//             {uploading ? "⏳" : "📎 Загрузить"}
//           </button>
//           <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
//             onChange={e => e.target.files[0] && uploadFile(e.target.files[0], "cover")} />
//         </div>
//         {form.cover && <img src={form.cover} className="mt-2 h-24 object-cover rounded-lg" />}
//       </div>

//       {/* ── URL ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">YouTube / Rumble URL</label>
//         <input
//           className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//           value={form.url || ""} onChange={e => set("url", e.target.value)}
//           placeholder="https://youtu.be/..." />
//       </div>

//       {/* ── Дополнительные видео ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
//           Дополнительные видео
//           <span className="ml-1 text-zinc-300 normal-case font-normal">(mp4, YouTube, Rumble)</span>
//         </label>
//         <div className="mt-1 space-y-1.5">
//           {(form.videos || []).map((v, i) => (
//             <div key={i} className="flex gap-2 items-center">
//               <input
//                 className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//                 value={v}
//                 onChange={e => {
//                   const arr = [...form.videos]
//                   arr[i] = e.target.value
//                   set("videos", arr)
//                 }}
//                 placeholder="URL видео"
//               />
//               <button type="button"
//                 onClick={() => set("videos", form.videos.filter((_, j) => j !== i))}
//                 className="w-8 h-9 flex items-center justify-center border border-red-200 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-lg text-sm transition-all cursor-pointer flex-shrink-0">
//                 ✕
//               </button>
//             </div>
//           ))}
//           <div className="flex gap-2">
//             <button type="button"
//               onClick={() => set("videos", [...(form.videos || []), ""])}
//               className="flex-1 py-2 border border-dashed border-zinc-300 rounded-lg text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-600 transition-all cursor-pointer">
//               + Добавить URL видео
//             </button>
//             <button type="button"
//               onClick={() => videosRef.current.click()}
//               disabled={uploadingExtra}
//               className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap cursor-pointer disabled:opacity-50">
//               {uploadingExtra ? "⏳" : "📎 Загрузить"}
//             </button>
//             <input ref={videosRef} type="file" accept="video/*" className="hidden" multiple
//               onChange={e => {
//                 [...e.target.files].forEach(f => uploadFile(f, "videos"))
//                 e.target.value = ""
//               }} />
//           </div>
//         </div>
//       </div>

//       {/* ── Дополнительные фото ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
//           Дополнительные фото
//         </label>
//         <div className="mt-1 space-y-1.5">
//           {(form.photos || []).map((p, i) => (
//             <div key={i} className="flex gap-2 items-center">
//               <input
//                 className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//                 value={p}
//                 onChange={e => {
//                   const arr = [...form.photos]
//                   arr[i] = e.target.value
//                   set("photos", arr)
//                 }}
//                 placeholder="URL фото"
//               />
//               <img src={p} onError={e => e.target.style.display="none"}
//                 className="w-10 h-9 object-cover rounded border border-zinc-100 flex-shrink-0" />
//               <button type="button"
//                 onClick={() => set("photos", form.photos.filter((_, j) => j !== i))}
//                 className="w-8 h-9 flex items-center justify-center border border-red-200 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-lg text-sm transition-all cursor-pointer flex-shrink-0">
//                 ✕
//               </button>
//             </div>
//           ))}
//           <div className="flex gap-2">
//             <button type="button"
//               onClick={() => set("photos", [...(form.photos || []), ""])}
//               className="flex-1 py-2 border border-dashed border-zinc-300 rounded-lg text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-600 transition-all cursor-pointer">
//               + Добавить URL фото
//             </button>
//             <button type="button"
//               onClick={() => photosRef.current.click()}
//               disabled={uploadingExtra}
//               className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap cursor-pointer disabled:opacity-50">
//               {uploadingExtra ? "⏳" : "📎 Загрузить"}
//             </button>
//             <input ref={photosRef} type="file" accept="image/*" className="hidden" multiple
//               onChange={e => {
//                 [...e.target.files].forEach(f => uploadFile(f, "photos"))
//                 e.target.value = ""
//               }} />
//           </div>
//           {(form.photos || []).length > 0 && (
//             <div className="flex gap-2 flex-wrap mt-1">
//               {form.photos.map((p, i) => (
//                 <img key={i} src={p} onError={e => e.target.style.display="none"}
//                   className="h-16 w-24 object-cover rounded-lg border border-zinc-100" />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Краткое описание ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Краткое описание</label>
//         <div className="mt-1 flex gap-1.5 items-center relative">
//           <input
//             ref={excerptRef}
//             className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//             value={form.excerpt || ""}
//             onChange={e => set("excerpt", e.target.value)}
//             placeholder="Короткое описание для карточки"
//           />
//           <EmojiFieldButton
//             value={form.excerpt || ""}
//             onChange={v => set("excerpt", v)}
//             anchor="bottom"
//           />
//         </div>
//       </div>

//       {/* ── Текст поста ── */}
//       <div>
//         <div className="flex items-center justify-between mb-1">
//           <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Текст поста</label>
//           {/* emoji button сверху-справа от label */}
//           <div className="relative">
//             <EmojiFieldButton
//               value={form.content || ""}
//               onChange={v => set("content", v)}
//               anchor="top"
//             />
//           </div>
//         </div>
//         <textarea
//           ref={contentRef}
//           className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 h-40 resize-none"
//           value={form.content || ""}
//           onChange={e => set("content", e.target.value)}
//           placeholder="Основной текст..."
//         />
//         <p className="text-[10px] text-zinc-300 mt-1">
//           Нажмите 😊 выше → выберите эмодзи → он вставится в позицию курсора
//         </p>
//       </div>

//       {/* ── Actions ── */}
//       <div className="flex gap-3 pt-2">
//         <button onClick={() => onSave(form)} disabled={!form.title || loading}
//           className="flex-1 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition disabled:opacity-40">
//           {loading ? "Сохранение..." : "Сохранить"}
//         </button>
//         {initial.id && onBump && (
//           <button type="button" onClick={() => onBump(initial.id)}
//             title="Поднять пост наверх ленты"
//             className="px-4 py-2.5 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition whitespace-nowrap">
//             ↑ Поднять
//           </button>
//         )}
//         <button onClick={onCancel}
//           className="px-6 py-2.5 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition">
//           Отмена
//         </button>
//       </div>
//     </div>
//   )
// }

// // ─── AdminPage ────────────────────────────────────────────────────────────────

// export default function AdminPage() {
//   const [posts, setPosts]     = useState([])
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving]   = useState(false)
//   const [editing, setEditing] = useState(null)
//   const [creating, setCreating] = useState(false)
//   const [search, setSearch]   = useState("")
//   const [activeTag, setActiveTag] = useState("all")
//   const [authed, setAuthed]   = useState(false)
//   const [keyInput, setKeyInput] = useState("")

//   useEffect(() => {
//     if (sessionStorage.getItem("admin_authed") === "1") setAuthed(true)
//   }, [])

//   useEffect(() => { if (authed) loadPosts() }, [authed])

//   function login() {
//     if (keyInput === ADMIN_KEY) {
//       sessionStorage.setItem("admin_authed", "1")
//       setAuthed(true)
//     } else {
//       alert("Неверный ключ")
//     }
//   }

//   function logout() {
//     sessionStorage.removeItem("admin_authed")
//     setAuthed(false)
//     setKeyInput("")
//   }

//   async function loadPosts() {
//     setLoading(true)

//     try {
//       // const res  = await fetch(`${API_URL}/api/blog`)
//           const res  = await fetch(`${API_URL}/api/blog?all=1`, { headers: headers() })
//       const data = await res.json()
//       setPosts(data)
//     } finally { setLoading(false) }
//   }
// async function approvePost(id) {
//   await fetch(`${API_URL}/api/blog/${id}/approve`, {
//     method: "PATCH",
//     headers: headers(),
//   })
//   loadPosts()
// }
//   async function deletePost(id) {
//     if (!confirm("Удалить пост?")) return
//     await fetch(`${API_URL}/api/blog/${id}`, { method: "DELETE", headers: headers() })
//     setPosts(p => p.filter(x => x.id !== id))
//   }

//   async function bumpPost(id) {
//     await fetch(`${API_URL}/api/blog/${id}/bump`, { method: "POST", headers: headers() })
//     loadPosts()
//   }

//   async function savePost(form) {
//     setSaving(true)
//     try {
//       const isNew = !form.id
//       const id    = form.id || form.title.toLowerCase().replace(/[^a-zа-яё0-9\s]/gi, "").trim().replace(/\s+/g, "-").slice(0, 50) + `-${Date.now()}`
//       const body  = { ...form, id, source: "admin" }
//       await fetch(`${API_URL}/api/blog${isNew ? "" : `/${id}`}`, {
//         method: isNew ? "POST" : "PUT",
//         headers: headers({ "Content-Type": "application/json" }),
//         body: JSON.stringify(body),
//       })
//       setEditing(null); setCreating(false)
//       loadPosts()
//     } finally { setSaving(false) }
//   }

//   const filtered = posts
//     .filter(p => activeTag === "all" || p.tags?.includes(activeTag))
//     .filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()))

//   if (!authed) return (
//     <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//       <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
//         <h1 className="text-2xl font-bold mb-6">Админ панель</h1>
//         <input type="password"
//           className="w-full border border-zinc-200 rounded-lg px-3 py-2 mb-3 text-sm"
//           placeholder="Admin key" value={keyInput}
//           onChange={e => setKeyInput(e.target.value)}
//           onKeyDown={e => e.key === "Enter" && login()} />
//         <button onClick={login}
//           className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition">
//           Войти
//         </button>
//       </div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-zinc-50">
//       <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-zinc-900">Блог · Админ</h1>
//           <p className="text-xs text-zinc-400 mt-0.5">{posts.length} постов</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button onClick={() => setCreating(true)}
//             className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition">
//             + Новый пост
//           </button>
//           <button onClick={logout}
//             className="px-4 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition">
//             Выйти
//           </button>
//         </div>
//       </div>

//       <div className="bg-white border-b border-zinc-100 px-6 py-3 flex gap-3 flex-wrap items-center">
//         <input className="border border-zinc-200 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-zinc-900"
//           placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} />
//         <div className="flex gap-2 flex-wrap">
//           {["all", ...TAGS].map(tag => (
//             <button key={tag} onClick={() => setActiveTag(tag)}
//               className={`px-3 py-1 rounded-full text-xs border transition-all ${
//                 activeTag === tag ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
//               }`}>
//               #{tag}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
//         {loading
//           ? <div className="p-12 text-center text-zinc-400">Загрузка...</div>
//           : filtered.length === 0
//             ? <div className="p-12 text-center text-zinc-400">Постов не найдено</div>
//             : filtered.map(post => (
//                 <PostRow key={post.id} post={post} onEdit={setEditing} onDelete={deletePost}  onApprove={approvePost} />
//               ))
//         }
//       </div>

//       {editing && (
//         <Modal title="Редактировать пост" onClose={() => setEditing(null)}>
//           <PostForm initial={editing} onSave={savePost} onCancel={() => setEditing(null)} onBump={bumpPost} loading={saving} />
//         </Modal>
//       )}
//       {creating && (
//         <Modal title="Новый пост" onClose={() => setCreating(false)}>
//           <PostForm onSave={savePost} onCancel={() => setCreating(false)} loading={saving} />
//         </Modal>
//       )}
//     </div>
//   )
// }

// import { useEffect, useState, useRef, useCallback } from "react"

// const API_URL   = import.meta.env.VITE_API_URL
// const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY

// const headers = (extra = {}) => ({ "x-admin-key": ADMIN_KEY, ...extra })

// const TAGS = ["live", "construction", "parkramps", "bmx", "skate"]

// // ─── Cloudinary утилита ───────────────────────────────────────────────────────
// // Вставляет параметры трансформации в URL.
// // Оригинал в БД: .../upload/marketplace/file.webp
// // С параметрами:  .../upload/w_128,h_128,c_fill,q_auto,f_auto/marketplace/file.webp
// function cldUrl(url, { w, h, crop = "fill" } = {}) {
//   if (!url || !url.includes("cloudinary.com")) return url
//   const p = []
//   if (w) p.push(`w_${w}`)
//   if (h) p.push(`h_${h}`)
//   p.push(`c_${crop}`, "q_auto", "f_auto")
//   return url.replace("/upload/", `/upload/${p.join(",")}/`)
// }
// // Пресеты для ListingRow
// const cld = {
//   admin: url => cldUrl(url, { w: 128, h: 128 }),          // превью в таблице
//   full:  url => cldUrl(url, { w: 1200, h: 900, crop: "limit" }), // просмотр
//   thumb: url => cldUrl(url, { w: 80,  h: 80  }),          // переключалка
// }

// // ─── Категории барахолки ──────────────────────────────────────────────────────
// const CAT_LABELS = {
//   bikes: "🚲 Велосипеды", parts: "🔩 Запчасти", clothing: "👕 Одежда",
//   electronics: "📱 Электроника", other: "📦 Прочее",
// }
// const STATUS_LABEL = {
//   pending: "Ожидает", published: "Опубликовано", rejected: "Отклонено", expired: "Истекло",
// }
// const STATUS_COLOR = {
//   pending:   "bg-amber-100 text-amber-700",
//   published: "bg-green-100 text-green-700",
//   rejected:  "bg-red-100   text-red-700",
//   expired:   "bg-zinc-100  text-zinc-500",
// }
// const STATUS_BORDER = {
//   pending:   "border-l-amber-400 bg-amber-50",
//   published: "border-l-green-400 bg-green-50/30",
//   rejected:  "border-l-red-300   bg-red-50/30",
//   expired:   "border-l-zinc-300  bg-zinc-50",
// }


// // ─── Emoji dataset ────────────────────────────────────────────────────────────

// const EMOJI_CATS = [
//   { id: "recent",     icon: "🕐", label: "Недавние",   emojis: [] },
//   { id: "smileys",    icon: "😀", label: "Смайлы",     emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😚","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","☹️","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"] },
//   { id: "gestures",   icon: "👋", label: "Жесты",      emojis: ["👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💅","💪","🦾","👀","👅","👄","💋"] },
//   { id: "animals",    icon: "🐶", label: "Животные",   emojis: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐒","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🦋","🐌","🐞","🐜","🕷️","🦂","🐢","🐍","🦎","🐙","🦑","🐬","🐳","🐋","🦈","🦭","🐊","🐅","🐆","🦓","🦍","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🐐","🦌","🐕","🐩","🐈"] },
//   { id: "food",       icon: "🍕", label: "Еда",        emojis: ["🍎","🍊","🍋","🍇","🍓","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🥑","🍆","🥦","🥬","🥒","🌶️","🧄","🧅","🥔","🌽","🥕","🥗","🥙","🌮","🌯","🍔","🍟","🍕","🌭","🥪","🥚","🍳","🥘","🍲","🥣","🍿","🧈","🥞","🧇","🥐","🥖","🥨","🧀","🍞","🥓","🥩","🍗","🍖","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍩","🍪","🍦","🍧","🍨","🧃","🥤","🧋","☕","🍵","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾"] },
//   { id: "travel",     icon: "✈️", label: "Транспорт",  emojis: ["🚗","🚕","🚙","🛻","🚌","🏎️","🚓","🚑","🚒","🛵","🏍️","🚲","🛴","🛹","🛼","⛵","🚤","🛳️","🚢","✈️","🛩️","🚁","🚀","🛸","🪐","🌍","🌎","🌏","🏔️","⛰️","🌋","🏕️","🏖️","🏜️","🏝️","🏟️","🏛️","🏗️","🏠","🏢","🏥","🏦","🏨","🏪","🏫","🏬","🏭","🏯","🏰","🗼","🗽","⛩️","🕌","⛪"] },
//   { id: "activities", icon: "⚽", label: "Спорт",      emojis: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🎱","🏓","🏸","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","⛳","🎯","🏹","🎣","🤿","🥌","🎿","⛷️","🏂","🪂","🏋️","🤼","🤸","🤺","🤾","🏌️","🏇","🧘","🎪","🎭","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🎻","🎲","♟️","🎯","🎳","🎮","🎰","🧩"] },
//   { id: "symbols",    icon: "❤️", label: "Символы",    emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","❣️","💕","💞","💓","💗","💖","💘","💝","💟","✅","❌","⭕","🔥","💥","⚡","🌟","⭐","🌙","☀️","🌈","❄️","🌊","💫","✨","🎉","🎊","🎈","🏆","🥇","🥈","🥉","🎖️","🏅","🎗️","🎀","🎁","💯","🔑","🗝️","🔒","🔓","💡","🔔","🔕","📢","📣","💬","💭","🗯️","📌","📍","🗺️","🧭","⏰","⌛","⏳","📅","📆","📊","📈","📉","🔍","🔎","📝","✏️","🖊️","📌","🔗","📎","✂️","🗑️"] },
// ]

// const RECENT_KEY = "ap_emoji_recent"
// const MAX_RECENT = 24

// function getRecent() {
//   try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]") } catch { return [] }
// }
// function saveRecent(arr) {
//   try { localStorage.setItem(RECENT_KEY, JSON.stringify(arr)) } catch {}
// }

// // ─── Emoji Picker ─────────────────────────────────────────────────────────────

// function EmojiPicker({ onSelect, onClose, anchor = "bottom" }) {
//   const [search, setSearch]   = useState("")
//   const [activeCat, setActive] = useState("smileys")
//   const [recent, setRecent]   = useState(getRecent)
//   const searchRef = useRef(null)
//   const bodyRef   = useRef(null)
//   const wrapRef   = useRef(null)

//   useEffect(() => { searchRef.current?.focus() }, [])

//   // Close on outside click
//   useEffect(() => {
//     const fn = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) onClose() }
//     document.addEventListener("mousedown", fn)
//     return () => document.removeEventListener("mousedown", fn)
//   }, [onClose])

//   const pick = useCallback((emoji) => {
//     const next = [emoji, ...recent.filter(e => e !== emoji)].slice(0, MAX_RECENT)
//     setRecent(next); saveRecent(next)
//     onSelect(emoji)
//   }, [recent, onSelect])

//   const q = search.trim().toLowerCase()
//   const allEmojis = EMOJI_CATS.flatMap(c => c.id === "recent" ? [] : c.emojis)

//   const cats = EMOJI_CATS.map(c => c.id === "recent" ? { ...c, emojis: recent } : c)
//     .filter(c => c.id !== "recent" || recent.length > 0)

//   const display = q
//     ? [{ id: "__q__", label: `Поиск`, emojis: allEmojis.filter(e => e.includes(q)) }]
//     : cats

//   const posClass = anchor === "top"
//     ? "bottom-full mb-1"
//     : "top-full mt-1"

//   return (
//     <div ref={wrapRef}
//       className={`absolute right-0 ${posClass} z-[100] w-[320px] bg-white border border-zinc-200 rounded-xl shadow-2xl flex flex-col overflow-hidden`}
//       onClick={e => e.stopPropagation()}>

//       {/* header */}
//       <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 bg-zinc-50">
//         <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Эмодзи</span>
//         <button onClick={onClose} className="text-zinc-300 hover:text-zinc-600 text-base leading-none transition-colors cursor-pointer">✕</button>
//       </div>

//       {/* search */}
//       <div className="px-3 pt-2 pb-1.5 border-b border-zinc-100">
//         <div className="relative">
//           <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-300 text-sm">🔍</span>
//           <input ref={searchRef} type="text" value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Поиск..."
//             className="w-full text-sm pl-8 pr-8 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
//           />
//           {search && (
//             <button onClick={() => setSearch("")}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 text-xs cursor-pointer">✕</button>
//           )}
//         </div>
//       </div>

//       {/* category tabs */}
//       {!search && (
//         <div className="flex overflow-x-auto bg-zinc-50 border-b border-zinc-100" style={{ scrollbarWidth: "none" }}>
//           {cats.map(cat => (
//             <button key={cat.id} onClick={() => {
//               setActive(cat.id)
//               bodyRef.current?.querySelector(`[data-cat="${cat.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" })
//             }}
//               title={cat.label}
//               className={`flex-shrink-0 w-9 h-8 flex items-center justify-center text-base transition-all cursor-pointer border-b-2 ${
//                 activeCat === cat.id ? "border-zinc-900 bg-white" : "border-transparent hover:bg-zinc-100"
//               }`}>
//               <span className="text-[16px] leading-none">{cat.icon}</span>
//             </button>
//           ))}
//         </div>
//       )}

//       {/* grid */}
//       <div ref={bodyRef}
//         style={{ height: 240, overflowY: "auto", scrollbarWidth: "thin" }}
//         onScroll={e => {
//           if (search) return
//           const sections = bodyRef.current?.querySelectorAll("[data-cat]") || []
//           const top = e.target.scrollTop + 4
//           for (const s of [...sections].reverse()) {
//             if (s.offsetTop <= top) { setActive(s.getAttribute("data-cat")); break }
//           }
//         }}>
//         {display.map(cat => (
//           <div key={cat.id} data-cat={cat.id}>
//             <div className="sticky top-0 z-10 px-3 py-1 bg-white/95 backdrop-blur-sm border-b border-zinc-50">
//               <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">{cat.label}</span>
//             </div>
//             <div className="grid p-1.5" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
//               {cat.emojis.length === 0
//                 ? <div className="col-span-8 py-5 text-center text-zinc-300 text-[11px] uppercase tracking-widest">пусто</div>
//                 : cat.emojis.map((emoji, i) => (
//                     <button key={`${emoji}${i}`} onClick={() => pick(emoji)}
//                       className="w-9 h-9 flex items-center justify-center text-[19px] hover:bg-zinc-100 active:scale-90 transition-all rounded-md cursor-pointer">
//                       {emoji}
//                     </button>
//                   ))
//               }
//             </div>
//           </div>
//         ))}
//         {q && display[0]?.emojis.length === 0 && (
//           <div className="py-10 text-center text-zinc-300 text-[11px] uppercase tracking-widest">Ничего не найдено</div>
//         )}
//       </div>

//       {/* footer */}
//       <div className="px-3 py-1.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
//         <span className="text-zinc-300 text-[9px]">
//           {recent.length > 0 ? `Недавние: ${recent.slice(0, 5).join(" ")}` : "Выберите эмодзи"}
//         </span>
//         {recent.length > 0 && (
//           <button onClick={() => { saveRecent([]); setRecent([]) }}
//             className="text-zinc-300 hover:text-zinc-500 text-[9px] cursor-pointer transition-colors">
//             Очистить
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }

// // ─── Hook: вставка в позицию курсора (работает с React controlled inputs) ─────

// function useEmojiInsert(value, onChange) {
//   const ref = useRef(null)

//   const insert = useCallback((emoji) => {
//     const el = ref.current
//     if (!el) { onChange(value + emoji); return }
//     const start = el.selectionStart ?? value.length
//     const end   = el.selectionEnd   ?? value.length
//     const next  = value.slice(0, start) + emoji + value.slice(end)
//     onChange(next)
//     // Restore cursor after React re-render
//     const pos = start + emoji.length
//     requestAnimationFrame(() => {
//       el.focus()
//       el.setSelectionRange(pos, pos)
//     })
//   }, [value, onChange])

//   return { ref, insert }
// }

// // ─── EmojiFieldButton — кнопка с пикером для поля ────────────────────────────

// function EmojiFieldButton({ value, onChange, anchor = "bottom" }) {
//   const [open, setOpen] = useState(false)
//   const { insert } = useEmojiInsert(value, onChange)

//   return (
//     <div className="relative flex-shrink-0">
//       <button type="button"
//         onClick={() => setOpen(v => !v)}
//         title="Вставить эмодзи"
//         className={`h-9 w-9 flex items-center justify-center border rounded-lg text-base transition-all cursor-pointer ${
//           open ? "bg-zinc-900 border-zinc-900 text-white" : "border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-700"
//         }`}>
//         😊
//       </button>
//       {open && (
//         <EmojiPicker
//           anchor={anchor}
//           onSelect={(emoji) => insert(emoji)}
//           onClose={() => setOpen(false)}
//         />
//       )}
//     </div>
//   )
// }

// // ─── PostRow ──────────────────────────────────────────────────────────────────

// function PostRow({ post, onEdit, onDelete, onApprove }) {
//   return (
//     <div className={`group flex items-start gap-4 p-4 border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${
//       post.status === "pending" ? "bg-amber-50 border-l-4 border-l-amber-400" : ""
//     }`}>
//       {/* обложка — без изменений */}
//       {post.cover
//         ? <img src={post.cover} className="w-16 h-16 object-cover rounded flex-shrink-0 bg-zinc-200" />
//         : <div className="w-16 h-16 rounded flex-shrink-0 bg-zinc-100 flex items-center justify-center text-zinc-400 text-2xl">
//             {post.type === "video" ? "▶" : "📄"}
//           </div>
//       }

//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2">
//           <p className="font-semibold text-zinc-900 truncate">{post.title}</p>
//           {post.status === "pending" && (
//             <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
//               ожидает
//             </span>
//           )}
//         </div>
//         <p className="text-xs text-zinc-400 mt-0.5">{post.date} · {post.source || "file"}</p>
//         <div className="flex gap-1 mt-1 flex-wrap">
//           {post.tags?.map(t => (
//             <span key={t} className="text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">#{t}</span>
//           ))}
//         </div>
//       </div>

//       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//         {/* Кнопка апрува — только для pending */}
//         {post.status === "pending" && (
//           <button onClick={() => onApprove(post.id)}
//             className="px-3 py-1.5 text-xs font-bold border border-green-300 text-green-600 rounded hover:bg-green-500 hover:text-white hover:border-green-500 transition-all">
//             ✓ Опубликовать
//           </button>
//         )}
//         <button onClick={() => onEdit(post)}
//           className="px-3 py-1.5 text-xs font-medium border border-zinc-300 rounded hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
//           Изменить
//         </button>
//         <button onClick={() => onDelete(post.id)}
//           className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 rounded hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
//           Удалить
//         </button>
//       </div>
//     </div>
//   )
// }

// // ─── Modal ────────────────────────────────────────────────────────────────────

// function Modal({ title, onClose, children }) {
//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
//       onClick={onClose}>
//       <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
//         onClick={e => e.stopPropagation()}>
//         <div className="flex items-center justify-between p-6 border-b border-zinc-100">
//           <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
//           <button onClick={onClose}
//             className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-500 transition">✕</button>
//         </div>
//         <div className="p-6">{children}</div>
//       </div>
//     </div>
//   )
// }

// // ─── PostForm ─────────────────────────────────────────────────────────────────

// function PostForm({ initial = {}, onSave, onCancel, onBump, loading }) {
//   const [form, setForm] = useState({
//     title:   "",
//     content: "",
//     excerpt: "",
//     date:    new Date().toISOString().slice(0, 10),
//     tags:    [],
//     cover:   "",
//     url:     "",
//     videos:  [],
//     photos:  [],
//     ...initial,
//     tags:   initial.tags   || [],
//     videos: initial.videos || [],
//     photos: initial.photos || [],
//   })
//   const [uploading, setUploading]         = useState(false)
//   const [uploadingExtra, setUploadingExtra] = useState(false)
//   const fileRef      = useRef()
//   const videosRef    = useRef()
//   const photosRef    = useRef()

//   // Refs for emoji insert
//   const titleRef   = useRef()
//   const excerptRef = useRef()
//   const contentRef = useRef()

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

//   // Per-field emoji insert (cursor-aware)
//   function makeInsert(field, ref) {
//     return (emoji) => {
//       const el    = ref.current
//       const value = form[field]
//       if (!el) { set(field, value + emoji); return }
//       const start = el.selectionStart ?? value.length
//       const end   = el.selectionEnd   ?? value.length
//       const next  = value.slice(0, start) + emoji + value.slice(end)
//       set(field, next)
//       const pos = start + emoji.length
//       requestAnimationFrame(() => { el.focus(); el.setSelectionRange(pos, pos) })
//     }
//   }

//   async function uploadFile(file, target = "cover") {
//     target === "cover" ? setUploading(true) : setUploadingExtra(true)
//     try {
//       const data = new FormData()
//       data.append("file", file)
//       const res  = await fetch(`${API_URL}/api/upload`, { method: "POST", headers: headers(), body: data })
//       const json = await res.json()
//       if (target === "cover") {
//         if (file.type.startsWith("video")) set("video", json.url)
//         else set("cover", json.url)
//       } else if (target === "videos") {
//         set("videos", [...(form.videos || []), json.url])
//       } else if (target === "photos") {
//         set("photos", [...(form.photos || []), json.url])
//       }
//     } catch (e) {
//       alert("Ошибка загрузки: " + e.message)
//     } finally {
//       target === "cover" ? setUploading(false) : setUploadingExtra(false)
//     }
//   }

//   function toggleTag(tag) {
//     set("tags", form.tags.includes(tag)
//       ? form.tags.filter(t => t !== tag)
//       : [...form.tags, tag])
//   }

//   return (
//     <div className="space-y-4">

//       {/* ── Заголовок ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Заголовок *</label>
//         <div className="mt-1 flex gap-1.5 items-center relative">
//           <input
//             ref={titleRef}
//             className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//             value={form.title}
//             onChange={e => set("title", e.target.value)}
//             placeholder="Заголовок поста"
//           />
//           <EmojiFieldButton
//             value={form.title}
//             onChange={v => set("title", v)}
//             anchor="bottom"
//           />
//         </div>
//       </div>

//       {/* ── Дата ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Дата</label>
//         <input type="date"
//           className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//           value={form.date} onChange={e => set("date", e.target.value)} />
//       </div>

//       {/* ── Теги ──
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Теги</label>
//         <div className="mt-1 flex gap-2 flex-wrap">
//           {TAGS.map(tag => (
//             <button key={tag} onClick={() => toggleTag(tag)}
//               className={`px-3 py-1 rounded-full text-xs border transition-all ${
//                 form.tags.includes(tag)
//                   ? "bg-zinc-900 text-white border-zinc-900"
//                   : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
//               }`}>
//               #{tag}
//             </button>
//           ))}
//         </div>
//       </div> */}

//       {/* ── Теги ── */}
// <div>
//   <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Теги</label>

//   {/* Активные теги — с крестиком */}
//   <div className="mt-1 flex gap-1.5 flex-wrap mb-2">
//     {form.tags.map(tag => (
//       <span key={tag}
//         className="flex items-center gap-1 px-2.5 py-0.5 bg-zinc-900 text-white text-xs rounded-full">
//         #{tag}
//         <button type="button" onClick={() => set("tags", form.tags.filter(t => t !== tag))}
//           className="text-white/50 hover:text-white leading-none cursor-pointer">✕</button>
//       </span>
//     ))}
//   </div>

//   {/* Быстрые пресеты */}
//   <div className="flex gap-1.5 flex-wrap mb-2">
//     {TAGS.filter(t => !form.tags.includes(t)).map(tag => (
//       <button key={tag} type="button" onClick={() => toggleTag(tag)}
//         className="px-2.5 py-0.5 rounded-full text-xs border border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-600 hover:text-zinc-700 transition-all cursor-pointer">
//         +#{tag}
//       </button>
//     ))}
//   </div>

//   {/* Произвольный тег — Enter чтобы добавить */}
//   <input
//     className="w-full border border-zinc-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//     placeholder="Новый тег → Enter"
//     onKeyDown={e => {
//       if (e.key !== "Enter") return
//       e.preventDefault()
//       const val = e.target.value.trim().toLowerCase().replace(/\s+/g, "-")
//       if (val && !form.tags.includes(val)) set("tags", [...form.tags, val])
//       e.target.value = ""
//     }}
//   />
// </div>

//       {/* ── Обложка ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Обложка / Фото</label>
//         <div className="mt-1 flex gap-2">
//           <input
//             className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//             value={form.cover || ""} onChange={e => set("cover", e.target.value)}
//             placeholder="URL или загрузи файл" />
//           <button onClick={() => fileRef.current.click()} disabled={uploading}
//             className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap">
//             {uploading ? "⏳" : "📎 Загрузить"}
//           </button>
//           <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
//             onChange={e => e.target.files[0] && uploadFile(e.target.files[0], "cover")} />
//         </div>
//         {form.cover && <img src={form.cover} className="mt-2 h-24 object-cover rounded-lg" />}
//       </div>

//       {/* ── URL ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">YouTube / Rumble URL</label>
//         <input
//           className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//           value={form.url || ""} onChange={e => set("url", e.target.value)}
//           placeholder="https://youtu.be/..." />
//       </div>

//       {/* ── Дополнительные видео ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
//           Дополнительные видео
//           <span className="ml-1 text-zinc-300 normal-case font-normal">(mp4, YouTube, Rumble)</span>
//         </label>
//         <div className="mt-1 space-y-1.5">
//           {(form.videos || []).map((v, i) => (
//             <div key={i} className="flex gap-2 items-center">
//               <input
//                 className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//                 value={v}
//                 onChange={e => {
//                   const arr = [...form.videos]
//                   arr[i] = e.target.value
//                   set("videos", arr)
//                 }}
//                 placeholder="URL видео"
//               />
//               <button type="button"
//                 onClick={() => set("videos", form.videos.filter((_, j) => j !== i))}
//                 className="w-8 h-9 flex items-center justify-center border border-red-200 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-lg text-sm transition-all cursor-pointer flex-shrink-0">
//                 ✕
//               </button>
//             </div>
//           ))}
//           <div className="flex gap-2">
//             <button type="button"
//               onClick={() => set("videos", [...(form.videos || []), ""])}
//               className="flex-1 py-2 border border-dashed border-zinc-300 rounded-lg text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-600 transition-all cursor-pointer">
//               + Добавить URL видео
//             </button>
//             <button type="button"
//               onClick={() => videosRef.current.click()}
//               disabled={uploadingExtra}
//               className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap cursor-pointer disabled:opacity-50">
//               {uploadingExtra ? "⏳" : "📎 Загрузить"}
//             </button>
//             <input ref={videosRef} type="file" accept="video/*" className="hidden" multiple
//               onChange={e => {
//                 [...e.target.files].forEach(f => uploadFile(f, "videos"))
//                 e.target.value = ""
//               }} />
//           </div>
//         </div>
//       </div>

//       {/* ── Дополнительные фото ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
//           Дополнительные фото
//         </label>
//         <div className="mt-1 space-y-1.5">
//           {(form.photos || []).map((p, i) => (
//             <div key={i} className="flex gap-2 items-center">
//               <input
//                 className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//                 value={p}
//                 onChange={e => {
//                   const arr = [...form.photos]
//                   arr[i] = e.target.value
//                   set("photos", arr)
//                 }}
//                 placeholder="URL фото"
//               />
//               <img src={p} onError={e => e.target.style.display="none"}
//                 className="w-10 h-9 object-cover rounded border border-zinc-100 flex-shrink-0" />
//               <button type="button"
//                 onClick={() => set("photos", form.photos.filter((_, j) => j !== i))}
//                 className="w-8 h-9 flex items-center justify-center border border-red-200 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-lg text-sm transition-all cursor-pointer flex-shrink-0">
//                 ✕
//               </button>
//             </div>
//           ))}
//           <div className="flex gap-2">
//             <button type="button"
//               onClick={() => set("photos", [...(form.photos || []), ""])}
//               className="flex-1 py-2 border border-dashed border-zinc-300 rounded-lg text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-600 transition-all cursor-pointer">
//               + Добавить URL фото
//             </button>
//             <button type="button"
//               onClick={() => photosRef.current.click()}
//               disabled={uploadingExtra}
//               className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap cursor-pointer disabled:opacity-50">
//               {uploadingExtra ? "⏳" : "📎 Загрузить"}
//             </button>
//             <input ref={photosRef} type="file" accept="image/*" className="hidden" multiple
//               onChange={e => {
//                 [...e.target.files].forEach(f => uploadFile(f, "photos"))
//                 e.target.value = ""
//               }} />
//           </div>
//           {(form.photos || []).length > 0 && (
//             <div className="flex gap-2 flex-wrap mt-1">
//               {form.photos.map((p, i) => (
//                 <img key={i} src={p} onError={e => e.target.style.display="none"}
//                   className="h-16 w-24 object-cover rounded-lg border border-zinc-100" />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Краткое описание ── */}
//       <div>
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Краткое описание</label>
//         <div className="mt-1 flex gap-1.5 items-center relative">
//           <input
//             ref={excerptRef}
//             className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//             value={form.excerpt || ""}
//             onChange={e => set("excerpt", e.target.value)}
//             placeholder="Короткое описание для карточки"
//           />
//           <EmojiFieldButton
//             value={form.excerpt || ""}
//             onChange={v => set("excerpt", v)}
//             anchor="bottom"
//           />
//         </div>
//       </div>

//       {/* ── Текст поста ── */}
//       <div>
//         <div className="flex items-center justify-between mb-1">
//           <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Текст поста</label>
//           {/* emoji button сверху-справа от label */}
//           <div className="relative">
//             <EmojiFieldButton
//               value={form.content || ""}
//               onChange={v => set("content", v)}
//               anchor="top"
//             />
//           </div>
//         </div>
//         <textarea
//           ref={contentRef}
//           className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 h-40 resize-none"
//           value={form.content || ""}
//           onChange={e => set("content", e.target.value)}
//           placeholder="Основной текст..."
//         />
//         <p className="text-[10px] text-zinc-300 mt-1">
//           Нажмите 😊 выше → выберите эмодзи → он вставится в позицию курсора
//         </p>
//       </div>

//       {/* ── Actions ── */}
//       <div className="flex gap-3 pt-2">
//         <button onClick={() => onSave(form)} disabled={!form.title || loading}
//           className="flex-1 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition disabled:opacity-40">
//           {loading ? "Сохранение..." : "Сохранить"}
//         </button>
//         {initial.id && onBump && (
//           <button type="button" onClick={() => onBump(initial.id)}
//             title="Поднять пост наверх ленты"
//             className="px-4 py-2.5 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition whitespace-nowrap">
//             ↑ Поднять
//           </button>
//         )}
//         <button onClick={onCancel}
//           className="px-6 py-2.5 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition">
//           Отмена
//         </button>
//       </div>
//     </div>
//   )
// }


// // ─── PhotoGalleryModal ────────────────────────────────────────────────────────
// function PhotoGalleryModal({ photos, startIndex = 0, onClose }) {
//   const [active, setActive] = useState(startIndex)

//   useEffect(() => {
//     const fn = e => {
//       if (e.key === "Escape")      onClose()
//       if (e.key === "ArrowRight")  setActive(a => Math.min(a + 1, photos.length - 1))
//       if (e.key === "ArrowLeft")   setActive(a => Math.max(a - 1, 0))
//     }
//     document.addEventListener("keydown", fn)
//     return () => document.removeEventListener("keydown", fn)
//   }, [photos.length, onClose])

//   return (
//     <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4"
//       onClick={onClose}>
//       <button onClick={onClose}
//         className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center cursor-pointer">✕</button>
//       <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">
//         {active + 1} / {photos.length}
//       </p>
//       <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
//         {active > 0 && (
//           <button onClick={() => setActive(a => a - 1)}
//             className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center cursor-pointer">‹</button>
//         )}
//         <img src={cld.full(photos[active])} alt=""
//           className="max-h-[75vh] max-w-[80vw] object-contain rounded-lg shadow-2xl" />
//         {active < photos.length - 1 && (
//           <button onClick={() => setActive(a => a + 1)}
//             className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center cursor-pointer">›</button>
//         )}
//       </div>
//       {photos.length > 1 && (
//         <div className="flex gap-2 mt-4 flex-wrap justify-center" onClick={e => e.stopPropagation()}>
//           {photos.map((p, i) => (
//             <img key={i} src={cld.thumb(p)} onClick={() => setActive(i)}
//               className={`w-14 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all ${
//                 active === i ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-100"
//               }`} />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // ─── ListingRow ───────────────────────────────────────────────────────────────
// function ListingRow({ listing, onApprove, onReject, onDelete }) {
//   const [rejectOpen,   setRejectOpen]   = useState(false)
//   const [rejectReason, setRejectReason] = useState("")
//   const [gallery,      setGallery]      = useState(null) // null | startIndex

//   const hasPhotos = listing.photos?.length > 0

//   return (
//     <>
//       <div className={`group flex items-start gap-4 p-4 border-b border-zinc-100 hover:bg-zinc-50 transition-colors border-l-4 ${STATUS_BORDER[listing.status] || ""}`}>

//         {/* Фото */}
//         {hasPhotos ? (
//           <div className="relative w-16 h-16 flex-shrink-0 cursor-pointer rounded overflow-hidden bg-zinc-200 group/ph"
//             onClick={() => setGallery(0)}>
//             <img src={cld.admin(listing.photos[0])} className="w-full h-full object-cover transition group-hover/ph:scale-105" />
//             {listing.photos.length > 1 && (
//               <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl">
//                 +{listing.photos.length - 1}
//               </div>
//             )}
//             <div className="absolute inset-0 bg-black/0 group-hover/ph:bg-black/20 flex items-center justify-center transition">
//               <span className="text-white opacity-0 group-hover/ph:opacity-100 transition text-lg drop-shadow">🔍</span>
//             </div>
//           </div>
//         ) : (
//           <div className="w-16 h-16 rounded flex-shrink-0 bg-zinc-100 flex items-center justify-center text-2xl">🛍️</div>
//         )}

//         {/* Инфо */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2 flex-wrap">
//             <p className="font-semibold text-zinc-900 truncate">{listing.title}</p>
//             <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_COLOR[listing.status] || ""}`}>
//               {STATUS_LABEL[listing.status] || listing.status}
//             </span>
//           </div>
//           <p className="text-sm font-medium text-zinc-700 mt-0.5">
//             {listing.price || "—"}
//             <span className="text-xs text-zinc-400 font-normal ml-2">{CAT_LABELS[listing.category] || listing.category}</span>
//           </p>
//           {listing.description && <p className="text-xs text-zinc-500 mt-0.5 truncate">{listing.description}</p>}
//           <div className="flex gap-3 mt-1 flex-wrap">
//             {listing.contactUsername && <span className="text-xs text-blue-600">@{listing.contactUsername}</span>}
//             {listing.contactPhone    && <span className="text-xs text-zinc-500">📞 {listing.contactPhone}</span>}
//             <span className="text-xs text-zinc-400">TG: {listing.telegramId}</span>
//             {hasPhotos && (
//               <button onClick={() => setGallery(0)}
//                 className="text-xs text-zinc-400 hover:text-zinc-700 underline cursor-pointer transition">
//                 📷 {listing.photos.length} фото
//               </button>
//             )}
//           </div>
//           {listing.rejectReason && <p className="text-xs text-red-400 mt-1">Причина: {listing.rejectReason}</p>}
//           {listing.status === "published" && listing.expiresAt && (
//             <p className="text-xs text-zinc-400 mt-0.5">Истекает: {new Date(listing.expiresAt).toLocaleDateString("ru-RU")}</p>
//           )}
//         </div>

//         {/* Кнопки */}
//         <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//           {listing.status === "pending" && (
//             <button onClick={() => onApprove(listing.id)}
//               className="px-3 py-1.5 text-xs font-bold border border-green-300 text-green-600 rounded hover:bg-green-500 hover:text-white hover:border-green-500 transition-all whitespace-nowrap">
//               ✓ Одобрить
//             </button>
//           )}
//           {listing.status === "pending" && (
//             rejectOpen ? (
//               <div className="flex flex-col gap-1">
//                 <input autoFocus value={rejectReason} onChange={e => setRejectReason(e.target.value)}
//                   placeholder="Причина (опционально)"
//                   className="w-36 text-xs border border-red-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-400"
//                   onKeyDown={e => {
//                     if (e.key === "Enter")  { onReject(listing.id, rejectReason); setRejectOpen(false) }
//                     if (e.key === "Escape") setRejectOpen(false)
//                   }} />
//                 <div className="flex gap-1">
//                   <button onClick={() => { onReject(listing.id, rejectReason); setRejectOpen(false) }}
//                     className="flex-1 py-1 text-xs font-bold bg-red-500 text-white rounded hover:bg-red-600 transition">Отклонить</button>
//                   <button onClick={() => setRejectOpen(false)}
//                     className="px-2 py-1 text-xs border border-zinc-200 rounded hover:bg-zinc-100 transition">✕</button>
//                 </div>
//               </div>
//             ) : (
//               <button onClick={() => setRejectOpen(true)}
//                 className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 rounded hover:bg-red-500 hover:text-white hover:border-red-500 transition-all whitespace-nowrap">
//                 ✕ Отклонить
//               </button>
//             )
//           )}
//           <button onClick={() => onDelete(listing.id)}
//             className="px-3 py-1.5 text-xs font-medium border border-zinc-200 text-zinc-400 rounded hover:bg-red-500 hover:text-white hover:border-red-500 transition-all whitespace-nowrap">
//             🗑 Удалить
//           </button>
//         </div>
//       </div>
//       {gallery !== null && (
//         <PhotoGalleryModal photos={listing.photos} startIndex={gallery} onClose={() => setGallery(null)} />
//       )}
//     </>
//   )
// }


// // ─── AdminPage ────────────────────────────────────────────────────────────────
// export default function AdminPage() {
//   // Блог
//   const [posts,    setPosts]    = useState([])
//   const [loading,  setLoading]  = useState(true)
//   const [saving,   setSaving]   = useState(false)
//   const [editing,  setEditing]  = useState(null)
//   const [creating, setCreating] = useState(false)
//   const [search,   setSearch]   = useState("")
//   const [activeTag, setActiveTag] = useState("all")

//   // Авторизация
//   const [authed,   setAuthed]   = useState(false)
//   const [keyInput, setKeyInput] = useState("")

//   // Барахолка
//   const [tab,           setTab]           = useState("blog") // "blog" | "market"
//   const [listings,      setListings]      = useState([])
//   const [lLoading,      setLLoading]      = useState(false)
//   const [lSearch,       setLSearch]       = useState("")
//   const [lStatus,       setLStatus]       = useState("all")

//   useEffect(() => { if (sessionStorage.getItem("admin_authed") === "1") setAuthed(true) }, [])
//   useEffect(() => {
//     if (!authed) return
//     if (tab === "blog")   loadPosts()
//     if (tab === "market") loadListings()
//   }, [authed, tab])

//   // ── Авторизация ──────────────────────────────────────────────────────────
//   function login() {
//     if (keyInput === ADMIN_KEY) { sessionStorage.setItem("admin_authed","1"); setAuthed(true) }
//     else alert("Неверный ключ")
//   }
//   function logout() { sessionStorage.removeItem("admin_authed"); setAuthed(false); setKeyInput("") }

//   // ── Блог ─────────────────────────────────────────────────────────────────
//   async function loadPosts() {
//     setLoading(true)
//     try {
//       const r = await fetch(`${API_URL}/api/blog?all=1`, { headers: headers() })
//       setPosts(await r.json())
//     } finally { setLoading(false) }
//   }
//   async function approvePost(id) {
//     await fetch(`${API_URL}/api/blog/${id}/approve`, { method: "PATCH", headers: headers() })
//     loadPosts()
//   }
//   async function deletePost(id) {
//     if (!confirm("Удалить пост?")) return
//     await fetch(`${API_URL}/api/blog/${id}`, { method: "DELETE", headers: headers() })
//     setPosts(p => p.filter(x => x.id !== id))
//   }
//   async function bumpPost(id) {
//     await fetch(`${API_URL}/api/blog/${id}/bump`, { method: "POST", headers: headers() })
//     loadPosts()
//   }
//   async function savePost(form) {
//     setSaving(true)
//     try {
//       const isNew = !form.id
//       const id    = form.id || form.title.toLowerCase().replace(/[^a-zа-яё0-9\s]/gi,"").trim().replace(/\s+/g,"-").slice(0,50)+`-${Date.now()}`
//       const body  = { ...form, id, source: "admin" }
//       await fetch(`${API_URL}/api/blog${isNew?"":`/${id}`}`, {
//         method: isNew ? "POST" : "PUT",
//         headers: headers({ "Content-Type": "application/json" }),
//         body: JSON.stringify(body),
//       })
//       setEditing(null); setCreating(false); loadPosts()
//     } finally { setSaving(false) }
//   }

//   // ── Барахолка ─────────────────────────────────────────────────────────────
//   async function loadListings() {
//     setLLoading(true)
//     try {
//       const r = await fetch(`${API_URL}/api/listings?all=1`, { headers: headers() })
//       setListings(await r.json())
//     } finally { setLLoading(false) }
//   }
//   async function approveListing(id) {
//     await fetch(`${API_URL}/api/listings/${id}/approve`, { method: "PATCH", headers: headers() })
//     loadListings()
//   }
//   async function rejectListing(id, reason = "") {
//     await fetch(`${API_URL}/api/listings/${id}/reject`, {
//       method: "PATCH",
//       headers: headers({ "Content-Type": "application/json" }),
//       body: JSON.stringify({ reason }),
//     })
//     loadListings()
//   }
//   async function deleteListing(id) {
//     if (!confirm("Удалить объявление и фото из Cloudinary?")) return
//     await fetch(`${API_URL}/api/listings/${id}`, { method: "DELETE", headers: headers() })
//     setListings(l => l.filter(x => x.id !== id))
//   }

//   // ── Фильтры ───────────────────────────────────────────────────────────────
//   const filteredPosts = posts
//     .filter(p => activeTag === "all" || p.tags?.includes(activeTag))
//     .filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()))

//   const filteredListings = listings
//     .filter(l => lStatus === "all" || l.status === lStatus)
//     .filter(l => !lSearch || l.title?.toLowerCase().includes(lSearch.toLowerCase()))

//   const pendingCount = listings.filter(l => l.status === "pending").length

//   // ── Экран входа ───────────────────────────────────────────────────────────
//   if (!authed) return (
//     <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//       <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
//         <h1 className="text-2xl font-bold mb-6">Админ панель</h1>
//         <input type="password"
//           className="w-full border border-zinc-200 rounded-lg px-3 py-2 mb-3 text-sm"
//           placeholder="Admin key" value={keyInput}
//           onChange={e => setKeyInput(e.target.value)}
//           onKeyDown={e => e.key === "Enter" && login()} />
//         <button onClick={login}
//           className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition">
//           Войти
//         </button>
//       </div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-zinc-50">

//       {/* Шапка */}
//       <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-zinc-900">Админ панель</h1>
//           {/* Вкладки */}
//           <div className="flex gap-1 mt-2">
//             {[
//               { id: "blog",   label: "📝 Блог",      count: posts.length,    badge: 0 },
//               { id: "market", label: "🛍️ Барахолка", count: listings.length, badge: pendingCount },
//             ].map(t => (
//               <button key={t.id} onClick={() => setTab(t.id)}
//                 className={`relative px-3 py-1 rounded-lg text-sm font-medium transition-all ${
//                   tab === t.id ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"
//                 }`}>
//                 {t.label}
//                 <span className={`ml-1.5 text-xs ${tab === t.id ? "opacity-60" : "opacity-40"}`}>{t.count}</span>
//                 {t.badge > 0 && (
//                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
//                     {t.badge}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="flex gap-3">
//           {tab === "blog" && (
//             <button onClick={() => setCreating(true)}
//               className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition">
//               + Новый пост
//             </button>
//           )}
//           {tab === "market" && (
//             <button onClick={loadListings} disabled={lLoading}
//               className="px-4 py-2 border border-zinc-200 text-zinc-500 rounded-lg text-sm hover:bg-zinc-50 transition disabled:opacity-40">
//               {lLoading ? "⏳" : "↻ Обновить"}
//             </button>
//           )}
//           <button onClick={logout}
//             className="px-4 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition">
//             Выйти
//           </button>
//         </div>
//       </div>

//       {/* ── Вкладка БЛОГ ─────────────────────────────────────────────────── */}
//       {tab === "blog" && (
//         <>
//           <div className="bg-white border-b border-zinc-100 px-6 py-3 flex gap-3 flex-wrap items-center">
//             <input className="border border-zinc-200 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-zinc-900"
//               placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} />
//             <div className="flex gap-2 flex-wrap">
//               {["all", ...TAGS].map(tag => (
//                 <button key={tag} onClick={() => setActiveTag(tag)}
//                   className={`px-3 py-1 rounded-full text-xs border transition-all ${
//                     activeTag === tag ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
//                   }`}>#{tag}</button>
//               ))}
//             </div>
//           </div>
//           <div className="max-w-4xl mx-auto mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
//             {loading ? (
//               <div className="p-12 text-center text-zinc-400">Загрузка...</div>
//             ) : filteredPosts.length === 0 ? (
//               <div className="p-12 text-center text-zinc-400">Постов не найдено</div>
//             ) : filteredPosts.map(post => (
//               <PostRow key={post.id} post={post} onEdit={setEditing} onDelete={deletePost} onApprove={approvePost} />
//             ))}
//           </div>
//         </>
//       )}

//       {/* ── Вкладка БАРАХОЛКА ────────────────────────────────────────────── */}
//       {tab === "market" && (
//         <>
//           <div className="bg-white border-b border-zinc-100 px-6 py-3 flex gap-3 flex-wrap items-center">
//             <input className="border border-zinc-200 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-zinc-900"
//               placeholder="Поиск по названию..." value={lSearch} onChange={e => setLSearch(e.target.value)} />
//             <div className="flex gap-2 flex-wrap">
//               {[
//                 { id: "all",       label: "Все",             cnt: listings.length },
//                 { id: "pending",   label: "⏳ Ожидают",      cnt: listings.filter(l=>l.status==="pending").length },
//                 { id: "published", label: "✅ Опубликовано", cnt: listings.filter(l=>l.status==="published").length },
//                 { id: "rejected",  label: "❌ Отклонено",    cnt: listings.filter(l=>l.status==="rejected").length },
//                 { id: "expired",   label: "🕐 Истекло",      cnt: listings.filter(l=>l.status==="expired").length },
//               ].map(f => (
//                 <button key={f.id} onClick={() => setLStatus(f.id)}
//                   className={`px-3 py-1 rounded-full text-xs border transition-all ${
//                     lStatus === f.id ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
//                   }`}>
//                   {f.label}{f.cnt > 0 && <span className={`ml-1 ${lStatus===f.id?"text-white/60":"text-zinc-400"}`}>{f.cnt}</span>}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="max-w-4xl mx-auto mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
//             {lLoading ? (
//               <div className="p-12 text-center text-zinc-400">Загрузка...</div>
//             ) : filteredListings.length === 0 ? (
//               <div className="p-12 text-center text-zinc-400">
//                 {lStatus === "pending" ? "Нет объявлений на модерации 🎉" : "Объявлений не найдено"}
//               </div>
//             ) : filteredListings.map(l => (
//               <ListingRow key={l.id} listing={l}
//                 onApprove={approveListing} onReject={rejectListing} onDelete={deleteListing} />
//             ))}
//           </div>
//         </>
//       )}

//       {/* Модалки блога */}
//       {editing && (
//         <Modal title="Редактировать пост" onClose={() => setEditing(null)}>
//           <PostForm initial={editing} onSave={savePost} onCancel={() => setEditing(null)} onBump={bumpPost} loading={saving} />
//         </Modal>
//       )}
//       {creating && (
//         <Modal title="Новый пост" onClose={() => setCreating(false)}>
//           <PostForm onSave={savePost} onCancel={() => setCreating(false)} loading={saving} />
//         </Modal>
//       )}
//     </div>
//   )
// }

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

  const posClass = anchor === "top" ? "bottom-full mb-1" : "top-full mt-1"

  return (
    <div ref={wrapRef}
      className={`absolute right-0 ${posClass} z-[100] w-[320px] bg-white border border-zinc-200 rounded-xl shadow-2xl flex flex-col overflow-hidden`}
      onClick={e => e.stopPropagation()}>

      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 bg-zinc-50">
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 font-futura">Эмодзи</span>
        <button onClick={onClose} className="text-zinc-300 hover:text-zinc-600 text-base leading-none transition-colors cursor-pointer">✕</button>
      </div>

      <div className="px-3 pt-2 pb-1.5 border-b border-zinc-100">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-300 text-sm">🔍</span>
          <input ref={searchRef} type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full text-sm pl-8 pr-8 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent font-futura"
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 text-xs cursor-pointer">✕</button>
          )}
        </div>
      </div>

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
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 font-futura">{cat.label}</span>
            </div>
            <div className="grid p-1.5" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
              {cat.emojis.length === 0
                ? <div className="col-span-8 py-5 text-center text-zinc-300 text-[11px] uppercase tracking-widest font-futura">пусто</div>
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
      </div>

      <div className="px-3 py-1.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-zinc-300 text-[9px] font-futura">
          {recent.length > 0 ? `Недавние: ${recent.slice(0, 5).join(" ")}` : "Выберите эмодзи"}
        </span>
        {recent.length > 0 && (
          <button onClick={() => { saveRecent([]); setRecent([]) }}
            className="text-zinc-300 hover:text-zinc-500 text-[9px] cursor-pointer transition-colors font-futura">
            Очистить
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Hook: вставка эмодзи в позицию курсора ──────────────────────────────────

function useEmojiInsert(value, onChange) {
  const ref = useRef(null)

  const insert = useCallback((emoji) => {
    const el = ref.current
    if (!el) { onChange(value + emoji); return }
    const start = el.selectionStart ?? value.length
    const end   = el.selectionEnd   ?? value.length
    const next  = value.slice(0, start) + emoji + value.slice(end)
    onChange(next)
    const pos = start + emoji.length
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(pos, pos)
    })
  }, [value, onChange])

  return { ref, insert }
}

// ─── EmojiFieldButton ─────────────────────────────────────────────────────────

function EmojiFieldButton({ value, onChange, anchor = "bottom" }) {
  const [open, setOpen] = useState(false)
  const { insert } = useEmojiInsert(value, onChange)

  return (
    <div className="relative flex-shrink-0">
      <button type="button"
        onClick={() => setOpen(v => !v)}
        title="Вставить эмодзи"
        className={`h-9 w-9 flex items-center justify-center border rounded-lg text-base transition-all cursor-pointer font-futura ${
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

// ─── Modal (улучшенный - закрывается только по X или при сохранении) ──────────

function Modal({ title, onClose, children, noCloseOnOutside = true }) {
  const contentRef = useRef(null)

  const handleBackdropClick = (e) => {
    if (noCloseOnOutside) return
    if (contentRef.current && !contentRef.current.contains(e.target)) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={contentRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <h2 className="text-xl font-bold text-zinc-900 font-futura">{title}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 text-2xl leading-none transition-colors cursor-pointer">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── ПОЛНАЯ Post Form со ВСЕМ функционалом ────────────────────────────────────

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
    source:  "",  // Пустой source чтобы убрать "от админа"
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

  const titleRef   = useRef()
  const excerptRef = useRef()
  const contentRef = useRef()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Проверка наличия видео для индикатора
  const hasVideo = !!(form.url || form.video || (form.videos && form.videos.length > 0))

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

      {/* ── Короткое описание - ПЕРВОЕ ПОЛЕ ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide font-futura">Краткое описание</label>
        <div className="mt-1 flex gap-1.5 items-center relative">
          <textarea
            ref={excerptRef}
            className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 font-futura resize-none"
            rows="6"
            value={form.excerpt || ""}
            onChange={e => set("excerpt", e.target.value)}
            placeholder="Краткое описание для превью (2-3 предложения)"
          />
          <EmojiFieldButton
            value={form.excerpt || ""}
            onChange={v => set("excerpt", v)}
            anchor="bottom"
          />
        </div>
      </div>

      {/* ── Заголовок - ВТОРОЕ ПОЛЕ ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide font-futura">Заголовок *</label>
        <div className="mt-1 flex gap-1.5 items-center relative">
          <input
            ref={titleRef}
            className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-zinc-900 font-futura"
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
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide font-futura">Дата</label>
        <input type="date"
          className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 font-futura"
          value={form.date} onChange={e => set("date", e.target.value)} />
      </div>

      {/* ── Теги с произвольным вводом ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide font-futura">Теги</label>

        {/* Активные теги с крестиком */}
        {form.tags.length > 0 && (
          <div className="mt-1 flex gap-1.5 flex-wrap mb-2">
            {form.tags.map(tag => (
              <span key={tag}
                className="flex items-center gap-1 px-2.5 py-0.5 bg-zinc-900 text-white text-xs rounded-full font-futura">
                #{tag}
                <button type="button" onClick={() => set("tags", form.tags.filter(t => t !== tag))}
                  className="text-white/50 hover:text-white leading-none cursor-pointer">✕</button>
              </span>
            ))}
          </div>
        )}

        {/* Быстрые пресеты */}
        <div className="flex gap-1.5 flex-wrap mb-2">
          {TAGS.filter(t => !form.tags.includes(t)).map(tag => (
            <button key={tag} type="button" onClick={() => toggleTag(tag)}
              className="px-2.5 py-0.5 rounded-full text-xs border border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-600 hover:text-zinc-700 transition-all cursor-pointer font-futura">
              +#{tag}
            </button>
          ))}
        </div>

        {/* Произвольный тег — Enter чтобы добавить */}
        <input
          className="w-full border border-zinc-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 font-futura"
          placeholder="Новый тег → Enter"
          onKeyDown={e => {
            if (e.key !== "Enter") return
            e.preventDefault()
            const val = e.target.value.trim().toLowerCase().replace(/\s+/g, "-")
            if (val && !form.tags.includes(val)) set("tags", [...form.tags, val])
            e.target.value = ""
          }}
        />
      </div>

      {/* ── Обложка ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide font-futura">Обложка / Фото</label>
        <div className="mt-1 flex gap-2">
          <input
            className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 font-futura"
            value={form.cover || ""} onChange={e => set("cover", e.target.value)}
            placeholder="URL или загрузи файл" />
          <button type="button" onClick={() => fileRef.current.click()} disabled={uploading}
            className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap cursor-pointer font-futura disabled:opacity-50">
            {uploading ? "⏳" : "📎 Загрузить"}
          </button>
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
            onChange={e => e.target.files[0] && uploadFile(e.target.files[0], "cover")} />
        </div>
        {form.cover && <img src={form.cover} className="mt-2 h-24 object-cover rounded-lg" alt="" />}
      </div>

      {/* ── URL (YouTube/Rumble) с индикатором видео ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide font-futura">
          YouTube / Rumble URL
          {hasVideo && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              Видео есть
            </span>
          )}
        </label>
        <input
          className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 font-futura"
          value={form.url || ""} onChange={e => set("url", e.target.value)}
          placeholder="https://youtu.be/..." />
      </div>

      {/* ── Дополнительные видео ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide font-futura">
          Дополнительные видео
          <span className="ml-1 text-zinc-300 normal-case font-normal">(mp4, YouTube, Rumble)</span>
        </label>
        <div className="mt-1 space-y-1.5">
          {(form.videos || []).map((v, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 font-futura"
                value={v}
                onChange={e => {
                  const arr = [...form.videos]
                  arr[i] = e.target.value
                  set("videos", arr)
                }}
                placeholder="URL видео"
              />
              <button type="button"
                onClick={() => set("videos", form.videos.filter((_, idx) => idx !== i))}
                className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition cursor-pointer font-futura">
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <button type="button"
            onClick={() => set("videos", [...(form.videos || []), ""])}
            className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition cursor-pointer font-futura">
            + Добавить URL видео
          </button>
          <button type="button"
            onClick={() => videosRef.current.click()}
            disabled={uploadingExtra}
            className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap cursor-pointer disabled:opacity-50 font-futura">
            {uploadingExtra ? "⏳" : "📎 Загрузить"}
          </button>
          <input ref={videosRef} type="file" accept="video/*" className="hidden" multiple
            onChange={e => {
              [...e.target.files].forEach(f => uploadFile(f, "videos"))
              e.target.value = ""
            }} />
        </div>
      </div>

      {/* ── Дополнительные фото ── */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide font-futura">
          Дополнительные фото
        </label>
        <div className="mt-1 space-y-1.5">
          {(form.photos || []).map((p, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 font-futura"
                value={p}
                onChange={e => {
                  const arr = [...form.photos]
                  arr[i] = e.target.value
                  set("photos", arr)
                }}
                placeholder="URL фото"
              />
              <button type="button"
                onClick={() => set("photos", form.photos.filter((_, idx) => idx !== i))}
                className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition cursor-pointer font-futura">
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <button type="button"
            onClick={() => set("photos", [...(form.photos || []), ""])}
            className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition cursor-pointer font-futura">
            + Добавить URL фото
          </button>
          <button type="button"
            onClick={() => photosRef.current.click()}
            disabled={uploadingExtra}
            className="px-3 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition whitespace-nowrap cursor-pointer disabled:opacity-50 font-futura">
            {uploadingExtra ? "⏳" : "📎 Загрузить"}
          </button>
          <input ref={photosRef} type="file" accept="image/*" className="hidden" multiple
            onChange={e => {
              [...e.target.files].forEach(f => uploadFile(f, "photos"))
              e.target.value = ""
            }} />
        </div>
        {(form.photos || []).length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {form.photos.map((p, i) => (
              <img key={i} src={p} onError={e => e.target.style.display="none"}
                className="h-16 w-24 object-cover rounded-lg border border-zinc-100" alt="" />
            ))}
          </div>
        )}
      </div>

      {/* ── Текст поста ── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide font-futura">Текст поста</label>
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
          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 h-40 resize-none font-futura"
          value={form.content || ""}
          onChange={e => set("content", e.target.value)}
          placeholder="Основной текст..."
        />
        <p className="text-[10px] text-zinc-300 mt-1 font-futura">
          Нажмите 😊 выше → выберите эмодзи → он вставится в позицию курсора
        </p>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)} disabled={!form.title || loading}
          className="flex-1 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition disabled:opacity-40 font-futura">
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
        {initial.id && onBump && (
          <button type="button" onClick={() => onBump(initial.id)}
            title="Поднять пост наверх ленты"
            className="px-4 py-2.5 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition whitespace-nowrap font-futura">
            ↑ Поднять
          </button>
        )}
        <button onClick={onCancel}
          className="px-6 py-2.5 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50 transition font-futura">
          Отмена
        </button>
      </div>
    </div>
  )
}

// ─── Post Row ─────────────────────────────────────────────────────────────────

function PostRow({ post, onEdit, onDelete, onApprove }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Удалить "${post.title}"?`)) return
    setDeleting(true)
    await onDelete(post.id)
  }

  const isPending = post.status === "pending"
  const dateLabel = new Date(post.date).toLocaleDateString("ru-RU")

  return (
    <div className="flex items-center gap-4 p-4 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors">
      {post.cover && (
        <img src={post.cover} alt="" className="w-16 h-16 object-cover rounded flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-zinc-900 truncate font-futura">
          {post.title}
          {isPending && <span className="ml-2 text-xs text-orange-600 font-futura">⏳ pending</span>}
        </h3>
        <p className="text-sm text-zinc-500 font-futura">{dateLabel} · {post.type}</p>
        {post.tags?.length > 0 && (
          <div className="flex gap-1.5 mt-1">
            {post.tags.map(t => (
              <span key={t} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-futura">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0">
        {isPending && (
          <button onClick={() => onApprove(post.id)}
            className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition font-futura">
            ✓ Опубликовать
          </button>
        )}
        <button onClick={() => onEdit(post)}
          className="px-3 py-1.5 border border-zinc-200 text-zinc-600 text-xs rounded hover:bg-zinc-50 transition font-futura">
          Редактировать
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="px-3 py-1.5 border border-red-200 text-red-600 text-xs rounded hover:bg-red-50 transition disabled:opacity-40 font-futura">
          {deleting ? "⏳" : "Удалить"}
        </button>
      </div>
    </div>
  )
}

// ─── Listing Row ──────────────────────────────────────────────────────────────

function ListingRow({ listing, onApprove, onReject, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  return (
    <div className="flex items-start gap-4 p-4 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors">
      {listing.photos?.[0] && (
        <img src={listing.photos[0]} alt="" className="w-20 h-20 object-cover rounded flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-zinc-900 font-futura">{listing.title}</h3>
        <p className="text-sm text-zinc-600 mt-1 font-futura">{listing.price} · {listing.category}</p>
        <p className="text-xs text-zinc-400 mt-1 font-futura">
          {listing.status} · {new Date(listing.createdAt).toLocaleDateString("ru-RU")}
        </p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        {listing.status === "pending" && (
          <>
            <button onClick={() => onApprove(listing.id)}
              className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition font-futura">
              ✓ Approve
            </button>
            <button onClick={() => {
              const reason = prompt("Причина отклонения:")
              if (reason) onReject(listing.id, reason)
            }}
              className="px-3 py-1.5 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition font-futura">
              ✕ Reject
            </button>
          </>
        )}
        <button onClick={async () => {
          if (confirm("Delete this listing?")) {
            setDeleting(true)
            await onDelete(listing.id)
          }
        }} disabled={deleting}
          className="px-3 py-1.5 border border-red-200 text-red-600 text-xs rounded hover:bg-red-50 transition font-futura">
          {deleting ? "⏳" : "Delete"}
        </button>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Main Admin Page
// ═════════════════════════════════════════════════════════════════════════════

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [keyInput, setKeyInput] = useState("")

  const [tab, setTab] = useState("blog")

  // Blog state
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState("")
  const [activeTag, setActiveTag] = useState("all")

  // Marketplace state
  const [listings, setListings] = useState([])
  const [lLoading, setLLoading] = useState(false)
  const [lSearch, setLSearch] = useState("")
  const [lStatus, setLStatus] = useState("all")

  const filteredPosts = posts
    .filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()))
    .filter(p => activeTag === "all" || p.tags?.includes(activeTag))

  const filteredListings = listings
    .filter(l => !lSearch || l.title?.toLowerCase().includes(lSearch.toLowerCase()))
    .filter(l => lStatus === "all" || l.status === lStatus)

  const pendingCount = listings.filter(l => l.status === "pending").length

  // ─── Blog API ─────────────────────────────────────────────────────────────

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/blog?all=1`, { headers: headers() })
      if (!res.ok) throw new Error()
      setPosts(await res.json())
    } catch {
      alert("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  async function savePost(data) {
    setSaving(true)
    try {
      const url = editing ? `${API_URL}/api/blog/${data.id}` : `${API_URL}/api/blog`
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error()
      await loadPosts()
      setEditing(null)
      setCreating(false)
    } catch {
      alert("Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function deletePost(id) {
    try {
      const res = await fetch(`${API_URL}/api/blog/${id}`, {
        method: "DELETE",
        headers: headers()
      })
      if (!res.ok) throw new Error()
      await loadPosts()
    } catch {
      alert("Delete failed")
    }
  }

  async function approvePost(id) {
    try {
      const res = await fetch(`${API_URL}/api/blog/${id}/approve`, {
        method: "PATCH",
        headers: headers()
      })
      if (!res.ok) throw new Error()
      await loadPosts()
    } catch {
      alert("Approve failed")
    }
  }

  async function bumpPost(id) {
    try {
      const res = await fetch(`${API_URL}/api/blog/${id}/bump`, {
        method: "POST",
        headers: headers()
      })
      if (!res.ok) throw new Error()
      await loadPosts()
      setEditing(null)
    } catch {
      alert("Bump failed")
    }
  }

  // ─── Marketplace API ──────────────────────────────────────────────────────

  async function loadListings() {
    setLLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/listings?all=1`, { headers: headers() })
      if (!res.ok) throw new Error()
      setListings(await res.json())
    } catch {
      alert("Failed to load listings")
    } finally {
      setLLoading(false)
    }
  }

  async function approveListing(id) {
    try {
      const res = await fetch(`${API_URL}/api/listings/${id}/approve`, {
        method: "PATCH",
        headers: headers()
      })
      if (!res.ok) throw new Error()
      await loadListings()
    } catch {
      alert("Approve failed")
    }
  }

  async function rejectListing(id, reason) {
    try {
      const res = await fetch(`${API_URL}/api/listings/${id}/reject`, {
        method: "PATCH",
        headers: headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ reason })
      })
      if (!res.ok) throw new Error()
      await loadListings()
    } catch {
      alert("Reject failed")
    }
  }

  async function deleteListing(id) {
    try {
      const res = await fetch(`${API_URL}/api/listings/${id}`, {
        method: "DELETE",
        headers: headers()
      })
      if (!res.ok) throw new Error()
      await loadListings()
    } catch {
      alert("Delete failed")
    }
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const stored = localStorage.getItem("ap_key")
    if (stored === ADMIN_KEY) {
      setAuthed(true)
      loadPosts()
      loadListings()
    }
  }, [])

  function login() {
    if (keyInput === ADMIN_KEY) {
      localStorage.setItem("ap_key", keyInput)
      setAuthed(true)
      loadPosts()
      loadListings()
    } else {
      alert("Wrong key")
    }
  }

  function logout() {
    localStorage.removeItem("ap_key")
    setAuthed(false)
  }

  // ─── Login screen ─────────────────────────────────────────────────────────

  if (!authed) return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-zinc-900 mb-6 text-center font-futura">Admin Login</h1>
        <input type="password"
          className="w-full border border-zinc-200 rounded-lg px-3 py-2 mb-3 text-sm font-futura"
          placeholder="Admin key" value={keyInput}
          onChange={e => setKeyInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()} />
        <button onClick={login}
          className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition font-futura">
          Войти
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-50">

      {/* Шапка */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 font-futura">Админ панель</h1>
          <div className="flex gap-1 mt-2">
            {[
              { id: "blog",   label: "📝 Блог",      count: posts.length,    badge: 0 },
              { id: "market", label: "🛍️ Барахолка", count: listings.length, badge: pendingCount },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`relative px-3 py-1 rounded-lg text-sm font-medium transition-all font-futura ${
                  tab === t.id ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"
                }`}>
                {t.label}
                <span className={`ml-1.5 text-xs ${tab === t.id ? "opacity-60" : "opacity-40"}`}>{t.count}</span>
                {t.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          {tab === "blog" && (
            <button onClick={() => setCreating(true)}
              className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition font-futura">
              + Новый пост
            </button>
          )}
          {tab === "market" && (
            <button onClick={loadListings} disabled={lLoading}
              className="px-4 py-2 border border-zinc-200 text-zinc-500 rounded-lg text-sm hover:bg-zinc-50 transition disabled:opacity-40 font-futura">
              {lLoading ? "⏳" : "↻ Обновить"}
            </button>
          )}
          <button onClick={logout}
            className="px-4 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition font-futura">
            Выйти
          </button>
        </div>
      </div>

      {/* ── Вкладка БЛОГ ─────────────────────────────────────────────────── */}
      {tab === "blog" && (
        <>
          <div className="bg-white border-b border-zinc-100 px-6 py-3 flex gap-3 flex-wrap items-center">
            <input className="border border-zinc-200 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-futura"
              placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} />
            <div className="flex gap-2 flex-wrap">
              {["all", ...TAGS].map(tag => (
                <button key={tag} onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all font-futura ${
                    activeTag === tag ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
                  }`}>#{tag}</button>
              ))}
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-zinc-400 font-futura">Загрузка...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 font-futura">Постов не найдено</div>
            ) : filteredPosts.map(post => (
              <PostRow key={post.id} post={post} onEdit={setEditing} onDelete={deletePost} onApprove={approvePost} />
            ))}
          </div>
        </>
      )}

      {/* ── Вкладка БАРАХОЛКА ────────────────────────────────────────────── */}
      {tab === "market" && (
        <>
          <div className="bg-white border-b border-zinc-100 px-6 py-3 flex gap-3 flex-wrap items-center">
            <input className="border border-zinc-200 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-futura"
              placeholder="Поиск по названию..." value={lSearch} onChange={e => setLSearch(e.target.value)} />
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "all",       label: "Все",             cnt: listings.length },
                { id: "pending",   label: "⏳ Ожидают",      cnt: listings.filter(l=>l.status==="pending").length },
                { id: "published", label: "✅ Опубликовано", cnt: listings.filter(l=>l.status==="published").length },
                { id: "rejected",  label: "❌ Отклонено",    cnt: listings.filter(l=>l.status==="rejected").length },
                { id: "expired",   label: "🕐 Истекло",      cnt: listings.filter(l=>l.status==="expired").length },
              ].map(f => (
                <button key={f.id} onClick={() => setLStatus(f.id)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all font-futura ${
                    lStatus === f.id ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
                  }`}>
                  {f.label}{f.cnt > 0 && <span className={`ml-1 ${lStatus===f.id?"text-white/60":"text-zinc-400"}`}>{f.cnt}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
            {lLoading ? (
              <div className="p-12 text-center text-zinc-400 font-futura">Загрузка...</div>
            ) : filteredListings.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 font-futura">
                {lStatus === "pending" ? "Нет объявлений на модерации 🎉" : "Объявлений не найдено"}
              </div>
            ) : filteredListings.map(l => (
              <ListingRow key={l.id} listing={l}
                onApprove={approveListing} onReject={rejectListing} onDelete={deleteListing} />
            ))}
          </div>
        </>
      )}

      {/* Модалки блога - закрываются только по X или при сохранении */}
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