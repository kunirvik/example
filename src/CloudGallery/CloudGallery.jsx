

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Masonry from "react-responsive-masonry";
import css from "../CloudGallery/CloudGallery.module.css";
// Импортируем необходимые хуки из React
import { useState, useEffect, useRef, useCallback } from "react";



const CloudGallery = ({ images }) => {
  // Состояние для хранения ориентации изображений (портретная/ландшафтная)
  const [imageSizes, setImageSizes] = useState({});


  const [scrollYBeforeFullscreen, setScrollYBeforeFullscreen] = useState(0);

  // Состояние для основной информации тултипа
  const [tooltip, setTooltip] = useState({ 
    show: false,
    x: 0,
    y: 0,
    productId: null
  });

  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  
  // Определяем мобильное устройство
  const [isMobile, setIsMobile] = useState(false);

  // Эффект для определения мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


const openFullscreen = (index) => {
  if (!isMobile) return;

  const scrollY = window.scrollY;
  setScrollYBeforeFullscreen(scrollY);
  setFullscreenIndex(index);
};


  const closeFullscreen = () => {
    setFullscreenIndex(null);
  };

  // Обработчик клика на фоне или изображении для закрытия
  const handleFullscreenClick = (e) => {
    // Закрываем только если клик был по фону или по самому изображению
    if (e.target === e.currentTarget || e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      closeFullscreen();
    }
  };

useEffect(() => {
  if (fullscreenIndex !== null && isMobile) {
    // Просто убираем скролл, но не фиксируем положение
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [fullscreenIndex, isMobile]);


  const tooltipRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Функция для определения ориентации изображения после его загрузки
  const handleImageLoad = (mediaId, event) => {
    const img = event.target;
    const orientation = img.naturalWidth > img.naturalHeight ? "landscape" : "portrait";
    setImageSizes((prevSizes) => ({
      ...prevSizes,
      [mediaId]: orientation,
    }));
  };

  const handleMouseMove = useCallback((e, productId) => {
    if (isMobile) return; 
    
    mousePositionRef.current = { x: e.pageX, y: e.pageY };
    
    setTooltip(prev => {
      if (!prev.show || prev.productId !== productId) {
        return {
          show: true,
          x: e.pageX,
          y: e.pageY,
          productId
        };
      }
      return prev;
    });
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setTooltip(prev => ({ ...prev, show: false }));
  }, []);

  useEffect(() => {
    if (!tooltip.show) return;
    
    let animationFrameId;
    
    const updateTooltipPosition = () => {
      if (!tooltipRef.current || !tooltip.show) return;
      
      const { x, y } = mousePositionRef.current;
      const { width, height } = tooltipRef.current.getBoundingClientRect();
      
      const tooltipX = x + width + 5 > window.innerWidth ? x - width - 15 : x + 15;
      const tooltipY = y + height + 5 > window.innerHeight ? y - height - 15 : y + 15;
      
      tooltipRef.current.style.left = `${tooltipX}px`;
      tooltipRef.current.style.top = `${tooltipY}px`;
      
      if (tooltip.show) {
        animationFrameId = requestAnimationFrame(updateTooltipPosition);
      }
    };
    
    animationFrameId = requestAnimationFrame(updateTooltipPosition);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [tooltip.show, tooltip.productId]);

  return (
    <>
      <Masonry gutter="16px" columnsCount={isMobile ? 2 : 3}>
        {images.map((media, index) => (
          <div
            key={media.public_id}
            className={css.galleryitem}
            style={{
              width: "100%", 
              display: "block",
              cursor: "pointer"
            }}
            onClick={() => openFullscreen(index)}
            onMouseMove={(e) => {
              if (!isMobile) {
                const caption = media.context?.caption || "No caption";
                const alt = media.context?.alt || "No description";
                handleMouseMove(e, `${caption} — ${alt}`);
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            {media.resource_type === "image" ? (
              <img
                src={media.secure_url}
                alt={media.context?.alt || "No description"}
                className={css.galleryimage}
                onLoad={(e) => handleImageLoad(media.public_id, e)}
                style={{
                  borderRadius: "8px",
                  transition: "transform 0.2s ease"
                }}
              />
            ) : (
              <video
                src={media.secure_url}
                autoPlay
                loop
                muted
                playsInline
                className={css.galleryimage}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  display: "block",
                  transition: "transform 0.2s ease"
                }}
              />
            )}
          </div>
        ))}
      </Masonry>

      {/* Тултип - только для десктопа */}
      {tooltip.show && !isMobile && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            top: tooltip.y + 15,
            left: tooltip.x + 15,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "#847d7d53",
            padding: "6px 10px",
            borderRadius: "4px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 1000,
            maxWidth: "200px",
            wordWrap: "break-word",
          }}
        >
          {tooltip.productId}
        </div>
      )}

      {/* Fullscreen Modal */}
      {fullscreenIndex !== null && (
        <div
          onClick={handleFullscreenClick}
          style={{
            position: "absolute",
  top: `${scrollYBeforeFullscreen}px`,
            left: 0,
            bottom:"40px",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            touchAction: "none",
            overflow: "hidden",
            cursor: "pointer"
          }}
        >
          {/* Кнопка закрытия - только для десктопа */}
          {!isMobile && (
            <button
              onClick={closeFullscreen}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                fontSize: "28px",
                cursor: "pointer",
                zIndex: 10000,
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              ✕
            </button>
          )}

          {/* Контейнер для медиа */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              margin: 0
            }}
            onClick={handleFullscreenClick}
          >
            {images[fullscreenIndex]?.resource_type === "image" ? (
              <img
                src={images[fullscreenIndex].secure_url}
                alt={images[fullscreenIndex].context?.alt || "No description"}
                style={{
                  width: "100vw",
                  height: "100vh",
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "none",
                  display: "block",
                  margin: 0,
                  padding: 0
                }}
                onClick={handleFullscreenClick}
              />
            ) : (
              <video
                src={images[fullscreenIndex].secure_url}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                style={{
                  width: "100vw",
                  height: "100vh",
                  objectFit: "contain",
                  display: "block",
                  margin: 0,
                  padding: 0
                }}
                onClick={handleFullscreenClick}
              />
            )}
          </div>

          {/* Подсказка для мобильных устройств */}
          {isMobile && (
            <div
              style={{
                position: "absolute",
                bottom: 30,
                left: "50%",
                transform: "translateX(-50%)",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "14px",
                textAlign: "center",
                pointerEvents: "none"
              }}
            >
              Нажмите на изображение, чтобы закрыть
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CloudGallery;