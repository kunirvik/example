// import { useState, useRef, useEffect, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import FullscreenGallery from "./FullscreenGallery/FullscreenGallery";

// // const DEMO_SLIDES = [
// //   { type: "image", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80", caption: "Гірський ранок" },
// //   { type: "image", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80", caption: "Вершини" },
// //   { type: "image", src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80", caption: "Зелені долини" },
// //   { type: "video", src: "https://res.cloudinary.com/dbx6muxub/video/upload/v1754506398/20220206_214037_qbp9jd.mp4", caption: "Відео" },
// //   { type: "image", src: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1600&q=80", caption: "Захід сонця" },
// //   { type: "image", src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80", caption: "Океан" },
// //   { type: "image", src: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1600&q=80", caption: "Ліс" },
// //   { type: "image", src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80", caption: "Туман" },
// // ];

// const THUMB_H = 68;

// // const FilmHoles = () => (
// //   <div className="flex flex-col gap-1.5 py-1">
// //     {Array.from({ length: 20 }).map((_, i) => (
// //       <div key={i} className="w-2 h-1.5 bg-black/70 rounded-sm" />
// //     ))}
// //   </div>
// // );

// function ThumbStrip({ slides, activeIndex, onSelect }) {
//   const stripRef = useRef(null);
//   const frameRef = useRef(null);

//   useEffect(() => {
//     if (!frameRef.current) return;
//     const top = activeIndex * (THUMB_H + 4);
//     frameRef.current.style.transform = `translateY(${top}px)`;

//     if (stripRef.current) {
//       const containerH = stripRef.current.clientHeight;
//       const targetScroll = top - containerH / 2 + THUMB_H / 2;
//       stripRef.current.scrollTo({ top: targetScroll, behavior: "smooth" });
//     }
//   }, [activeIndex]);




  

//   return (
//     <div className="flex  h-full select-none">
//       {/* <div className="w-4 bg-neutral-900 flex flex-col items-center overflow-hidden pt-2">
//         <FilmHoles />
//       </div> */}

//       <div
//         ref={stripRef}
//         className="relative flex-1 overflow-y-auto bg-neutral-900 py-1 scrollbar-none"
//       >
//         {/* Frame */}
//         <div
//           ref={frameRef}
//           className="absolute left-0 right-0 h-[68px] border-2 border-yellow-400/90 rounded-sm pointer-events-none z-50 transition-transform duration-300"
//         />

//         <div className="flex flex-col gap-1">
//           {slides.map((slide, i) => (
//             <div
//               key={i}
//               onClick={() => onSelect(i)}
//               className={`h-[68px] overflow-hidden cursor-pointer relative transition-opacity ${
//                 i === activeIndex ? "opacity-100" : "opacity-50"
//               }`}
//             >
//               {slide.type === "video" ? (
//                 <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
//                   ▶
//                 </div>
//               ) : (
//                 <img
//                   src={slide.src}
//                   className="w-full h-full object-cover"
//                   loading="lazy"
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* <div className="w-4 bg-neutral-900 flex flex-col items-center overflow-hidden pt-2">
//         <FilmHoles />
//       </div> */}
//     </div>
//   );
// }

// function MainView({ slide, index, total }) {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (videoRef.current) videoRef.current.play().catch(() => {});
//   }, [slide]);

//   if (!slide) return null;

//   return (
//     <div className="relative flex justify-center w-full h-full bg-neutral-950 overflow-hidden">
//       {slide.type === "video" ? (
//         <video
//           ref={videoRef}
//           src={slide.src}
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="w-auto h-full object-cover"
//         />
//       ) : (
//         <img src={slide.src} className="w-auto h-full object-cover" />
//       )}

//       {/* vignette */}
//       <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

//       {/* caption */}
//       {slide.caption && (
//         <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/70 to-transparent">
//           <p className="text-white/90 italic tracking-wide text-sm md:text-base">
//             {slide.caption}
//           </p>
//         </div>
//       )}

//       {/* counter */}
//       <div className="absolute top-5 left-6 text-white/50 text-xs font-mono bg-black/30 px-3 py-1 rounded-full">
//         {String(index + 1).padStart(2, "0")} /{" "}
//         {String(total).padStart(2, "0")}
//       </div>
//     </div>
//   );
// }

// export default function FilmGallery({ slides, startIndex = 0  }) {
//      const [showGrid,       setShowGrid]       = useState(false); // ← new
//   const [activeIndex, setActiveIndex] = useState(startIndex);
//   const [isMobile, setIsMobile] = useState(
//     () => typeof window !== "undefined" && window.innerWidth < 768
//   );
//   const containerRef = useRef(null);
//  const navigate = useNavigate();
//   const { type } = useParams(); // "sets" | "ramps" | "skateparks"
 
//   const handleClose = useCallback(() => {
//     // Возвращаемся на страницу каталога нужного типа
//     // Если хочешь navigate(-1) — просто замени на navigate(-1)
// navigate(-1)  }, [navigate]);

//   // ESC → закрыть галерею
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") handleClose();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [handleClose]);
 
//   useEffect(() => {
//     const fn = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", fn);
//     return () => window.removeEventListener("resize", fn);
//   }, []);

//   const goTo = useCallback(
//     (idx) => setActiveIndex((idx + slides.length) % slides.length),
//     [slides.length]
//   );
//   // добавить обработчик
// const handleWheel = useCallback(
//   (e) => {
//     e.preventDefault();
//     goTo(activeIndex + (e.deltaY > 0 ? 1 : -1));
//   },
//   [activeIndex, goTo]
// );

// // повесить на основной контейнер — через useEffect (passive: false обязателен!)
// useEffect(() => {
//   const el = containerRef.current;
//   if (!el) return;
//   el.addEventListener("wheel", handleWheel, { passive: false });
//   return () => el.removeEventListener("wheel", handleWheel);
// }, [handleWheel]);

// // When user picks a slide from the grid overlay
//   const handleSelectFromGrid = useCallback((idx) => {
//     setActiveIndex(idx);
//     setShowGrid(false);
//   }, []);
//   return (
//     <div
//       ref={containerRef}
//       className="w-screen  h-dvh flex bg-neutral-950 overflow-hidden"
//     >
//       {/* ── Top-right button group ── */}
//         <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
//              <button
//             onClick={() => setShowGrid(true)}
//             aria-label="All photos"
//             title="All photos"
//             className="
//               flex items-center justify-center
//               w-10 h-10 rounded-full
//               bg-neutral-800/70 hover:bg-neutral-700
//               text-white/80 hover:text-white
//               transition-colors backdrop-blur-sm
//             "
//           >
//             {/* 3×3 grid icon */}
//             <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
//               <rect x="0" y="0" width="4.5" height="4.5" rx="0.8"/>
//               <rect x="5.75" y="0" width="4.5" height="4.5" rx="0.8"/>
//               <rect x="11.5" y="0" width="4.5" height="4.5" rx="0.8"/>
//               <rect x="0" y="5.75" width="4.5" height="4.5" rx="0.8"/>
//               <rect x="5.75" y="5.75" width="4.5" height="4.5" rx="0.8"/>
//               <rect x="11.5" y="5.75" width="4.5" height="4.5" rx="0.8"/>
//               <rect x="0" y="11.5" width="4.5" height="4.5" rx="0.8"/>
//               <rect x="5.75" y="11.5" width="4.5" height="4.5" rx="0.8"/>
//               <rect x="11.5" y="11.5" width="4.5" height="4.5" rx="0.8"/>
//             </svg>
//           </button> 


//       <button
//         onClick={handleClose}
//         aria-label="Закрыть галерею"
//         className="
//           absolute top-4 right-4 z-50
//           flex items-center justify-center
//           w-10 h-10 rounded-full
//           bg-neutral-800/70 hover:bg-neutral-700
//           text-white/80 hover:text-white
//           transition-colors backdrop-blur-sm
//         "
//       >
//         {/* простой SVG-крест */}
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="18" height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.5"
//            strokeLinecap="round"
//         >
//           <line x1="18" y1="6"  x2="6"  y2="18" />
//           <line x1="6"  y1="6"  x2="18" y2="18" />
//         </svg>
//       </button>
// </div>
//       {/* Main */}
//       <div className="flex-1 relative">
//         <MainView
//           slide={slides[activeIndex]}
//           index={activeIndex}
//           total={slides.length}
//         />

//         {isMobile && (
//           <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
//             {slides.map((_, i) => (
//               <div
//                 key={i}
//                 onClick={() => goTo(i)}
//                 className={`h-1.5 rounded-full cursor-pointer transition-all ${
//                   i === activeIndex
//                     ? "w-6 bg-yellow-400"
//                     : "w-1.5 bg-white/40"
//                 }`}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {!isMobile && (
//         <div className="w-24 border-l border-neutral-800">
//           <ThumbStrip
//             slides={slides}
//             activeIndex={activeIndex}
//             onSelect={goTo}
//           />
//         </div>
//       )}

//        {showGrid && (
//         <FullscreenGallery
//           slides={slides}
//           onClose={() => setShowGrid(false)}
//           onSelectSlide={handleSelectFromGrid}
//         />
//       )} 
//     </div>

//   );
// }
// FilmGallery.jsx
// Принимает опциональный проп onClose.
// Если передан — используется вместо navigate(-1).
// Это позволяет AllGalleryPage вернуться в сетку вместо истории браузера.

// FilmGallery.jsx
// FilmGallery.jsx
// FilmGallery.jsx
// Лейаут десктоп: [главный вид] [миниатюры справа, чуть отступлены влево] [кнопки справа]
// Лейаут мобилка: [главный вид] [миниатюры снизу] + кнопки справа вверху

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const THUMB_H = 68;
const THUMB_W = 96;

const STYLE_ID = "film-gallery-styles";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes fg-spin {
      to { transform: rotate(360deg); }
    }
    @keyframes fg-enter {
      from { opacity: 0; transform: scale(1.03); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes fg-slide-up {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fg-slide-left {
      from { opacity: 0; transform: translateX(18px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes fg-slide-down {
      from { opacity: 0; transform: translateY(-18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fg-enter      { animation: fg-enter     0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .fg-slide-up   { animation: fg-slide-up  0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .fg-slide-left { animation: fg-slide-left 0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .fg-slide-down { animation: fg-slide-down 0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .fg-no-scroll::-webkit-scrollbar { display: none; }
    .fg-no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(s);
}

// ─── Спиннер ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 z-10 pointer-events-none">
      <div className="relative w-9 h-9">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/70"
          style={{ animation: "fg-spin 0.8s linear infinite" }}
        />
      </div>
    </div>
  );
}

// ─── Вертикальная лента СПРАВА (десктоп) ─────────────────────────────────────
// ml-2 — небольшой отступ слева (чуть отодвинуты от главного вида)
function ThumbStripVertical({ slides, activeIndex, onSelect }) {
  const stripRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!frameRef.current) return;
    const top = activeIndex * (THUMB_H + 4);
    frameRef.current.style.transform = `translateY(${top}px)`;
    if (stripRef.current) {
      const containerH = stripRef.current.clientHeight;
      stripRef.current.scrollTo({
        top: top - containerH / 2 + THUMB_H / 2,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <div
      ref={stripRef}
      className="fg-no-scroll relative h-full overflow-y-auto bg-neutral-900 py-1 ml-2"
      style={{ width: 80 }}
    >
      {/* Рамка-индикатор */}
      <div
        ref={frameRef}
        className="absolute left-0.5 right-0.5 h-[68px] border-2 border-yellow-400/90 rounded-sm pointer-events-none z-50 transition-transform duration-300"
      />
      <div className="flex flex-col gap-1 px-0.5">
        {slides.map((slide, i) => (
          <div
            key={i}
            onClick={() => onSelect(i)}
            className={`h-[68px] overflow-hidden cursor-pointer transition-opacity ${
              i === activeIndex ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            {slide.type === "video" ? (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white/60 text-sm">▶</div>
            ) : (
              <img src={slide.src} className="w-full h-full object-cover" loading="lazy" alt="" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Горизонтальная лента СНИЗУ (мобилка) ────────────────────────────────────
function ThumbStripHorizontal({ slides, activeIndex, onSelect }) {
  const stripRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!frameRef.current) return;
    const left = activeIndex * (THUMB_W + 4);
    frameRef.current.style.transform = `translateX(${left}px)`;
    if (stripRef.current) {
      const containerW = stripRef.current.clientWidth;
      stripRef.current.scrollTo({
        left: left - containerW / 2 + THUMB_W / 2,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <div
      ref={stripRef}
      className="fg-no-scroll relative overflow-x-auto bg-neutral-900"
      style={{ height: 64, paddingLeft: 12, paddingRight: 12 }}
    >
      <div
        ref={frameRef}
        className="absolute top-1.5 bottom-1.5 border-2 border-yellow-400/90 rounded-sm pointer-events-none z-50 transition-transform duration-300"
        style={{ width: THUMB_W, left: 12 }}
      />
      <div className="flex gap-1 h-full" style={{ minWidth: slides.length * (THUMB_W + 4) }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            onClick={() => onSelect(i)}
            className="flex-shrink-0 overflow-hidden cursor-pointer"
            style={{ width: THUMB_W, height: "100%", opacity: i === activeIndex ? 1 : 0.4 }}
          >
            {slide.type === "video" ? (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white/60 text-xs">▶</div>
            ) : (
              <img src={slide.src} className="w-full h-full object-cover" loading="lazy" alt="" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Главный вид ──────────────────────────────────────────────────────────────
function MainView({ slide, index, total }) {
  const videoRef              = useRef(null);
  const [loading, setLoading] = useState(true);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setAnimKey((k) => k + 1);
  }, [slide]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  }, [slide]);

  if (!slide) return null;

  return (
    <div key={animKey} className="fg-enter relative flex justify-center w-full h-full bg-neutral-950 overflow-hidden">
      {loading && <Spinner />}

      {slide.type === "video" ? (
        <video
          ref={videoRef} src={slide.src}
          autoPlay muted loop playsInline
          className="w-auto h-full object-contain"
          onCanPlay={() => setLoading(false)}
        />
      ) : (
        <img
          src={slide.src}
          className="w-auto h-full object-contain"
          style={{ opacity: loading ? 0 : 1, transition: "opacity 0.35s ease" }}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          alt={slide.caption || ""}
        />
      )}

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

      {slide.caption && (
        <div className="fg-slide-up absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white/90 font-bold">{slide.caption}</p>
        </div>
      )}

      <div className="fg-slide-down absolute top-5 left-6 text-white/50 text-xs font-mono bg-black/30 px-3 py-1 rounded-full">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────
export default function FilmGallery({ slides, startIndex = 0, onClose: onCloseProp }) {
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [mounted, setMounted]         = useState(false);
  const [isMobile, setIsMobile]       = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  const navigate     = useNavigate();
  const containerRef = useRef(null);
  const touchStartX  = useRef(null);
  const touchStartY  = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const handleClose = useCallback(
    () => (onCloseProp ? onCloseProp() : navigate(-1)),
    [onCloseProp, navigate]
  );

  // Кнопка сетки:
  // - Если мы внутри AllGalleryPage (onCloseProp есть) → просто закрываем FilmGallery,
  //   возвращаясь в FullscreenGallery (уже на /gallery/all)
  // - Если мы на отдельной странице → navigate на /gallery/all
  const handleOpenAllGallery = useCallback(() => {
    if (onCloseProp) {
      onCloseProp();
    } else {
      navigate("/gallery/all");
    }
  }, [onCloseProp, navigate]);

  const goTo = useCallback(
    (idx) => setActiveIndex((idx + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape")                               handleClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown")  goTo(activeIndex + 1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")    goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose, activeIndex, goTo]);

  const handleWheel = useCallback(
    (e) => { e.preventDefault(); goTo(activeIndex + (e.deltaY > 0 ? 1 : -1)); },
    [activeIndex, goTo]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isMobile) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel, isMobile]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        goTo(activeIndex + (dx < 0 ? 1 : -1));
      }
      touchStartX.current = null;
      touchStartY.current = null;
    },
    [activeIndex, goTo]
  );

  return (
    <div
      ref={containerRef}
      className=" fixed inset-0 flex flex-col bg-neutral-950 overflow-hidden"
      style={{
        opacity:    mounted ? 1 : 0,
        transform:  mounted ? "scale(1)" : "scale(1.04)",
        transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile   ? handleTouchEnd   : undefined}
    >
      {/* ── Основная область ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* Главный вид */}
        <div className="flex-1 relative">
          <MainView slide={slides[activeIndex]} index={activeIndex} total={slides.length} />
        </div>

        {/* ── Правая панель (только десктоп): миниатюры + кнопки ── */}
        {!isMobile && (
          <div
            className="flex items-stretch fg-slide-left"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Миниатюры — чуть отступлены влево от края (ml-2 внутри компонента) */}
            <ThumbStripVertical
              slides={slides}
              activeIndex={activeIndex}
              onSelect={goTo}
            />

            {/* Кнопки — вертикальная колонка по правому краю */}
            <div className="flex flex-col items-center justify-start gap-2 px-2 py-3 bg-neutral-950 border-l border-neutral-800">
              {/* Закрыть */}
              <button
                onClick={handleClose}
                aria-label="Закрыть галерею"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-800/70 hover:bg-neutral-700 text-white/80 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6"  x2="6"  y2="18"/>
                  <line x1="6"  y1="6"  x2="18" y2="18"/>
                </svg>
              </button>

              {/* Вся галерея */}
              <button
                onClick={handleOpenAllGallery}
                aria-label="All photos"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-800/70 hover:bg-neutral-700 text-white/80 hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0"    y="0"    width="4.5" height="4.5" rx="0.8"/>
                  <rect x="5.75" y="0"    width="4.5" height="4.5" rx="0.8"/>
                  <rect x="11.5" y="0"    width="4.5" height="4.5" rx="0.8"/>
                  <rect x="0"    y="5.75" width="4.5" height="4.5" rx="0.8"/>
                  <rect x="5.75" y="5.75" width="4.5" height="4.5" rx="0.8"/>
                  <rect x="11.5" y="5.75" width="4.5" height="4.5" rx="0.8"/>
                  <rect x="0"    y="11.5" width="4.5" height="4.5" rx="0.8"/>
                  <rect x="5.75" y="11.5" width="4.5" height="4.5" rx="0.8"/>
                  <rect x="11.5" y="11.5" width="4.5" height="4.5" rx="0.8"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Горизонтальная лента СНИЗУ — только мобилка */}
      {isMobile && (
        <div className="flex-none border-t border-neutral-800 fg-slide-up" style={{ animationDelay: "0.22s" }}>
          <ThumbStripHorizontal slides={slides} activeIndex={activeIndex} onSelect={goTo} />
        </div>
      )}

      {/* Кнопки на мобилке — правый верхний угол */}
      {isMobile && (
        <div className="absolute top-3 right-3 z-50 flex flex-col gap-2">
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-800/80 text-white/80 backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6"  x2="6"  y2="18"/>
              <line x1="6"  y1="6"  x2="18" y2="18"/>
            </svg>
          </button>
          <button
            onClick={handleOpenAllGallery}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-800/80 text-white/80 backdrop-blur-sm"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <rect x="0"    y="0"    width="4.5" height="4.5" rx="0.8"/>
              <rect x="5.75" y="0"    width="4.5" height="4.5" rx="0.8"/>
              <rect x="11.5" y="0"    width="4.5" height="4.5" rx="0.8"/>
              <rect x="0"    y="5.75" width="4.5" height="4.5" rx="0.8"/>
              <rect x="5.75" y="5.75" width="4.5" height="4.5" rx="0.8"/>
              <rect x="11.5" y="5.75" width="4.5" height="4.5" rx="0.8"/>
              <rect x="0"    y="11.5" width="4.5" height="4.5" rx="0.8"/>
              <rect x="5.75" y="11.5" width="4.5" height="4.5" rx="0.8"/>
              <rect x="11.5" y="11.5" width="4.5" height="4.5" rx="0.8"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}