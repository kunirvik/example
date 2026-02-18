
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import gsap from "gsap";
import "swiper/css";
import "swiper/css/mousewheel";


export default function FullscreenGallery({
  images,
  isOpen,
  onClose,
  startIndex = 0,
}) {
  const containerRef = useRef(null);
  const swiperRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState({});

  // ✅ Мемоизированный onClose (чтобы не триггерить эффекты повторно)
  const handleClose = useCallback(() => onClose(), [onClose]);

  // ✅ Проверяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Запуск анимации открытия/закрытия
  useEffect(() => {
    if (!isOpen) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { y: "100%", autoAlpha: 0 },
        { y: "0%", autoAlpha: 1, duration: 0.45, ease: "power3.out" }
      );
    });

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, handleClose]);

  // ✅ При открытии ставим Swiper на нужный слайд
  useEffect(() => {
    if (isOpen && swiperRef.current && !isMobile) {
      swiperRef.current.slideTo(startIndex, 0);
    }
  }, [isOpen, startIndex, isMobile]);



 // ✅ Мемоизируем SwiperSlides (всегда, не внутри условия)
const swiperSlides = useMemo(
  () =>
    images.map((img, i) => (
      <SwiperSlide
        key={i}
        style={{ height: "90vh" }}
        className="flex justify-center items-center relative"
      >
        {!loaded[i] && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-gray-400 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={img}
          alt={`Slide ${i}`}
          className={`max-h-[85vh] object-contain max-w-full transition-opacity duration-500 ${
            loaded[i] ? "opacity-100" : "opacity-0"
          }`}
          draggable="false"
          loading="lazy"
          onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
        />
      </SwiperSlide>
    )),
  [images, loaded]
);

if (!isOpen) return null;


  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full z-[99999999999999] bg-black bg-opacity-95 overflow-y-auto"
      style={{ opacity: 0, transform: "translateY(100%)" }}
    >
      {/* ✖ Закрытие */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 text-white text-3xl font-bold"
      >
        ×
      </button>

      {/* 📱 Мобильная версия */}
      {isMobile ? (
        <div className="flex flex-col items-center py-4 gap-4">
          {images.map((img, i) => (
            <div key={i} className="w-full px-2">
              {!loaded[i] && (
                <div className="w-full flex justify-center items-center py-16 bg-gray-800 animate-pulse rounded-md">
                  <div className="w-12 h-12 border-4 border-gray-400 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={img}
                alt={`Slide ${i}`}
                className={`w-full object-contain transition-opacity duration-500 rounded-md ${
                  loaded[i] ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
              />
            </div>
          ))}
        </div>
      ) : (
        /* 💻 Десктоп */
        <Swiper
          modules={[Mousewheel]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          mousewheel={!isMobile}
          direction="horizontal"
          className="w-full h-full"
          spaceBetween={-10}
          slidesPerView={1.2}
          centeredSlides
          grabCursor
          // loop={false} // 🚫 убрали loop для производительности
          // preloadImages={false}
initialSlide={startIndex}
          watchSlidesProgress
          lazy={{
            loadPrevNext: true,
            loadPrevNextAmount: 1,
            loadOnTransitionStart: true,
          }}
        >
          {swiperSlides}
        </Swiper>
      )}
    </div>
  );
}
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