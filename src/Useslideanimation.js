import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ANIMATION_CONFIG } from "./Constants";

/**
 * useSlideAnimation - управление анимацией слайдов и переходов
 * 
 * Отвечает за:
 * - Инициализацию animation state
 * - Запуск transition animation при открытии страницы
 * - Управление видимостью элементов при смене слайда
 */
export function useSlideAnimation(imageData) {
  const animationInProgressRef = useRef(false);

  const [animationState, setAnimationState] = useState({
    complete: !imageData,
    inProgress: false,
    slideChanging: false,
  });

  const updateAnimationState = useCallback((updates) => {
    setAnimationState((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Запускает анимацию переходного изображения
   * Плавный переход от миниатюры к полному размеру
   */
  const startTransitionAnimation = useCallback(
    (
      imageDataProp,
      transitionEl,
      swiperEl,
      thumbsShown
    ) => {
      if (
        !transitionEl ||
        !swiperEl ||
        !imageDataProp ||
        animationInProgressRef.current
      ) {
        updateAnimationState({ complete: true });
        return;
      }

      animationInProgressRef.current = true;
      updateAnimationState({ inProgress: true });

      const { top, left, width, height } = imageDataProp.rect;
      const firstSlideImage = swiperEl.querySelector(".swiper-slide-active img");

      if (!firstSlideImage) {
        console.warn("Активное изображение слайда не найдено");
        animationInProgressRef.current = false;
        updateAnimationState({ complete: true, inProgress: false });
        return;
      }

      const finalRect = firstSlideImage.getBoundingClientRect();

      if (finalRect.width === 0 || finalRect.height === 0) {
        animationInProgressRef.current = false;
        setTimeout(() => {
          updateAnimationState({ inProgress: false });
          startTransitionAnimation(
            imageDataProp,
            transitionEl,
            swiperEl,
            thumbsShown
          );
        }, 100);
        return;
      }

      gsap.set(swiperEl, { visibility: "hidden", opacity: 0 });

      gsap.set(transitionEl, {
        position: "absolute",
        top: top - window.scrollY,
        left: left - window.scrollX,
        width,
        height,
        zIndex: 1000,
        opacity: 1,
        visibility: "visible",
        objectFit: "contain",
        borderRadius: imageDataProp.borderRadius || "0px",
        pointerEvents: "none",
      });

      gsap.to(transitionEl, {
        top: finalRect.top - window.scrollY,
        left: finalRect.left - window.scrollX,
        width: finalRect.width,
        height: finalRect.height,
        borderRadius: "12px",
        duration: ANIMATION_CONFIG.DURATION,
        ease: ANIMATION_CONFIG.EASE,
        onComplete: () => {
          gsap.set(swiperEl, { visibility: "visible", opacity: 1 });
          gsap.set(transitionEl, { visibility: "hidden", opacity: 0 });

          updateAnimationState({ complete: true });

          if (!thumbsShown) {
            showInfoAndThumbs();
          }

          animationInProgressRef.current = false;
          updateAnimationState({ inProgress: false });
        },
      });
    },
    [updateAnimationState]
  );

  /**
   * Показывает информационные панели и миниатюры с анимацией
   */
  const showInfoAndThumbs = useCallback(() => {
    // Получи refs из родителя - эта функция вызывается из компонента
    // Можно передать как параметр или использовать context
    return Promise.resolve();
  }, []);

  return {
    animationState,
    animationInProgressRef,
    startTransitionAnimation,
    updateAnimationState,
    showInfoAndThumbs,
  };
}