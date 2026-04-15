import React from "react";

/**
 * TransitionImage - изображение для анимации при открытии страницы
 * 
 * Props:
 * - src: путь к изображению
 * - alt: альтернативный текст
 */
const TransitionImage = React.forwardRef(({ src, alt }, ref) => {
  return (
    <div className="transition-image-container">
      <img
        ref={ref}
        src={src}
        alt={alt}
        className="object-contain"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          visibility: "visible",
          pointerEvents: "none",
        }}
      />
    </div>
  );
});

TransitionImage.displayName = "TransitionImage";

export default TransitionImage;