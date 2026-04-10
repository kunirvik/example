

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

const TagIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

// ── ГЕНЕРАТОР УНИКАЛЬНОГО ID ПОЛЬЗОВАТЕЛЯ ─────────────────────────────────────
function getViewerId() {
  let viewerId = localStorage.getItem("marketplace_viewer_id")
  if (!viewerId) {
    viewerId = `viewer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("marketplace_viewer_id", viewerId)
  }
  return viewerId
}

// ── ФУНКЦИЯ ОТСЛЕЖИВАНИЯ ПРОСМОТРА ─────────────────────────────────────────────
async function trackView(listingId) {
  const viewerId = getViewerId()
  
  // Проверяем, не просматривал ли пользователь это объявление недавно
  const viewedKey = `viewed_${listingId}`
  const lastViewed = localStorage.getItem(viewedKey)
  
  if (lastViewed) {
    const timeSinceView = Date.now() - parseInt(lastViewed)
    // Засчитываем повторный просмотр только через 24 часа
    if (timeSinceView < 24 * 60 * 60 * 1000) {
      return
    }
  }
  
  try {
    const res = await fetch(`${API_URL}/api/listings/${listingId}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewerId })
    })
    
    if (res.ok) {
      localStorage.setItem(viewedKey, Date.now().toString())
    }
  } catch (e) {
    console.error("Failed to track view:", e)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ProductModal - МОДАЛКА С ФОТО И ДАННЫМИ ТОВАРА
// ─────────────────────────────────────────────────────────────────────────────
function ProductModal({ listing, onClose }) {
  const [activePhoto, setActivePhoto] = useState(0)
  const photos = listing.photos || []
  
  useEffect(() => {
    document.body.style.overflow = "hidden"
    
    // Отслеживаем просмотр при открытии модалки
    trackView(listing.id)
    
    return () => { 
      document.body.style.overflow = "" 
    }
  }, [listing.id])

  useEffect(() => {
    const fn = e => {
      if (e.key === "Escape")     onClose()
      if (e.key === "ArrowRight") setActivePhoto(a => Math.min(a + 1, photos.length - 1))
      if (e.key === "ArrowLeft")  setActivePhoto(a => Math.max(a - 1, 0))
    }
    document.addEventListener("keydown", fn)
    return () => document.removeEventListener("keydown", fn)
  }, [photos.length, onClose])

  const getCategoryLabel = (catId) => {
    return CATEGORIES.find(c => c.id === catId)?.label || catId
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center font-futura"
      onClick={onClose}
    >
      {/* Кнопка закрытия */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-red-500/20 text-white text-xl md:text-2xl flex items-center justify-center cursor-pointer transition"
      >
        ✕
      </button>

      {/* Контент модалки */}
      <div 
        className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-5xl bg-neutral-900 md:border md:border-neutral-800 flex flex-col md:flex-row overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Левая часть - Галерея фото */}
        <div className="w-full md:w-3/5 bg-black relative flex-shrink-0">
          {photos.length > 0 ? (
            <>
              {/* Главное фото */}
              <div className="relative h-64 md:h-full min-h-[400px] flex items-center justify-center">
                <img
                  src={cldUrl(photos[activePhoto], { w: 1200, h: 900, crop: "limit" })}
                  alt={listing.title}
                  className="max-h-full max-w-full object-contain select-none"
                  draggable={false}
                />
                
                {/* Счетчик фото */}
                {photos.length > 1 && (
                  <div className="absolute top-4 left-4 bg-black/80 text-white text-xs px-3 py-1.5 select-none">
                    {activePhoto + 1} / {photos.length}
                  </div>
                )}

                {/* Стрелки навигации */}
                {photos.length > 1 && (
                  <>
                    {activePhoto > 0 && (
                      <button
                        onClick={() => setActivePhoto(a => a - 1)}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/25 text-white text-2xl md:text-3xl flex items-center justify-center cursor-pointer transition"
                      >‹</button>
                    )}
                    {activePhoto < photos.length - 1 && (
                      <button
                        onClick={() => setActivePhoto(a => a + 1)}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/25 text-white text-2xl md:text-3xl flex items-center justify-center cursor-pointer transition"
                      >›</button>
                    )}
                  </>
                )}
              </div>

              {/* Миниатюры */}
              {photos.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 md:p-4">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {photos.map((p, i) => (
                      <img
                        key={i}
                        src={cldUrl(p, { w: 80, h: 80 })}
                        onClick={() => setActivePhoto(i)}
                        draggable={false}
                        className={`w-12 h-12 md:w-16 md:h-16 object-cover cursor-pointer border-2 transition-all select-none flex-shrink-0 ${
                          activePhoto === i
                            ? "border-green-500 scale-110"
                            : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-64 md:h-full min-h-[400px] flex items-center justify-center text-6xl text-neutral-700">
              ⬚
            </div>
          )}
        </div>

        {/* Правая часть - Информация о товаре */}
        <div className="w-full md:w-2/5 bg-neutral-900 p-4 md:p-6 overflow-y-auto flex-1">
          {/* Категория */}
          <div className="flex items-center gap-2 text-xs text-green-500 font-medium mb-3 uppercase tracking-wider">
            <TagIcon className="w-4 h-4" />
            {getCategoryLabel(listing.category)}
          </div>

          {/* Заголовок */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
            {listing.title}
          </h2>

          {/* Цена */}
          {listing.price && (
            <div className="text-3xl md:text-4xl font-bold text-green-500 mb-4">
              {listing.price}
            </div>
          )}

          {/* Просмотры */}
          <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4 uppercase tracking-wide">
            <div className="flex items-center gap-1.5">
              <EyeIcon className="w-4 h-4" />
              {listing.viewCount || 0} переглядів
            </div>
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              {new Date(listing.createdAt).toLocaleDateString("uk-UA", { 
                day: "numeric", 
                month: "long" 
              })}
            </div>
          </div>

          {/* Описание */}
          {listing.description && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                Опис
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>
          )}

          {/* Дата окончания */}
          {listing.expiresAt && (
            <div className="text-xs text-neutral-500 mb-4 uppercase tracking-wide">
              Активно до {new Date(listing.expiresAt).toLocaleDateString("uk-UA", { 
                day: "numeric", 
                month: "long" 
              })}
            </div>
          )}

          {/* Контакты */}
          <div className="border-t border-neutral-800 pt-4 mt-auto">
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">
              Контакти
            </h3>
            
            <div className="space-y-3">
              {listing.contactUsername && (
                <a 
                  href={`https://t.me/${listing.contactUsername}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-3 bg-green-600 hover:bg-green-500 text-white text-center font-medium transition-colors uppercase tracking-wider"
                >
                  Написати @{listing.contactUsername}
                </a>
              )}
              
              {listing.contactPhone && (
                <a 
                  href={`tel:${listing.contactPhone}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-center font-medium transition-colors uppercase tracking-wider"
                >
                  <PhoneIcon className="w-4 h-4" />
                  {listing.contactPhone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PhotoGallery - превью для карточки
// ─────────────────────────────────────────────────────────────────────────────
function PhotoGallery({ photos, onPhotoClick }) {
  const [active, setActive] = useState(0)

  if (!photos?.length) return (
    <div className="w-full h-52 bg-neutral-800 flex items-center justify-center text-4xl select-none text-neutral-600">
      ⬚
    </div>
  )

  return (
    <div
      className="relative cursor-pointer group"
      onClick={onPhotoClick}
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
      
      {/* Overlay подсказка */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
        <div className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider bg-black/50 px-4 py-2">
          Переглянути
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ListingCard
// ─────────────────────────────────────────────────────────────────────────────
function ListingCard({ listing, onCardClick }) {
  const [expanded, setExpanded] = useState(false)
  const hasLong = listing.description?.length > 100

  return (
    <div 
      className="bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-all cursor-pointer"
      onClick={onCardClick}
    >
      <PhotoGallery 
        photos={listing.photos} 
        onPhotoClick={onCardClick}
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-white text-lg leading-tight flex-1">
            {listing.title}
          </h3>
          {listing.price && (
            <div className="flex-shrink-0 text-green-500 font-bold text-lg">
              {listing.price}
            </div>
          )}
        </div>

        {listing.description && (
          <div className="text-sm text-neutral-400 mb-3">
            {hasLong && !expanded ? (
              <>
                {listing.description.slice(0, 100)}...{" "}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded(true)
                  }}
                  className="text-green-500 hover:text-green-400 font-medium"
                >
                  більше
                </button>
              </>
            ) : (
              <>
                {listing.description}
                {hasLong && (
                  <>
                    {" "}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpanded(false)
                      }}
                      className="text-green-500 hover:text-green-400 font-medium"
                    >
                      згорнути
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Просмотры и дата */}
        <div className="flex items-center gap-3 text-xs text-neutral-600 mb-3 font-futura uppercase tracking-wide">
          <div className="flex items-center gap-1">
            <EyeIcon className="w-3.5 h-3.5" />
            {listing.viewCount || 0}
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            {new Date(listing.createdAt).toLocaleDateString("uk-UA", { 
              day: "numeric", 
              month: "short" 
            })}
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              {listing.contactUsername && (
                <div className="text-xs text-green-500 font-medium font-futura">
                  @{listing.contactUsername}
                </div>
              )}
              {listing.contactPhone && (
                <div className="text-xs text-neutral-400 flex items-center gap-1.5 font-futura">
                  <PhoneIcon className="w-3.5 h-3.5" />
                  {listing.contactPhone}
                </div>
              )}
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
  const [sortBy,   setSortBy]   = useState("date")
  const [selectedListing, setSelectedListing] = useState(null)

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
              <ListingCard 
                key={listing.id} 
                listing={listing}
                onCardClick={() => setSelectedListing(listing)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Модалка товара */}
      {selectedListing && (
        <ProductModal 
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  )
}