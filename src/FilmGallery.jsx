import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FullscreenGallery from "./FullscreenGallery/FullscreenGallery";

// const DEMO_SLIDES = [
//   { type: "image", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80", caption: "Гірський ранок" },
//   { type: "image", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80", caption: "Вершини" },
//   { type: "image", src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80", caption: "Зелені долини" },
//   { type: "video", src: "https://res.cloudinary.com/dbx6muxub/video/upload/v1754506398/20220206_214037_qbp9jd.mp4", caption: "Відео" },
//   { type: "image", src: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1600&q=80", caption: "Захід сонця" },
//   { type: "image", src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80", caption: "Океан" },
//   { type: "image", src: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1600&q=80", caption: "Ліс" },
//   { type: "image", src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80", caption: "Туман" },
// ];

const THUMB_H = 68;

// const FilmHoles = () => (
//   <div className="flex flex-col gap-1.5 py-1">
//     {Array.from({ length: 20 }).map((_, i) => (
//       <div key={i} className="w-2 h-1.5 bg-black/70 rounded-sm" />
//     ))}
//   </div>
// );

function ThumbStrip({ slides, activeIndex, onSelect }) {
  const stripRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!frameRef.current) return;
    const top = activeIndex * (THUMB_H + 4);
    frameRef.current.style.transform = `translateY(${top}px)`;

    if (stripRef.current) {
      const containerH = stripRef.current.clientHeight;
      const targetScroll = top - containerH / 2 + THUMB_H / 2;
      stripRef.current.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }, [activeIndex]);




  

  return (
    <div className="flex  h-full select-none">
      {/* <div className="w-4 bg-neutral-900 flex flex-col items-center overflow-hidden pt-2">
        <FilmHoles />
      </div> */}

      <div
        ref={stripRef}
        className="relative flex-1 overflow-y-auto bg-neutral-900 py-1 scrollbar-none"
      >
        {/* Frame */}
        <div
          ref={frameRef}
          className="absolute left-0 right-0 h-[68px] border-2 border-yellow-400/90 rounded-sm pointer-events-none z-50 transition-transform duration-300"
        />

        <div className="flex flex-col gap-1">
          {slides.map((slide, i) => (
            <div
              key={i}
              onClick={() => onSelect(i)}
              className={`h-[68px] overflow-hidden cursor-pointer relative transition-opacity ${
                i === activeIndex ? "opacity-100" : "opacity-50"
              }`}
            >
              {slide.type === "video" ? (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                  ▶
                </div>
              ) : (
                <img
                  src={slide.src}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* <div className="w-4 bg-neutral-900 flex flex-col items-center overflow-hidden pt-2">
        <FilmHoles />
      </div> */}
    </div>
  );
}

function MainView({ slide, index, total }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  }, [slide]);

  if (!slide) return null;

  return (
    <div className="relative flex justify-center w-full h-full bg-neutral-950 overflow-hidden">
      {slide.type === "video" ? (
        <video
          ref={videoRef}
          src={slide.src}
          autoPlay
          muted
          loop
          playsInline
          className="w-auto h-full object-cover"
        />
      ) : (
        <img src={slide.src} className="w-auto h-full object-cover" />
      )}

      {/* vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

      {/* caption */}
      {slide.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white/90 italic tracking-wide text-sm md:text-base">
            {slide.caption}
          </p>
        </div>
      )}

      {/* counter */}
      <div className="absolute top-5 left-6 text-white/50 text-xs font-mono bg-black/30 px-3 py-1 rounded-full">
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

export default function FilmGallery({ slides, startIndex = 0  }) {
     const [showGrid,       setShowGrid]       = useState(false); // ← new
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  const containerRef = useRef(null);
 const navigate = useNavigate();
  const { type } = useParams(); // "sets" | "ramps" | "skateparks"
 
  const handleClose = useCallback(() => {
    // Возвращаемся на страницу каталога нужного типа
    // Если хочешь navigate(-1) — просто замени на navigate(-1)
navigate(-1)  }, [navigate]);

  // ESC → закрыть галерею
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);
 
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const goTo = useCallback(
    (idx) => setActiveIndex((idx + slides.length) % slides.length),
    [slides.length]
  );
  // добавить обработчик
const handleWheel = useCallback(
  (e) => {
    e.preventDefault();
    goTo(activeIndex + (e.deltaY > 0 ? 1 : -1));
  },
  [activeIndex, goTo]
);

// повесить на основной контейнер — через useEffect (passive: false обязателен!)
useEffect(() => {
  const el = containerRef.current;
  if (!el) return;
  el.addEventListener("wheel", handleWheel, { passive: false });
  return () => el.removeEventListener("wheel", handleWheel);
}, [handleWheel]);

// When user picks a slide from the grid overlay
  const handleSelectFromGrid = useCallback((idx) => {
    setActiveIndex(idx);
    setShowGrid(false);
  }, []);
  return (
    <div
      ref={containerRef}
      className="w-screen  h-dvh flex bg-neutral-950 overflow-hidden"
    >
      {/* ── Top-right button group ── */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
             <button
            onClick={() => setShowGrid(true)}
            aria-label="All photos"
            title="All photos"
            className="
              flex items-center justify-center
              w-10 h-10 rounded-full
              bg-neutral-800/70 hover:bg-neutral-700
              text-white/80 hover:text-white
              transition-colors backdrop-blur-sm
            "
          >
            {/* 3×3 grid icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="0" y="0" width="4.5" height="4.5" rx="0.8"/>
              <rect x="5.75" y="0" width="4.5" height="4.5" rx="0.8"/>
              <rect x="11.5" y="0" width="4.5" height="4.5" rx="0.8"/>
              <rect x="0" y="5.75" width="4.5" height="4.5" rx="0.8"/>
              <rect x="5.75" y="5.75" width="4.5" height="4.5" rx="0.8"/>
              <rect x="11.5" y="5.75" width="4.5" height="4.5" rx="0.8"/>
              <rect x="0" y="11.5" width="4.5" height="4.5" rx="0.8"/>
              <rect x="5.75" y="11.5" width="4.5" height="4.5" rx="0.8"/>
              <rect x="11.5" y="11.5" width="4.5" height="4.5" rx="0.8"/>
            </svg>
          </button> 


      <button
        onClick={handleClose}
        aria-label="Закрыть галерею"
        className="
          absolute top-4 right-4 z-50
          flex items-center justify-center
          w-10 h-10 rounded-full
          bg-neutral-800/70 hover:bg-neutral-700
          text-white/80 hover:text-white
          transition-colors backdrop-blur-sm
        "
      >
        {/* простой SVG-крест */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
           strokeLinecap="round"
        >
          <line x1="18" y1="6"  x2="6"  y2="18" />
          <line x1="6"  y1="6"  x2="18" y2="18" />
        </svg>
      </button>
</div>
      {/* Main */}
      <div className="flex-1 relative">
        <MainView
          slide={slides[activeIndex]}
          index={activeIndex}
          total={slides.length}
        />

        {isMobile && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full cursor-pointer transition-all ${
                  i === activeIndex
                    ? "w-6 bg-yellow-400"
                    : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {!isMobile && (
        <div className="w-24 border-l border-neutral-800">
          <ThumbStrip
            slides={slides}
            activeIndex={activeIndex}
            onSelect={goTo}
          />
        </div>
      )}

       {showGrid && (
        <FullscreenGallery
          slides={slides}
          onClose={() => setShowGrid(false)}
          onSelectSlide={handleSelectFromGrid}
        />
      )} 
    </div>

  );
}