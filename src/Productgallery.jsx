import React, { useRef, useState, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

/**
 * ProductGallery - универсальный компонент для отображения галереи слайдов
 * 
 * Props:
 * - products: массив продуктов с image, altImages, scale
 * - activeIndex: индекс активного слайда
 * - onSlideChange: callback при смене слайда
 * - onInit: callback при инициализации swiper
 * - selectedImageIndices: массив индексов для alt images
 * - hoveredIndex: какой продукт сейчас в hover
 * - onMouseEnter: обработчик hover
 * - onMouseLeave: выход из hover
 * - onThumbnailClick: клик по миниатюре
 * - imageRefsMap: Map для хранения refs на img элементы (для hover)
 * - animationComplete: завершилась ли intro анимация
 */
export default function ProductGallery({
  products,
  activeIndex,
  onSlideChange,
  onInit,
  selectedImageIndices,
  hoveredIndex,
  onMouseEnter,
  onMouseLeave,
  onThumbnailClick,
  imageRefsMap,
  animationComplete,
}) {
  const swiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);
  const containerRef = useRef(null);

  const SWIPER_CONFIG = {
    SPEED: 600,
    THRESHOLD: 20,
    RESISTANCE_RATIO: 0.85,
  };

  return (
    <div
      ref={containerRef}
      className="w-full border-2 border-indigo-200 lg:w-[75%] lg:h-[100%] mt-10 lg:mt-0 lg:content-center"
      style={{
        visibility: animationComplete ? "visible" : "hidden",
        opacity: animationComplete ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* MAIN SWIPER */}
      <div className="w-full">
        <Swiper
          ref={swiperRef}
          className="custom-swiper h-[250px] sm:h-[300px] md:h-[350px]"
          modules={[Pagination, Mousewheel, Thumbs]}
          pagination={{
            clickable: true,
            el: ".custom-swiper-pagination",
          }}
          mousewheel={true}
          direction="horizontal"
          centeredSlides={true}
          thumbs={{ swiper: thumbsSwiperRef.current }}
          spaceBetween={20}
          initialSlide={activeIndex}
          speed={SWIPER_CONFIG.SPEED}
          threshold={SWIPER_CONFIG.THRESHOLD}
          resistance={true}
          resistanceRatio={SWIPER_CONFIG.RESISTANCE_RATIO}
          onInit={onInit}
          onSlideChange={onSlideChange}
          preventClicks={false}
          preventClicksPropagation={false}
          touchStartPreventDefault={false}
          onSlideChangeTransitionStart={() => {
            // Очистка при смене слайда
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide
              key={product.id}
              style={{
                height: "100%",
                transform: `scale(${product.scale || 1})`,
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  ref={(el) => {
                    if (el && imageRefsMap) {
                      imageRefsMap.set(index, el);
                    }
                  }}
                  src={
                    selectedImageIndices[index] === 0
                      ? product.image
                      : product.altImages[selectedImageIndices[index] - 1]
                  }
                  alt={product.name}
                  className="max-h-full w-auto object-contain cursor-pointer"
                  draggable="false"
                  onMouseEnter={() => onMouseEnter(index, product)}
                  onMouseLeave={() => onMouseLeave(index)}
                  onTouchEnd={() => {
                    // Touch handling
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* THUMBS SWIPER */}
      <div className="w-full mt-5 lg:mt-20">
        <Swiper
          onSwiper={(swiper) => {
            thumbsSwiperRef.current = swiper;
          }}
          modules={[Thumbs]}
          direction="horizontal"
          slidesPerView="auto"
          spaceBetween={10}
          watchSlidesProgress={true}
          slideToClickedSlide={true}
          initialSlide={activeIndex}
          speed={SWIPER_CONFIG.SPEED}
          preventClicks={false}
          preventClicksPropagation={false}
          observer={true}
          observeParents={true}
          resistance={false}
          resistanceRatio={0}
        >
          {products.map((product, index) => (
            <SwiperSlide
              key={product.id}
              className="!w-[120px] sm:!w-[140px] lg:!w-[200px]"
            >
              <img
                src={product.image}
                onClick={() => onThumbnailClick(index)}
                className={`cursor-pointer transition-all duration-300 rounded-lg border-2 px-3 w-full h-20 sm:h-24 lg:h-28 object-contain ${
                  index === activeIndex
                    ? "opacity-100 scale-105 border-black"
                    : "grayscale border-transparent opacity-60 hover:opacity-100"
                }`}
                alt={product.name}
                draggable="false"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}