import { useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"

const API_URL = import.meta.env.VITE_API_URL

function cldUrl(url, { w, h, crop = "fill" } = {}) {
  if (!url || !url.includes("cloudinary.com")) return url
  const p = []
  if (w) p.push(`w_${w}`)
  if (h) p.push(`h_${h}`)
  p.push(`c_${crop}`, "q_auto", "f_auto")
  return url.replace("/upload/", `/upload/${p.join(",")}/`)
}

// ── ОНОВЛЕНІ КАТЕГОРІЇ ────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",      label: "Всі"            },
  { id: "mtb",      label: "🚵 MTB"         },
  { id: "bmx",      label: "🚴 BMX"         },
  { id: "skate",    label: "🛹 Skate"       },
  { id: "parts",    label: "🔧 Запчастини"  },
  { id: "clothing", label: "👕 Одяг"        },
  { id: "other",    label: "📦 Інше"        },
]

const BOT_URL = `https://t.me/${import.meta.env.VITE_MARKETPLACE_BOT_USERNAME || "your_market_bot"}`

// ─────────────────────────────────────────────────────────────────────────────
// Lightbox — рендериться через portal в document.body
// ─────────────────────────────────────────────────────────────────────────────
function Lightbox({ photos, startIndex, onClose }) {
  const [active, setActive] = useState(startIndex)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  useEffect(() => {
    const fn = e => {
      if (e.key === "Escape")     onClose()
      if (e.key === "ArrowRight") setActive(a => Math.min(a + 1, photos.length - 1))
      if (e.key === "ArrowLeft")  setActive(a => Math.max(a - 1, 0))
    }
    document.addEventListener("keydown", fn)
    return () => document.removeEventListener("keydown", fn)
  }, [photos.length, onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center cursor-pointer transition"
      >
        ✕
      </button>

      {photos.length > 1 && (
        <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm select-none">
          {active + 1} / {photos.length}
        </p>
      )}

      <div
        className="flex items-center gap-4"
        onClick={e => e.stopPropagation()}
      >
        {active > 0 && (
          <button
            onClick={() => setActive(a => a - 1)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center cursor-pointer flex-shrink-0 transition"
          >‹</button>
        )}

        <img
          src={cldUrl(photos[active], { w: 1200, h: 900, crop: "limit" })}
          alt=""
          className="max-h-[80vh] max-w-[85vw] object-contain rounded-xl select-none"
          draggable={false}
        />

        {active < photos.length - 1 && (
          <button
            onClick={() => setActive(a => a + 1)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center cursor-pointer flex-shrink-0 transition"
          >›</button>
        )}
      </div>

      {photos.length > 1 && (
        <div
          className="flex gap-2 mt-4 flex-wrap justify-center"
          onClick={e => e.stopPropagation()}
        >
          {photos.map((p, i) => (
            <img
              key={i}
              src={cldUrl(p, { w: 80, h: 80 })}
              onClick={() => setActive(i)}
              draggable={false}
              className={`w-14 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all select-none ${
                active === i
                  ? "border-white scale-110"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PhotoGallery — превью з точками-перемикачами
// ─────────────────────────────────────────────────────────────────────────────
function PhotoGallery({ photos }) {
  const [active,    setActive]    = useState(0)
  const [lightbox,  setLightbox]  = useState(false)

  if (!photos?.length) return (
    <div className="w-full h-52 bg-zinc-100 rounded-xl flex items-center justify-center text-4xl select-none">
      🛍️
    </div>
  )

  return (
    <>
      <div
        className="relative cursor-zoom-in"
        onClick={e => { e.stopPropagation(); setLightbox(true) }}
      >
        <img
          src={cldUrl(photos[active], { w: 600, h: 400 })}
          alt=""
          className="w-full h-52 object-cover rounded-xl pointer-events-none select-none"
          loading="lazy"
          draggable={false}
        />

        {photos.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full select-none">
            {active + 1} / {photos.length}
          </div>
        )}

        {photos.length > 1 && (
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
            onClick={e => e.stopPropagation()}
          >
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  active === i ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <Lightbox
          photos={photos}
          startIndex={active}
          onClose={() => setLightbox(false)}
        />
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ListingCard
// ─────────────────────────────────────────────────────────────────────────────
function ListingCard({ listing }) {
  const [expanded, setExpanded] = useState(false)
  const hasLong = listing.description?.length > 100

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <PhotoGallery photos={listing.photos} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xl font-bold text-zinc-900">{listing.price || "Договірна"}</p>
          {/* ViewCount у верхній частині */}
          <div className="flex items-center gap-1 px-2 py-0.5 bg-zinc-50 rounded-full">
            <span className="text-xs text-zinc-400">👁</span>
            <span className="text-xs font-medium text-zinc-600">{listing.viewCount || 0}</span>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-zinc-800 mt-1 leading-snug">{listing.title}</h3>

        {listing.description && (
          <div className="mt-2">
            <p className={`text-xs text-zinc-500 leading-relaxed ${!expanded && hasLong ? "line-clamp-2" : ""}`}>
              {listing.description}
            </p>
            {hasLong && (
              <button
                onClick={() => setExpanded(e => !e)}
                className="text-xs text-zinc-400 hover:text-zinc-700 mt-0.5 transition-colors cursor-pointer"
              >
                {expanded ? "Згорнути ↑" : "Читати далі ↓"}
              </button>
            )}
          </div>
        )}

        <div className="border-t border-zinc-100 mt-3 pt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              {listing.contactUsername && (
                <a href={`https://t.me/${listing.contactUsername}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  @{listing.contactUsername}
                </a>
              )}
              {listing.contactPhone && (
                <a href={`tel:${listing.contactPhone}`}
                  className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors">
                  📞 {listing.contactPhone}
                </a>
              )}
            </div>
            {listing.contactUsername && (
              <a href={`https://t.me/${listing.contactUsername}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-700 transition-colors">
                Написати
              </a>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] text-zinc-300">
              {new Date(listing.createdAt).toLocaleDateString("uk-UA", { day: "numeric", month: "long" })}
              {listing.expiresAt && (
                <span> · до {new Date(listing.expiresAt).toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}</span>
              )}
            </p>
            {/* Завжди показуємо viewCount */}
            <div className="flex items-center gap-1 text-zinc-400">
              <span className="text-[10px]">👁</span>
              <span className="text-[10px] font-medium">{listing.viewCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MarketplacePage
// ─────────────────────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [listings, setListings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [category, setCategory] = useState("all")
  const [search,   setSearch]   = useState("")
  const [sortBy,   setSortBy]   = useState("date") // "date" або "views"

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/listings`)
      if (!res.ok) throw new Error("Помилка завантаження")
      setListings(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = listings
    .filter(l => category === "all" || l.category === category)
    .filter(l => !search || l.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "views") {
        return (b.viewCount || 0) - (a.viewCount || 0)
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Барахолка</h1>
              <p className="text-sm text-zinc-500 mt-1">
                {listings.length > 0 
                  ? `${listings.length} оголошень · ${listings.reduce((sum, l) => sum + (l.viewCount || 0), 0)} переглядів`
                  : "Оголошення від учасників спільноти"
                }
              </p>
            </div>
            <a href={BOT_URL} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 px-4 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-700 transition-colors">
              + Подати оголошення
            </a>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="text"
              placeholder="Пошук по оголошеннях..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 max-w-sm border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50"
            />
            
            {/* Сортування */}
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("date")}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  sortBy === "date"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                🕐 Нові
              </button>
              <button
                onClick={() => setSortBy("views")}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  sortBy === "views"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                👁 Популярні
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mt-3">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  category === cat.id
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-400 bg-white"
                }`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden animate-pulse">
                <div className="h-52 bg-zinc-100" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-zinc-100 rounded w-1/3" />
                  <div className="h-3 bg-zinc-100 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-zinc-400 mb-3">Не вдалося завантажити оголошення</p>
            <button onClick={load}
              className="px-4 py-2 bg-zinc-900 text-white text-sm rounded-lg hover:bg-zinc-700 transition">
              Спробувати знову
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🛍️</p>
            <p className="text-zinc-500 font-medium">
              {listings.length === 0 ? "Поки немає оголошень" : "Нічого не знайдено"}
            </p>
            <p className="text-zinc-400 text-sm mt-1">Будьте першим — подайте оголошення через бота</p>
            <a href={BOT_URL} target="_blank" rel="noopener noreferrer"
              className="inline-block mt-4 px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-700 transition">
              Відкрити бота
            </a>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}