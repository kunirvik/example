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

// ── КАТЕГОРІЇ ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",      label: "ВСІ"         },
  { id: "mtb",      label: "MTB"         },
  { id: "bmx",      label: "BMX"         },
  { id: "skate",    label: "SKATE"       },
  { id: "parts",    label: "ЗАПЧАСТИНИ"  },
  { id: "clothing", label: "ОДЯГ"        },
  { id: "other",    label: "ІНШЕ"        },
]

const BOT_URL = `https://t.me/${import.meta.env.VITE_MARKETPLACE_BOT_USERNAME || "your_market_bot"}`

// ── SVG ІКОНКИ ────────────────────────────────────────────────────────────────
const EyeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const ClockIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
)

const PhoneIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
  </svg>
)

// ─────────────────────────────────────────────────────────────────────────────
// Lightbox
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
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 font-futura"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-red-500/20 text-white text-xl flex items-center justify-center cursor-pointer transition"
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
            className="w-10 h-10 bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center cursor-pointer flex-shrink-0 transition"
          >‹</button>
        )}

        <img
          src={cldUrl(photos[active], { w: 1200, h: 900, crop: "limit" })}
          alt=""
          className="max-h-[80vh] max-w-[85vw] object-contain select-none"
          draggable={false}
        />

        {active < photos.length - 1 && (
          <button
            onClick={() => setActive(a => a + 1)}
            className="w-10 h-10 bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center cursor-pointer flex-shrink-0 transition"
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
              className={`w-14 h-14 object-cover cursor-pointer border-2 transition-all select-none ${
                active === i
                  ? "border-green-500 scale-110"
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
// PhotoGallery
// ─────────────────────────────────────────────────────────────────────────────
function PhotoGallery({ photos }) {
  const [active,    setActive]    = useState(0)
  const [lightbox,  setLightbox]  = useState(false)

  if (!photos?.length) return (
    <div className="w-full h-52 bg-neutral-800 flex items-center justify-center text-4xl select-none text-neutral-600">
      ⬚
    </div>
  )

  return (
    <>
      <div
        className="relative cursor-zoom-in group"
        onClick={e => { e.stopPropagation(); setLightbox(true) }}
      >
        <img
          src={cldUrl(photos[active], { w: 600, h: 400 })}
          alt=""
          className="w-full h-52 object-cover pointer-events-none select-none group-hover:brightness-110 transition-all"
          loading="lazy"
          draggable={false}
        />

        {photos.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 select-none font-futura">
            {active + 1}/{photos.length}
          </div>
        )}

        {photos.length > 1 && (
          <div
            className="absolute bottom-2 left-2 flex gap-1"
            onClick={e => e.stopPropagation()}
          >
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-1.5 h-1.5 transition-all ${
                  active === i ? "bg-green-500 scale-125" : "bg-white/50"
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
    <div className="bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-neutral-700 hover:shadow-lg transition-all duration-200">
      <PhotoGallery photos={listing.photos} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-xl font-bold text-white font-futura">{listing.price || "ДОГОВІРНА"}</p>
          {/* ViewCount - тільки тут, вгорі справа */}
          <div className="flex items-center gap-1.5 text-neutral-400">
            <EyeIcon className="w-4 h-4" />
            <span className="text-sm font-futura font-medium">{listing.viewCount || 0}</span>
          </div>
        </div>
        
        <h3 className="text-sm font-medium text-neutral-200 leading-snug font-futura uppercase tracking-wide">
          {listing.title}
        </h3>

        {listing.description && (
          <div className="mt-2">
            <p className={`text-xs text-neutral-400 leading-relaxed font-futura ${!expanded && hasLong ? "line-clamp-2" : ""}`}>
              {listing.description}
            </p>
            {hasLong && (
              <button
                onClick={() => setExpanded(e => !e)}
                className="text-xs text-neutral-500 hover:text-green-500 mt-1 transition-colors cursor-pointer font-futura"
              >
                {expanded ? "ЗГОРНУТИ ↑" : "ЧИТАТИ ↓"}
              </button>
            )}
          </div>
        )}

        <div className="border-t border-neutral-800 mt-3 pt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              {listing.contactUsername && (
                <a href={`https://t.me/${listing.contactUsername}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-green-500 hover:text-green-400 font-medium transition-colors font-futura">
                  @{listing.contactUsername}
                </a>
              )}
              {listing.contactPhone && (
                <a href={`tel:${listing.contactPhone}`}
                  className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-1.5 font-futura">
                  <PhoneIcon className="w-3.5 h-3.5" />
                  {listing.contactPhone}
                </a>
              )}
            </div>
            {listing.contactUsername && (
              <a href={`https://t.me/${listing.contactUsername}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium transition-colors font-futura uppercase tracking-wider">
                НАПИСАТИ
              </a>
            )}
          </div>

          <p className="text-[10px] text-neutral-600 mt-2 font-futura uppercase tracking-wide">
            {new Date(listing.createdAt).toLocaleDateString("uk-UA", { day: "numeric", month: "long" })}
            {listing.expiresAt && (
              <span> · ДО {new Date(listing.expiresAt).toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}</span>
            )}
          </p>
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
  const [sortBy,   setSortBy]   = useState("date")

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

  const totalViews = listings.reduce((sum, l) => sum + (l.viewCount || 0), 0)

  return (
    <div className="min-h-screen bg-neutral-950 font-futura">
      <div className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white uppercase tracking-tight">БАРАХОЛКА</h1>
              <p className="text-sm text-neutral-400 mt-1 uppercase tracking-wide">
                {listings.length > 0 
                  ? `${listings.length} ОГОЛОШЕНЬ · ${totalViews} ПЕРЕГЛЯДІВ`
                  : "ОГОЛОШЕННЯ ВІД УЧАСНИКІВ"
                }
              </p>
            </div>
            <a href={BOT_URL} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors uppercase tracking-wider">
              + ПОДАТИ
            </a>
          </div>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="ПОШУК..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] max-w-sm bg-neutral-800 border border-neutral-700 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 transition-colors uppercase tracking-wide"
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("date")}
                className={`px-4 py-2.5 text-xs font-medium transition-all uppercase tracking-wider flex items-center gap-2 ${
                  sortBy === "date"
                    ? "bg-green-600 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                <ClockIcon className="w-4 h-4" />
                НОВІ
              </button>
              <button
                onClick={() => setSortBy("views")}
                className={`px-4 py-2.5 text-xs font-medium transition-all uppercase tracking-wider flex items-center gap-2 ${
                  sortBy === "views"
                    ? "bg-green-600 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                <EyeIcon className="w-4 h-4" />
                ПОПУЛЯРНІ
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mt-4">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 text-xs font-medium border transition-all uppercase tracking-wider ${
                  category === cat.id
                    ? "bg-white text-black border-white"
                    : "border-neutral-700 text-neutral-400 hover:border-neutral-500 bg-transparent"
                }`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-neutral-900 border border-neutral-800 overflow-hidden animate-pulse">
                <div className="h-52 bg-neutral-800" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-neutral-800 w-1/3" />
                  <div className="h-3 bg-neutral-800 w-3/4" />
                  <div className="h-3 bg-neutral-800 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-neutral-400 mb-3 uppercase tracking-wide">НЕ ВДАЛОСЯ ЗАВАНТАЖИТИ</p>
            <button onClick={load}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm transition uppercase tracking-wider">
              СПРОБУВАТИ ЗНОВУ
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⬚</p>
            <p className="text-neutral-400 font-medium uppercase tracking-wide">
              {listings.length === 0 ? "ПОКИ НЕМАЄ ОГОЛОШЕНЬ" : "НІЧОГО НЕ ЗНАЙДЕНО"}
            </p>
            <p className="text-neutral-600 text-sm mt-1 uppercase tracking-wide">
              БУДЬТЕ ПЕРШИМ
            </p>
            <a href={BOT_URL} target="_blank" rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition uppercase tracking-wider">
              ВІДКРИТИ БОТА
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