// PhotoyoshiGallery.jsx
// Overlay gallery in photoyoshi style.
// Opens on top of FilmGallery when user clicks the grid button.
//
// Props:
//   slides       — same slides[] array used by FilmGallery (each slide: { src, type, cat?, caption? })
//   onClose      — () => void   close the overlay
//   onSelectSlide— (index: number) => void   jump to slide in FilmGallery & close overlay

// src/PhotoyoshiGallery/PhotoyoshiGallery.jsx
//
// ╔══════════════════════════════════════════════════════════════════════╗
// ║  PROPS                                                               ║
// ║  slides[]     — { src, type?, cat?, caption? }                       ║
// ║  onClose      — () => void                                           ║
// ║  onSelectSlide— (globalIndex: number) => void                        ║
// ╠══════════════════════════════════════════════════════════════════════╣
// ║  КАК ДОБАВИТЬ СВОЮ КАТЕГОРИЮ                                         ║
// ║  1. Добавь ключ → лейбл в CAT_LABEL ниже                            ║
// ║  2. При сборке allSlides добавь .map(s => ({...s, cat:"твоя_кат"})) ║
// ║  Готово! Highlight и счётчик появятся автоматически.                 ║
// ╚══════════════════════════════════════════════════════════════════════╝

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── 1. КАТЕГОРИИ ────────────────────────────────────────────────────────────
// Добавляй сколько угодно: ключ (значение slide.cat) → отображаемое имя
export const CAT_LABEL = {
  sets:       "Sets",
  ramps:      "Ramps",
  skateparks: "Skateparks",
  video:      "Video",       // тип slide.type === "video" ловится отдельно ниже
  photo:      "Photo",
  street:     "Street",
  general:    "General",
  // ← добавляй свои сюда
};

// Вспомогательная: достать категорию из слайда
// Если у slide.type === "video" и нет явного cat → будет "video"
function getCat(slide) {
  if (slide.cat) return slide.cat;
  if (slide.type === "video") return "video";
  return "general";
}

// ─── 2. СТИЛИ (inject once) ───────────────────────────────────────────────────
const STYLE_ID = "pyoshi-kf";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes pySlideIn {
      from { opacity: 0; transform: translateX(-24px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .py-card { animation: pySlideIn 0.55s cubic-bezier(0.16,1,0.3,1) both; }

    /* скрыть scrollbar, но оставить скролл */
    .py-hscroll::-webkit-scrollbar { display: none; }
    .py-hscroll { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(s);
}

// ─── КОНСТАНТЫ ────────────────────────────────────────────────────────────────
const COL_W         = 148;  // ширина колонки, px
const COL_GAP       = 4;    // отступ между колонками, px
const ITEMS_PER_COL = 6;    // фото в колонке (влияет на высоту колонки)
const PARALLAX_MAX  = 20;   // максимальное смещение по Y при скролле, px

// ─── КОМПОНЕНТ ────────────────────────────────────────────────────────────────
export default function FullscreenGallery({ slides = [], onClose, onSelectSlide }) {
  const [hoveredCat, setHoveredCat] = useState(null);
  const scrollRef   = useRef(null);   // горизонтальный контейнер
  const colRefs     = useRef([]);     // refs на каждую колонку для параллакса

  // ── ESC закрывает оверлей ──
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // ── Блокируем скролл body ──
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Кол-во фото по категориям ──
  const catCounts = useMemo(() =>
    slides.reduce((acc, s) => {
      const c = getCat(s);
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {}),
  [slides]);

  // ── Разбиваем слайды по колонкам ──
  // Каждая колонка = массив { slide, globalIndex }
  const columns = useMemo(() => {
    const cols = [];
    for (let i = 0; i < slides.length; i += ITEMS_PER_COL) {
      cols.push(
        slides.slice(i, i + ITEMS_PER_COL).map((slide, j) => ({
          slide,
          globalIndex: i + j,
        }))
      );
    }
    return cols;
  }, [slides]);

  // ─── 3. ПАРАЛЛАКС НА ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ ────────────────────────────────
  // Первая колонка едет ВНИЗ (+Y), последняя ВВЕРХ (-Y), ±20px максимум.
  // Промежуточные колонки — линейная интерполяция между +20 и -20.
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || columns.length < 2) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    const progress = el.scrollLeft / maxScroll; // 0 → 1

    colRefs.current.forEach((col, i) => {
      if (!col) return;
      const t  = i / (columns.length - 1);           // 0 → 1
      const y  = (1 - 2 * t) * PARALLAX_MAX * progress; // +20 → 0 → -20
      col.style.transform = `translateY(${y.toFixed(2)}px)`;
    });
  }, [columns.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── Клик на фото ──
  const handleSelect = useCallback((idx) => {
    onSelectSlide(idx);
    onClose();
  }, [onSelectSlide, onClose]);

  const hoveredLabel = hoveredCat ? (CAT_LABEL[hoveredCat] ?? hoveredCat) : null;

  return (
    <div className="fixed inset-0 z-[200] bg-[#e8e3db] flex flex-col overflow-hidden">

      {/* ── ШАПКА ── */}
      <header className="flex-none flex items-center justify-between px-6 py-3 z-20 select-none">
        <span
          className="text-neutral-800 tracking-tight font-bold"
          style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(1rem,2vw,1.4rem)" }}
        >
          All Photos
        </span>

        <div className="flex items-center gap-5 flex-wrap justify-end">
          {/* ── КНОПКИ КАТЕГОРИЙ ──────────────────────────────────────────────
            Сюда автоматически попадают все cat, которые есть в slides.
            Чтобы добавить "Tricks" — просто добавь slide.cat = "tricks"
            и CAT_LABEL["tricks"] = "Tricks" выше.
          ─────────────────────────────────────────────────────────────────── */}
          {Object.entries(catCounts).map(([cat, n]) => (
            <button
              key={cat}
              onMouseEnter={() => setHoveredCat(cat)}
              onMouseLeave={() => setHoveredCat(null)}
              onClick={() => setHoveredCat(v => v === cat ? null : cat)}
              className={`text-[11px] tracking-[0.15em] uppercase transition-colors duration-200 ${
                hoveredCat === cat
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {CAT_LABEL[cat] ?? cat}
              <span className="ml-1 text-neutral-300 font-light">({n})</span>
            </button>
          ))}

          {/* Закрыть */}
          <button
            onClick={onClose}
            className="ml-2 w-8 h-8 rounded-full bg-black/8 hover:bg-black/15 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6"  x2="6"  y2="18"/>
              <line x1="6"  y1="6"  x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ─── ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ ─────────────────────────────────────────── */}
      {/* py-hscroll скрывает нативный скроллбар */}
      <div
        ref={scrollRef}
        className="py-hscroll flex-1 overflow-x-auto overflow-y-hidden"
      >
        {/*
          Внутренний flex-контейнер.
          Высота = 100% контейнера (вся высота экрана минус хедер).
          Каждая колонка — flex-col, фото идут сверху вниз.
          Ширина рассчитывается так, что колонки НЕ переносятся.
        */}
        <div
          className="flex items-start h-full gap-[4px] px-1.5 pb-20"
          style={{
            minWidth: `${columns.length * (COL_W + COL_GAP)}px`,
          }}
        >
          {columns.map((col, colIdx) => (
            <div
              key={colIdx}
              ref={el => (colRefs.current[colIdx] = el)}
              className="flex flex-col gap-1 will-change-transform"
              style={{
                width:     `${COL_W}px`,
                flexShrink: 0,
                // Начальное смещение: первая колонка чуть ниже, последняя чуть выше
                // Это создаёт эффект "волны" даже без скролла
                // transform: colIdx % 2 === 0 ? "translateY(0px)" : "translateY(12px)",
                // ↑ раскомментируй если хочешь шахматное смещение изначально
              }}
            >
              {col.map(({ slide, globalIndex }) => {
                const cat     = getCat(slide);
                const isFaded = hoveredCat !== null && cat !== hoveredCat;

                return (
                  <div
                    key={globalIndex}
                    className="py-card overflow-hidden cursor-pointer relative group flex-shrink-0"
                    style={{
                      animationDelay: `${Math.min(globalIndex * 0.02, 0.7)}s`,
                    }}
                    // ── Наведение на фото → подсвечиваем категорию ──
                    onMouseEnter={() => setHoveredCat(cat)}
                    onMouseLeave={() => setHoveredCat(null)}
                    onClick={() => handleSelect(globalIndex)}
                  >
                    {/* ── ВИДЕО ── */}
                    {slide.type === "video" ? (
                      <div
                        className={`
                          w-full aspect-video bg-neutral-600 flex flex-col items-center
                          justify-center gap-1 transition-all duration-500
                          ${isFaded ? "opacity-[0.11] saturate-0 brightness-[1.7]" : "opacity-100"}
                        `}
                      >
                        {/* превью-кадр если есть poster */}
                        {slide.poster && (
                          <img
                            src={slide.poster}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                        <div className="relative z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 10 10" fill="white">
                            <polygon points="2,1 9,5 2,9"/>
                          </svg>
                        </div>
                      </div>
                    ) : (
                      /* ── ФОТО ── */
                      <img
                        src={slide.src}
                        alt={slide.caption || cat}
                        loading="lazy"
                        className={`
                          w-full h-auto block
                          transition-all duration-500 ease-out
                          group-hover:scale-[1.04]
                          ${isFaded
                            ? "opacity-[0.11] saturate-0 brightness-[1.7]"
                            : "opacity-100 saturate-100 brightness-100"
                          }
                        `}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── БОЛЬШОЙ ЛЕЙБЛ СНИЗУ ── */}
      <div
        className="fixed bottom-0 left-0 right-0 text-center pointer-events-none pb-4 z-30"
        style={{
          opacity:    hoveredCat ? 1 : 0,
          transform:  hoveredCat ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.32s ease, transform 0.32s ease",
        }}
      >
        <div
          className="font-bold text-neutral-900 leading-none tracking-tight"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize:   "clamp(2.2rem, 7vw, 6.5rem)",
          }}
        >
          {hoveredLabel}
          {hoveredCat && (
            <span
              className="text-neutral-400 align-super"
              style={{ fontSize: "clamp(0.65rem, 1.2vw, 1rem)", marginLeft: "0.3em", fontFamily: "sans-serif", fontWeight: 300 }}
            >
              ({catCounts[hoveredCat] ?? 0})
            </span>
          )}
        </div>
        <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-400 mt-0.5">
          / All Photos
        </p>
      </div>

      {/* ── Подсказка о скролле (исчезает через 2с) ── */}
      <ScrollHint />
    </div>
  );
}

// ─── ПОДСКАЗКА О ГОРИЗОНТАЛЬНОМ СКРОЛЛЕ ──────────────────────────────────────
function ScrollHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed bottom-6 right-6 flex items-center gap-2 text-[10px] tracking-widest uppercase text-neutral-400 pointer-events-none z-40"
      style={{
        opacity:    visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="0" y1="5" x2="16" y2="5"/>
        <polyline points="12,1 17,5 12,9"/>
      </svg>
      scroll
    </div>
  );
}
 
// import React, { useRef, useEffect, useMemo, useState } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { Html } from "@react-three/drei";
// import * as THREE from "three";

// function Slide({ item, index, activeIndex }) {
//   const mesh = useRef();
//   const videoRef = useRef();

//   const texture = useMemo(() => {
//     if (item.type === "video") {
//       const video = document.createElement("video");
//       video.src = item.src;
//       video.crossOrigin = "anonymous";
//       video.loop = true;
//       video.muted = true;
//       video.playsInline = true;
//       video.autoplay = true;
//       videoRef.current = video;

//       const tex = new THREE.VideoTexture(video);
//       tex.colorSpace = THREE.SRGBColorSpace;
//       return tex;
//     } else {
//       const tex = new THREE.TextureLoader().load(item.src);
//       tex.colorSpace = THREE.SRGBColorSpace;
//       return tex;
//     }
//   }, [item]);

//   useFrame(() => {
//     if (!mesh.current) return;

//     const offset = index - activeIndex;
//     const z = Math.abs(offset) * -1.5;
//     const opacity = Math.max(0, 1 - Math.abs(offset) * 1.2);

//     mesh.current.position.z = THREE.MathUtils.lerp(
//       mesh.current.position.z,
//       z,
//       0.08
//     );

//     mesh.current.material.opacity = THREE.MathUtils.lerp(
//       mesh.current.material.opacity,
//       opacity,
//       0.08
//     );
//   });

//   useEffect(() => {
//     if (videoRef.current) {
//       if (index === activeIndex) videoRef.current.play();
//       else videoRef.current.pause();
//     }
//   }, [activeIndex, index]);

//   return (
//     <mesh ref={mesh}>
//       <planeGeometry args={[4, 2.5]} />
//       <meshBasicMaterial
//         map={texture}
//         transparent
//         opacity={0}
//         toneMapped={false}
//       />
//       {item.caption && index === activeIndex && (
//         <Html position={[0, -1.6, 0]}>
//           <div style={{ color: "white", fontSize: "14px" }}>
//             {item.caption}
//           </div>
//         </Html>
//       )}
//     </mesh>
//   );
// }

// function Scene({ slides, activeIndex }) {
//   return (
//     <>
//       {slides.map((item, i) => (
//         <Slide key={i} item={item} index={i} activeIndex={activeIndex} />
//       ))}
//     </>
//   );
// }

// export default function FullscreenGallery({ images }) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const scrollRef = useRef(0);

//   useEffect(() => {
//     const onWheel = (e) => {
//       scrollRef.current += e.deltaY * 0.002;
//       const next = Math.round(scrollRef.current);
//       setActiveIndex(
//         Math.max(0, Math.min(images.length - 1, next))
//       );
//     };

//     window.addEventListener("wheel", onWheel, { passive: true });
//     return () => window.removeEventListener("wheel", onWheel);
//   }, [images.length]);

//   const slides = useMemo(
//     () =>
//       images.map((img) =>
//         typeof img === "string"
//           ? { src: img, type: "image" }
//           : img
//       ),
//     [images]
//   );

//   return (
//     <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
//       <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
//         <Scene slides={slides} activeIndex={activeIndex} />
//       </Canvas>

//       {/* counter */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: 30,
//           right: 30,
//           color: "white",
//           fontSize: 14,
//           opacity: 0.6,
//         }}
//       >
//         {activeIndex + 1} / {slides.length}
//       </div>
//     </div>
//   );
// }// import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { Html } from "@react-three/drei";
// import * as THREE from "three";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";

// const SLIDE_W       = 3.0;
// const SLIDE_H       = 2.0;
// const SLIDE_GAP     = 2.6;
// const ROTATE_Y      = 0.72;
// const DEPTH_OFFSET  = 0.9;
// const LERP_SPEED    = 0.1;
// const LERP_SNAP     = 0.08;
// const SCROLL_SENS   = 0.003;
// const DRAG_SENS     = 0.006;
// const SNAP_DELAY_MS = 100;

// // ─────────────────────────────────────────────
// function CoverflowSlide({ item, index, total, carouselIndexRef, activeIndexRef }) {
//   const meshRef    = useRef();
//   const videoRef   = useRef(null);
//   const readyRef   = useRef(false);
//   const playingRef = useRef(false);

//   const texture = useMemo(() => {
//     if (item.type !== "video") {
//       const tex = new THREE.TextureLoader().load(item.src);
//       tex.colorSpace = THREE.SRGBColorSpace;
//       return tex;
//     }
//     const vid = document.createElement("video");
//     vid.crossOrigin   = "anonymous";
//     vid.src           = item.src;
//     vid.loop          = true;
//     vid.muted         = true;
//     vid.playsInline   = true;
//     vid.preload       = "auto";
//     vid.style.display = "none";
//     document.body.appendChild(vid);
//     vid.addEventListener("loadeddata", () => { readyRef.current = true; });
//     videoRef.current = vid;
//     const tex = new THREE.VideoTexture(vid);
//     tex.colorSpace = THREE.SRGBColorSpace;
//     return tex;
//   }, [item]);

//   useEffect(() => {
//     return () => {
//       const vid = videoRef.current;
//       if (vid) { vid.pause(); vid.src = ""; if (vid.parentNode) vid.remove(); }
//     };
//   }, []);

//   useFrame(() => {
//     if (!meshRef.current) return;

//     // Видео — с защитой от undefined
//     const vid = videoRef.current;
//     if (vid && readyRef.current && activeIndexRef && activeIndexRef.current != null) {
//       const shouldPlay = index === activeIndexRef.current;
//       if (shouldPlay && !playingRef.current) {
//         playingRef.current = true;
//         vid.play().catch(() => { playingRef.current = false; });
//       } else if (!shouldPlay && playingRef.current) {
//         playingRef.current = false;
//         vid.pause();
//       }
//     }

//     // Coverflow math
//     const ci = carouselIndexRef.current;
//     let offset = index - ((ci % total + total) % total);
//     if (offset >  total / 2) offset -= total;
//     if (offset < -total / 2) offset += total;

//     const absOff = Math.abs(offset);
//     const sign   = Math.sign(offset);
//     const clamp  = Math.min(absOff, 1);

//     const targetX  = offset * SLIDE_GAP;
//     const targetZ  = -clamp * DEPTH_OFFSET;
//     const targetRY = -sign * Math.min(absOff, 1) * ROTATE_Y;
//     const targetOp = absOff > 1.8 ? 0 : absOff > 0.8 ? 0.55 : 1;
//     const targetSc = absOff < 0.01 ? 1.05 : 0.87;

//     const p = meshRef.current.position;
//     const r = meshRef.current.rotation;
//     const s = meshRef.current.scale;
//     const m = meshRef.current.material;

//     p.x = THREE.MathUtils.lerp(p.x, targetX,  LERP_SPEED);
//     p.z = THREE.MathUtils.lerp(p.z, targetZ,  LERP_SPEED);
//     r.y = THREE.MathUtils.lerp(r.y, targetRY, LERP_SPEED);
//     s.x = THREE.MathUtils.lerp(s.x, targetSc, LERP_SPEED);
//     s.y = THREE.MathUtils.lerp(s.y, targetSc, LERP_SPEED);
//     if (m) m.opacity = THREE.MathUtils.lerp(m.opacity, targetOp, LERP_SPEED);
//   });

//   return (
//     <mesh ref={meshRef} position={[0, 0, 0]}>
//       <planeGeometry args={[SLIDE_W, SLIDE_H]} />
//       <meshBasicMaterial map={texture} transparent opacity={1} toneMapped={false} side={THREE.FrontSide} />
//       {item.caption ? (
//         <Html center position={[0, -(SLIDE_H / 2 + 0.25), 0]} style={{ pointerEvents: "none", whiteSpace: "nowrap" }}>
//           <div style={{
//             color: "#fff", fontSize: "13px", fontFamily: "sans-serif",
//             textShadow: "0 1px 8px rgba(0,0,0,1)", background: "rgba(0,0,0,0.5)",
//             padding: "3px 14px", borderRadius: "20px", letterSpacing: "0.02em",
//           }}>
//             {item.caption}
//           </div>
//         </Html>
//       ) : null}
//     </mesh>
//   );
// }

// // ─────────────────────────────────────────────
// function SnapController({ carouselIndexRef, targetIndexRef, isScrollingRef, total, activeIndexRef, onActiveChange }) {
//   useFrame(() => {
//     if (!isScrollingRef.current) {
//       carouselIndexRef.current = THREE.MathUtils.lerp(
//         carouselIndexRef.current,
//         targetIndexRef.current,
//         LERP_SNAP
//       );
//     }
//     const rounded = ((Math.round(carouselIndexRef.current) % total) + total) % total;
//     if (activeIndexRef.current !== rounded) {
//       activeIndexRef.current = rounded;
//       onActiveChange(rounded);
//     }
//   });
//   return null;
// }

// // ─────────────────────────────────────────────
// function CoverflowScene({ images, startIndex, onActiveChange }) {
//   const total            = images.length;
//   const carouselIndexRef = useRef(startIndex);
//   const targetIndexRef   = useRef(startIndex);
//   const isScrollingRef   = useRef(false);
//   const activeIndexRef   = useRef(startIndex);
//   const snapTimer        = useRef(null);

//   const scheduleSnap = useCallback(() => {
//     isScrollingRef.current = true;
//     clearTimeout(snapTimer.current);
//     snapTimer.current = setTimeout(() => {
//       isScrollingRef.current = false;
//       targetIndexRef.current = Math.round(carouselIndexRef.current);
//     }, SNAP_DELAY_MS);
//   }, []);

//   const advance = useCallback((delta) => {
//     carouselIndexRef.current += delta;
//     scheduleSnap();
//   }, [scheduleSnap]);

//   useEffect(() => {
//     const fn = (e) => { e.preventDefault(); advance(e.deltaY * SCROLL_SENS); };
//     window.addEventListener("wheel", fn, { passive: false });
//     return () => window.removeEventListener("wheel", fn);
//   }, [advance]);

//   useEffect(() => {
//     let sx = null;
//     const dn = (e) => { sx = e.clientX; };
//     const mv = (e) => { if (sx === null) return; advance((sx - e.clientX) * DRAG_SENS); sx = e.clientX; };
//     const up = () => { sx = null; };
//     window.addEventListener("pointerdown", dn);
//     window.addEventListener("pointermove", mv);
//     window.addEventListener("pointerup",   up);
//     return () => {
//       window.removeEventListener("pointerdown", dn);
//       window.removeEventListener("pointermove", mv);
//       window.removeEventListener("pointerup",   up);
//     };
//   }, [advance]);

//   useEffect(() => {
//     const fn = (e) => {
//       if (e.key === "ArrowRight" || e.key === "ArrowDown") {
//         targetIndexRef.current = Math.round(carouselIndexRef.current) + 1;
//         isScrollingRef.current = false;
//       }
//       if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
//         targetIndexRef.current = Math.round(carouselIndexRef.current) - 1;
//         isScrollingRef.current = false;
//       }
//     };
//     window.addEventListener("keydown", fn);
//     return () => window.removeEventListener("keydown", fn);
//   }, []);

//   return (
//     <>
//       <SnapController
//         carouselIndexRef={carouselIndexRef}
//         targetIndexRef={targetIndexRef}
//         isScrollingRef={isScrollingRef}
//         activeIndexRef={activeIndexRef}
//         total={total}
//         onActiveChange={onActiveChange}
//       />
//       {images.map((item, i) => (
//         <CoverflowSlide
//           key={item.src + i}
//           item={item}
//           index={i}
//           total={total}
//           carouselIndexRef={carouselIndexRef}
//           activeIndexRef={activeIndexRef}
//         />
//       ))}
//     </>
//   );
// }

// // ─────────────────────────────────────────────
// function Dots({ total, activeIndex }) {
//   if (total > 14) return null;
//   return (
//     <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7, zIndex: 10, pointerEvents: "none" }}>
//       {Array.from({ length: total }).map((_, i) => (
//         <div key={i} style={{
//           width: i === activeIndex ? 24 : 7, height: 7, borderRadius: 4,
//           background: i === activeIndex ? "#fff" : "rgba(255,255,255,0.3)",
//           transition: "all 0.25s ease",
//         }} />
//       ))}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// function DesktopGallery({ images, startIndex }) {
//   const [activeIndex, setActiveIndex] = useState(startIndex);
//   return (
//     <div style={{ width: "100%", height: "100%", position: "relative", background: "#0d0d0d" }}>
//       <div style={{
//         position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
//         background: "radial-gradient(ellipse 55% 60% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)",
//       }} />
//       <Canvas camera={{ position: [0, 0, 5.5], fov: 52 }} style={{ width: "100%", height: "100%" }}>
//         <CoverflowScene images={images} startIndex={startIndex} onActiveChange={setActiveIndex} />
//       </Canvas>
//       <Dots total={images.length} activeIndex={activeIndex} />
//       <div style={{
//         position: "absolute", top: 20, right: 24, zIndex: 10, pointerEvents: "none",
//         color: "rgba(255,255,255,0.45)", fontSize: 13, fontFamily: "sans-serif", letterSpacing: "0.08em",
//       }}>
//         {activeIndex + 1} / {images.length}
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// function MobileGallery({ slides, startIndex }) {
//   return (
//     <div style={{ width: "100vw", height: "100dvh", background: "#0d0d0d", overflow: "hidden" }}>
//       <Swiper direction="vertical" initialSlide={startIndex} spaceBetween={0} slidesPerView={1} style={{ width: "100%", height: "100%" }}>
//         {slides.map((item, i) => (
//           <SwiperSlide key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", background: "#0d0d0d" }}>
//             {item.type === "video" ? (
//               <video src={item.src} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//             ) : (
//               <img src={item.src} alt={item.caption || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//             )}
//             <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(transparent, rgba(0,0,0,0.7))", pointerEvents: "none" }} />
//             {item.caption ? (
//               <div style={{
//                 position: "absolute", bottom: 32, left: 0, right: 0, textAlign: "center",
//                 color: "#fff", fontSize: 15, fontFamily: "sans-serif", fontWeight: 500,
//                 letterSpacing: "0.03em", textShadow: "0 1px 6px rgba(0,0,0,0.9)",
//                 padding: "0 24px", pointerEvents: "none",
//               }}>
//                 {item.caption}
//               </div>
//             ) : null}
//             <div style={{
//               position: "absolute", top: 16, right: 16, pointerEvents: "none",
//               color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "sans-serif",
//               background: "rgba(0,0,0,0.35)", padding: "3px 10px", borderRadius: 20,
//             }}>
//               {i + 1} / {slides.length}
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// export default function FullscreenGallery({ images = [], startIndex = 0 }) {
//   const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

//   useEffect(() => {
//     const fn = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", fn);
//     return () => window.removeEventListener("resize", fn);
//   }, []);

//   const slides = useMemo(() =>
//     images.map((item) =>
//       typeof item === "string"
//         ? { src: item, type: "image", caption: "" }
//         : { type: "image", caption: "", ...item }
//     ),
//   [images]);

//   if (isMobile) return <MobileGallery slides={slides} startIndex={startIndex} />;

//   return (
//     <div style={{ width: "100vw", height: "100dvh", overflow: "hidden" }}>
//       <DesktopGallery images={slides} startIndex={startIndex} />
//     </div>
//   );
// }
// import { useEffect, useRef, useState, useMemo, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Mousewheel } from "swiper/modules";
// import gsap from "gsap";
// import "swiper/css";
// import "swiper/css/mousewheel";


// export default function FullscreenGallery({
//   images,
//   isOpen,
//   onClose,
//   startIndex = 0,
// }) {
//   const containerRef = useRef(null);
//   const swiperRef = useRef(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [loaded, setLoaded] = useState({});

//   // ✅ Мемоизированный onClose (чтобы не триггерить эффекты повторно)
//   const handleClose = useCallback(() => onClose(), [onClose]);

//   // ✅ Проверяем мобильное устройство
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // ✅ Запуск анимации открытия/закрытия
//   useEffect(() => {
//     if (!isOpen) return;

//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         containerRef.current,
//         { y: "100%", autoAlpha: 0 },
//         { y: "0%", autoAlpha: 1, duration: 0.45, ease: "power3.out" }
//       );
//     });

//     document.body.style.overflow = "hidden";

//     const handleKeyDown = (e) => e.key === "Escape" && handleClose();
//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       ctx.revert();
//       window.removeEventListener("keydown", handleKeyDown);
//       document.body.style.overflow = "auto";
//     };
//   }, [isOpen, handleClose]);

//   // ✅ При открытии ставим Swiper на нужный слайд
//   useEffect(() => {
//     if (isOpen && swiperRef.current && !isMobile) {
//       swiperRef.current.slideTo(startIndex, 0);
//     }
//   }, [isOpen, startIndex, isMobile]);



//  // ✅ Мемоизируем SwiperSlides (всегда, не внутри условия)
// const swiperSlides = useMemo(
//   () =>
//     images.map((img, i) => (
//       <SwiperSlide
//         key={i}
//         style={{ height: "90vh" }}
//         className="flex justify-center items-center relative"
//       >
//         {!loaded[i] && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-20 h-20 border-4 border-gray-400 border-t-white rounded-full animate-spin"></div>
//           </div>
//         )}
//         {/* <img
//           src={img}
//           alt={`Slide ${i}`}
//           className={`max-h-[85vh] object-contain max-w-full transition-opacity duration-500 ${
//             loaded[i] ? "opacity-100" : "opacity-0"
//           }`}
//           draggable="false"
//           loading="lazy"
//           onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
//         /> */}

        
//       </SwiperSlide>
//     )),
//   [images, loaded]
// );

// if (!isOpen) return null;


//   return (
//     <div
//       ref={containerRef}
//       className="fixed top-0 left-0 w-full h-full z-[99999999999999] bg-black bg-opacity-95 overflow-y-auto"
//       style={{ opacity: 0, transform: "translateY(100%)" }}
//     >
//       {/* ✖ Закрытие */}
//       <button
//         onClick={handleClose}
//         className="absolute top-4 right-4 z-50 text-white text-3xl font-bold"
//       >
//         ×
//       </button>

//       {/* 📱 Мобильная версия */}
//       {isMobile ? (
//         <div className="flex flex-col items-center py-4 gap-4">
//           {images.map((img, i) => (
//             <div key={i} className="w-full px-2">
//               {!loaded[i] && (
//                 <div className="w-full flex justify-center items-center py-16 bg-gray-800 animate-pulse rounded-md">
//                   <div className="w-12 h-12 border-4 border-gray-400 border-t-white rounded-full animate-spin"></div>
//                 </div>
//               )}
//               <img
//                 src={img}
//                 alt={`Slide ${i}`}
//                 className={`w-full object-contain transition-opacity duration-500 rounded-md ${
//                   loaded[i] ? "opacity-100" : "opacity-0"
//                 }`}
//                 loading="lazy"
//                 onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
//               />
//             </div>
//           ))}
//         </div>
//       ) : (
//         /* 💻 Десктоп */
//         <Swiper
//           modules={[Mousewheel]}
//           onSwiper={(swiper) => (swiperRef.current = swiper)}
//           mousewheel={!isMobile}
//           direction="horizontal"
//           className="w-full h-full"
//           spaceBetween={-10}
//           slidesPerView={1.2}
//           centeredSlides
//           grabCursor
//           // loop={false} // 🚫 убрали loop для производительности
//           // preloadImages={false}
// initialSlide={startIndex}
//           watchSlidesProgress
//           lazy={{
//             loadPrevNext: true,
//             loadPrevNextAmount: 1,
//             loadOnTransitionStart: true,
//           }}
//         >
//           {swiperSlides}
//         </Swiper>
//       )}
//     </div>
//   );
// }
// export default function FullscreenGallery({ images, isOpen, onClose, startIndex = 0 }) {
//   const containerRef = useRef(null);
//   const swiperRef = useRef(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [loaded, setLoaded] = useState({});

//   // ✅ При открытии — пушим стейт в историю браузера
//   useEffect(() => {
//     if (isOpen) {
//       window.history.pushState(
//         { galleryOpen: true },
//         "",
//         window.location.pathname + window.location.search + "#gallery"
//       );
//     }
//   }, [isOpen]);

//   // ✅ Слушаем кнопку "Назад" в браузере
//   useEffect(() => {
//     if (!isOpen) return;

//     // const handlePopState = () => {
//     //   onClose(); // закрываем галерею — без history.back(), он уже сработал
//     // };
// const handlePopState = (e) => {
//   // Закрываем только если уходим с нашего галерейного стейта
//   onClose();
// };
//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, [isOpen, onClose]);

//   // ✅ Крестик закрывает через history.back() → тригерит popstate → onClose()
//   // const handleClose = useCallback(() => {
//   //   window.history.back();
//   // }, []);

// const handleClose = useCallback(() => {
//   if (window.history.state?.galleryOpen) {
//     window.history.back(); // → сработает popstate → onClose()
//   } else {
//     // pushState ещё не выполнился или уже не нужен
//     onClose();
//   }
// }, [onClose]);



//   // ✅ Проверяем мобильное устройство
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // ✅ Анимация открытия
//   useEffect(() => {
//     if (!isOpen) return;

//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         containerRef.current,
//         { y: "100%", autoAlpha: 0 },
//         { y: "0%", autoAlpha: 1, duration: 0.45, ease: "power3.out" }
//       );
//     });

//     document.body.style.overflow = "hidden";
//     const handleKeyDown = (e) => e.key === "Escape" && handleClose();
//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       ctx.revert();
//       window.removeEventListener("keydown", handleKeyDown);
//       document.body.style.overflow = "auto";
//     };
//   }, [isOpen, handleClose]);

//   // ✅ Свайпер на нужный слайд
//   useEffect(() => {
//     if (isOpen && swiperRef.current && !isMobile) {
//       swiperRef.current.slideTo(startIndex, 0);
//     }
//   }, [isOpen, startIndex, isMobile]);

//   const swiperSlides = useMemo(
//     () =>
//       images.map((img, i) => (
//         <SwiperSlide
//           key={i}
//           style={{ height: "90vh" }}
//           className="flex justify-center items-center relative"
//         >
//           {!loaded[i] && (
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-20 h-20 border-4 border-gray-400 border-t-white rounded-full animate-spin" />
//             </div>
//           )}
//           <img
//             src={img}
//             alt={`Slide ${i}`}
//             className={`max-h-[85vh] object-contain max-w-full transition-opacity duration-500 ${
//               loaded[i] ? "opacity-100" : "opacity-0"
//             }`}
//             draggable="false"
//             loading="lazy"
//             onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
//           />
//         </SwiperSlide>
//       )),
//     [images, loaded]
//   );

//   if (!isOpen) return null;

//   return (<><button
//         onClick={handleClose}
//         className="fixed cursor-pointer top-4 right-4 z-999999990 text-white text-3xl font-bold"
//       >
//         ×
//       </button>
//     <div
//       ref={containerRef}
//       className="fixed top-0 left-0 w-full h-full z-[9999] bg-black bg-opacity-95 overflow-y-auto"
//       style={{ opacity: 0, transform: "translateY(100%)" }}
//     >
      

//       {isMobile ? (
//         <div className="flex flex-col items-center py-4 gap-4">
//           {images.map((img, i) => (
//             <div key={i} className="w-full px-2">
//               {!loaded[i] && (
//                 <div className="w-full flex justify-center items-center py-16 bg-gray-800 animate-pulse rounded-md">
//                   <div className="w-12 h-12 border-4 border-gray-400 border-t-white rounded-full animate-spin" />
//                 </div>
//               )}
//               <img
//                 src={img}
//                 alt={`Slide ${i}`}
//                 className={`w-full object-contain transition-opacity duration-500 rounded-md ${
//                   loaded[i] ? "opacity-100" : "opacity-0"
//                 }`}
//                 loading="lazy"
//                 onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
//               />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <Swiper
//           modules={[Mousewheel]}
//           onSwiper={(swiper) => (swiperRef.current = swiper)}
//           mousewheel={!isMobile}
//           direction="horizontal"
//           className="w-full h-full"
//           spaceBetween={-10}
//           slidesPerView={1.2}
//           centeredSlides
//           grabCursor
//           initialSlide={startIndex}
//           watchSlidesProgress
//           lazy={{ loadPrevNext: true, loadPrevNextAmount: 1, loadOnTransitionStart: true }}
//         >
//           {swiperSlides}
//         </Swiper>
//       )}
//     </div>
//  </> );
// }