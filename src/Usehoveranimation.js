import { useRef, useCallback } from "react";

/**
 * Хук для управления hover анимацией смены картинок
 * Использует прямой DOM update вместо setState для оптимизации
 */
export function useHoverAnimation(isTouchDevice, getIntervalDuration) {
  const imageRefsMap = useRef(new Map());
  const hoverIntervalRef = useRef(null);

  const startHoverAnimation = useCallback(
    (index, product, currentImageIndex = 0) => {
      if (isTouchDevice) return;

      clearInterval(hoverIntervalRef.current);

      const totalImages = 1 + (product?.altImages?.length || 0);
      if (totalImages <= 1) return;

      const intervalDuration = getIntervalDuration(totalImages);
      const allImages = [product.image, ...(product.altImages || [])];
      let frameIndex = currentImageIndex;

      hoverIntervalRef.current = setInterval(() => {
        const imgElement = imageRefsMap.current.get(index);
        if (imgElement) {
          frameIndex = (frameIndex + 1) % totalImages;
          imgElement.src = allImages[frameIndex];
        }
      }, intervalDuration);
    },
    [isTouchDevice, getIntervalDuration]
  );

  const stopHoverAnimation = useCallback(() => {
    clearInterval(hoverIntervalRef.current);
    hoverIntervalRef.current = null;
  }, []);

  const registerImageRef = useCallback((index, element) => {
    if (element) {
      imageRefsMap.current.set(index, element);
    } else {
      imageRefsMap.current.delete(index);
    }
  }, []);

  return {
    startHoverAnimation,
    stopHoverAnimation,
    registerImageRef,
    imageRefsMap,
  };
}