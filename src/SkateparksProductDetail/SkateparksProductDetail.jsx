
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons";
import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
import FullscreenGallery from "../FullscreenGallery/FullscreenGallery";
import productCatalogSkateparks from "../data/productCatalogSkateparks";
import "swiper/css";
import "swiper/css/pagination";
import Accordion from "../Accordion/Accordion";
import { useOpenGallery } from "../useOpenGallery";
import ContactButton from "../ContactButtons/ContactButton";
import Footer from "../Footer/Footer";

// Константы
const ANIMATION_CONFIG = {
  DURATION: 0.6,
  EASE: "power2.out",
  HALF_DURATION: 0.3
};

const SWIPER_CONFIG = {
  SPEED: ANIMATION_CONFIG.DURATION * 1000,
  THRESHOLD: 20,
  RESISTANCE_RATIO: 0.85
};

const LOADING_SCREEN_DURATION = 1500;

export default function SkateparksProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const imageData = location.state?.imageData;
  const slideIndexParam = Number(searchParams.get("view")) || 0;

  const isDesktop = () => window.innerWidth >= 1024;

  const shouldShowLoading = useMemo(() => !imageData, [imageData]);

  // ─── State ───────────────────────────────────────────────────────────────
  const [state, setState] = useState(() => ({
    activeProductIndex: Math.max(
      0,
      productCatalogSkateparks.findIndex((p) => p.id === Number(id))
    ),
    selectedImageIndices: productCatalogSkateparks.map(() => 0),
    hoveredIndex: null,
    isGalleryOpen: false,
    galleryStartIndex: 0,
    thumbsShown: false,
    purchaseShown: false,
    productionShown: false,
  }));

  const [accordionState, setAccordionState] = useState({
    purchase: null,
    product: 0,
    virobi: null,
  });

  const [swiperInstances, setSwiperInstances] = useState({
    main: null,
    thumbs: null,
  });

  const [animationState, setAnimationState] = useState({
    complete: !imageData,
    inProgress: false,
    slideChanging: false,
  });

  const [loadingState, setLoadingState] = useState({
    isLoading: shouldShowLoading,
    isCompleted: false,
  });

  // ─── Refs ────────────────────────────────────────────────────────────────
  const refs = useRef({
    container: null,
    transitionImage: null,
    swiperContainer: null,
    info: null,
    purchaceAccordion: null,
    productionAccordion: null,
    thumbs: null,
    urlUpdateBlocked: false,
    lastInteraction: Date.now(),
    hoverInterval: null,
    hoveredIndex: null,
    pendingHover: null,
    mousePos: { x: 0, y: 0 },
  });

  // FIX 2: отдельный ref для inProgress — читается мгновенно без stale closure
  const animationInProgressRef = useRef(false);

  const socialButtonsRef = useRef(null);

  // ─── Мемо ────────────────────────────────────────────────────────────────
  const currentProduct = useMemo(
    () => productCatalogSkateparks[state.activeProductIndex],
    [state.activeProductIndex]
  );

  // ─── Утилиты ─────────────────────────────────────────────────────────────
  const updateUrl = useCallback((productId) => {
    if (refs.current.urlUpdateBlocked) return;
    refs.current.urlUpdateBlocked = true;
    window.history.replaceState(null, "", `/product/skateparks/${productId}`);
    setTimeout(() => {
      refs.current.urlUpdateBlocked = false;
    }, 50);
  }, []);

  const updateAnimationState = useCallback((updates) => {
    setAnimationState((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // ─── Loading ──────────────────────────────────────────────────────────────
  const handleLoadingComplete = useCallback(() => {
    setLoadingState((prev) => ({ ...prev, isCompleted: true }));
    setTimeout(() => {
      setLoadingState((prev) => ({ ...prev, isLoading: false }));

      requestAnimationFrame(() => {
        const targets = [
          refs.current.container,
          refs.current.info,
          refs.current.purchaceAccordion,
          refs.current.productionAccordion,
        ].filter(Boolean);

        gsap.set(targets, { opacity: 0, y: 20 });

        targets.forEach((el, i) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: ANIMATION_CONFIG.DURATION,
            ease: ANIMATION_CONFIG.EASE,
            delay: i * 0.1,
          });
        });
      });
    }, 200);
  }, []);

  // ─── Анимация info ────────────────────────────────────────────────────────
  const animateInfo = useCallback((direction = "in") => {
    if (!refs.current.info) return Promise.resolve();

    const isIn = direction === "in";
    return new Promise((resolve) => {
      gsap.to(refs.current.info, {
        opacity: isIn ? 1 : 0,
        y: isIn ? 0 : 20,
        duration: isIn ? ANIMATION_CONFIG.DURATION : ANIMATION_CONFIG.HALF_DURATION,
        ease: ANIMATION_CONFIG.EASE,
        onComplete: resolve,
      });
    });
  }, []);

  // ─── Mouse / Touch ────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    refs.current.mousePos = { x: e.clientX, y: e.clientY };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches?.[0]) {
      refs.current.mousePos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);

  // ─── Hover ────────────────────────────────────────────────────────────────
  const getIntervalDuration = useCallback((totalImages) => {
    if (totalImages <= 1) return null;
    const minImages = 3, maxImages = 15;
    const minInterval = 200, maxInterval = 1500;
    if (totalImages <= minImages) return maxInterval;
    if (totalImages >= maxImages) return minInterval;
    const ratio = (totalImages - minImages) / (maxImages - minImages);
    return maxInterval - ratio * (maxInterval - minInterval);
  }, []);

  const startHoverInterval = useCallback(
    (index, product) => {
      if (isTouchDevice) return;
      clearInterval(refs.current.hoverInterval);
      const totalImages = 1 + (product?.altImages?.length || 0);
      if (totalImages <= 1) return;
      const intervalDuration = getIntervalDuration(totalImages);
      refs.current.hoverInterval = setInterval(() => {
        setState((prev) => {
          const newIndices = [...prev.selectedImageIndices];
          newIndices[index] = (newIndices[index] ?? 0 + 1) % totalImages;
          return { ...prev, selectedImageIndices: newIndices };
        });
      }, intervalDuration);
    },
    [isTouchDevice, getIntervalDuration]
  );

  const isPointerOverSwiper = useCallback(() => {
    if (!refs.current.swiperContainer) return false;
    const { x, y } = refs.current.mousePos;
    const el = document.elementFromPoint(x, y);
    return !!el && refs.current.swiperContainer.contains(el);
  }, []);

  const handleMouseEnter = useCallback(
    (index, product) => {
      if (isTouchDevice) return;
      if (!animationState.complete || animationState.inProgress) return;
      updateState({ hoveredIndex: index });
      clearInterval(refs.current.hoverInterval);
      const totalImages = 1 + (product?.altImages?.length || 0);
      if (totalImages <= 1) return;
      const intervalDuration = getIntervalDuration(totalImages);
      refs.current.hoverInterval = setInterval(() => {
        setState((prev) => {
          const newIndices = [...prev.selectedImageIndices];
          const cur = newIndices[index] ?? 0;
          newIndices[index] = (cur + 1) % totalImages;
          return { ...prev, selectedImageIndices: newIndices };
        });
      }, intervalDuration);
    },
    [animationState.complete, animationState.inProgress, isTouchDevice, getIntervalDuration, updateState]
  );

  const handleMouseLeave = useCallback(() => {
    updateState({ hoveredIndex: null });
    clearInterval(refs.current.hoverInterval);
    refs.current.hoverInterval = null;
  }, [updateState]);

  const handleTouchStart = useCallback(() => {
    if (!isDesktop()) return;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDesktop()) return;
    clearInterval(refs.current.hoverInterval);
  }, []);

  // ─── Gallery ──────────────────────────────────────────────────────────────
  const openGallery = useOpenGallery();

  // ─── showInfoAndThumbs ────────────────────────────────────────────────────
  // FIX 3: вынесено выше startTransitionAnimation, чтобы попасть в deps корректно
  const showInfoAndThumbs = useCallback(() => {
    const targets = [
      { ref: refs.current.info },
      { ref: refs.current.thumbs },
      { ref: refs.current.purchaceAccordion },
      { ref: refs.current.productionAccordion },
    ].filter((t) => t.ref);

    const animations = targets.map(({ ref }) =>
      gsap.fromTo(
        ref,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.DURATION,
          ease: ANIMATION_CONFIG.EASE,
        }
      )
    );

    return Promise.all(
      animations.map(
        (anim) =>
          new Promise((resolve) => anim.eventCallback("onComplete", resolve))
      )
    );
  }, []); // refs стабильны, зависимостей нет

  // ─── Transition animation ─────────────────────────────────────────────────
  // FIX 1: убран window.history.replaceState из onComplete
  // FIX 2: читаем animationInProgressRef.current вместо animationState.inProgress
  // FIX 3: showInfoAndThumbs добавлен в deps
  const startTransitionAnimation = useCallback(() => {
    if (
      !refs.current.transitionImage ||
      !refs.current.swiperContainer ||
      !imageData ||
      animationInProgressRef.current // ← FIX 2: ref, не state
    ) {
      updateAnimationState({ complete: true });
      return;
    }

    animationInProgressRef.current = true; // ← FIX 2
    updateAnimationState({ inProgress: true });

    const { top, left, width, height } = imageData.rect;
    const transitionEl = refs.current.transitionImage;
    const swiperEl = refs.current.swiperContainer;
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
        startTransitionAnimation();
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
      borderRadius: imageData.borderRadius || "0px",
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
      onComplete: async () => {
        gsap.set(swiperEl, { visibility: "visible", opacity: 1 });
        gsap.set(transitionEl, { visibility: "hidden", opacity: 0 });

        // FIX 1: window.history.replaceState УДАЛЁН — он очищал imageData
        // и приводил к размонтированию transitionImage

        updateAnimationState({ complete: true });

        if (!state.thumbsShown) {
          await showInfoAndThumbs(); // FIX 3: showInfoAndThumbs в deps
          updateState({ thumbsShown: true });
        }

        animationInProgressRef.current = false; // FIX 2
        updateAnimationState({ inProgress: false });
      },
    });
  }, [
    imageData,
    updateAnimationState,
    updateState,
    showInfoAndThumbs, // FIX 3: добавлен
    // animationState.inProgress УДАЛЁН — теперь используем ref (FIX 2)
  ]);

  // ─── Swiper init ──────────────────────────────────────────────────────────
  const handleSwiperInit = useCallback(
    (swiper) => {
      setSwiperInstances((prev) => ({ ...prev, main: swiper }));

      if (!imageData) {
        if (!state.thumbsShown) {
          gsap.set(refs.current.purchaceAccordion, { opacity: 0, y: 20 });
          gsap.set(refs.current.info, { opacity: 0, y: 20 });
          gsap.set(refs.current.thumbs, { opacity: 0, y: 20 });
          showInfoAndThumbs().then(() =>
            updateState({
              thumbsShown: true,
              purchaseShown: true,
              productionShown: true,
            })
          );
        }
        return;
      }

      requestAnimationFrame(startTransitionAnimation);
    },
    [
      imageData,
      startTransitionAnimation,
      state.thumbsShown,
      showInfoAndThumbs,
      updateState,
    ]
  );

  // ─── Slide change ─────────────────────────────────────────────────────────
  const handleSlideChange = useCallback(
    async (swiper) => {
      socialButtonsRef.current?.close();
      const newIndex = swiper.activeIndex;
      if (newIndex === state.activeProductIndex || animationInProgressRef.current) return;

      const oldIndex = state.activeProductIndex;
      animationInProgressRef.current = true;
      updateAnimationState({ slideChanging: true, inProgress: true });

      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        setAccordionState({ purchase: null, product: null, virobi: null });
      } else {
        setAccordionState((prev) => ({
          purchase: null,
          product: 0,
          virobi: prev.virobi,
        }));
      }

      await animateInfo("out");

      setState((prev) => {
        const newIndices = [...prev.selectedImageIndices];
        newIndices[newIndex] = 0;
        return {
          ...prev,
          activeProductIndex: newIndex,
          selectedImageIndices: newIndices,
        };
      });

      updateUrl(productCatalogSkateparks[newIndex].id);

      if (swiperInstances.thumbs) {
        swiperInstances.thumbs.slideTo(newIndex);
      }

      animationInProgressRef.current = false;
      updateAnimationState({ slideChanging: false, inProgress: false });

      if (isMobile) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        setAccordionState({ purchase: null, product: 0, virobi: null });
      }

      await animateInfo("in");

      clearInterval(refs.current.hoverInterval);
      refs.current.hoverInterval = null;

      setTimeout(async () => {
        setState((prev) => {
          const newIndices = [...prev.selectedImageIndices];
          newIndices[oldIndex] = 0;
          return { ...prev, selectedImageIndices: newIndices };
        });

        if (isTouchDevice) return;

        const pending = refs.current.pendingHover;
        if (
          (pending && pending.index === newIndex) ||
          refs.current.hoveredIndex === newIndex ||
          isPointerOverSwiper()
        ) {
          const product = productCatalogSkateparks[newIndex];
          startHoverInterval(newIndex, product);
          refs.current.pendingHover = null;
        }
      }, SWIPER_CONFIG.SPEED);
    },
    [
      state.activeProductIndex,
      swiperInstances.thumbs,
      updateUrl,
      animateInfo,
      updateAnimationState,
      isPointerOverSwiper,
      startHoverInterval,
      isTouchDevice,
    ]
  );

  // ─── Thumbnail click ──────────────────────────────────────────────────────
  const handleThumbnailClick = useCallback(
    (index) => {
      socialButtonsRef.current?.close();
      if (
        animationInProgressRef.current ||
        index === state.activeProductIndex ||
        !swiperInstances.main
      )
        return;
      swiperInstances.main.slideTo(index);
    },
    [state.activeProductIndex, swiperInstances.main]
  );

  // ─── Accordion ────────────────────────────────────────────────────────────
  const handleAccordionToggle = (type) => (index) => {
    if (type === "virobi") {
      openGallery("sets", state.activeProductIndex);
      setAccordionState((prev) => ({ ...prev, virobi: null }));
      return;
    }

    if (type === "purchase") {
      setAccordionState((prev) => ({
        virobi: prev.virobi,
        purchase: prev.purchase === index ? null : index,
        product: null,
      }));
      return;
    }

    // type === 'product'
    setAccordionState((prev) => ({
      virobi: prev.virobi,
      purchase: null,
      product: prev.product === index ? null : index,
    }));
  };

  // ─── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldShowLoading) return;
    const timer = setTimeout(handleLoadingComplete, LOADING_SCREEN_DURATION);
    return () => clearTimeout(timer);
  }, [shouldShowLoading, handleLoadingComplete]);

  useEffect(() => {
    if (!isTouchDevice) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => window.removeEventListener("mousemove", handleMouseMove);
    } else {
      window.addEventListener("touchstart", handleTouchMove, { passive: true });
      return () => window.removeEventListener("touchstart", handleTouchMove);
    }
  }, [handleMouseMove, handleTouchMove, isTouchDevice]);

  useEffect(() => {
    if (!swiperInstances.main || animationInProgressRef.current) return;
    setState((prev) => {
      const newIndices = [...prev.selectedImageIndices];
      newIndices[state.activeProductIndex] = slideIndexParam;
      return { ...prev, selectedImageIndices: newIndices };
    });
  }, [slideIndexParam, swiperInstances.main, state.activeProductIndex]);

  useEffect(() => {
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    const applyStyles = (desktop) => {
      styleElement.innerHTML = `
        html, body { 
          overflow: auto !important; 
          height: 100% !important;
          width: 100% !important;
        }
        .swiper-wrapper { 
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; 
        }
        .swiper-slide { 
          transition: transform ${ANIMATION_CONFIG.DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                      opacity ${ANIMATION_CONFIG.DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; 
        }
        .swiper-no-transition .swiper-wrapper { transition: none !important; }
        .swiper-slide-thumb-active {
          opacity: 1 !important;
          transform: scale(1.05) !important;
          border: 2px solid black !important;
          border-radius: 0.5rem !important;
        }
        .transition-image-container {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
          pointer-events: none !important;
        }
      `;
    };

    const handleResize = () => applyStyles(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.head.removeChild(styleElement);
      clearInterval(refs.current.hoverInterval);
    };
  }, []);

  useEffect(() => {
    const swiper = swiperInstances.main;
    if (!swiper || animationInProgressRef.current) return;

    const newIndex = swiper.activeIndex;
    if (newIndex !== state.activeProductIndex) {
      updateState({ activeProductIndex: newIndex });
      updateUrl(productCatalogSkateparks[newIndex].id);

      if (swiperInstances.thumbs) {
        swiperInstances.thumbs.slideTo(newIndex);
      }
    }
  }, [
    swiperInstances.main?.activeIndex,
    state.activeProductIndex,
    updateState,
    updateUrl,
    swiperInstances.thumbs,
  ]);

  // ─── Early returns ────────────────────────────────────────────────────────
  if (!currentProduct) {
    return <div className="text-center mt-10 p-4">Продукт не найден</div>;
  }

  if (loadingState.isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex flex-col border-2 border-indigo-200 min-h-screen">
        <div className="z-50 flex-shrink-0">
          <SocialButtons
            ref={socialButtonsRef}
            buttonLabel="shop"
            onButtonClick={() => navigate("/catalogue")}
            buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
          />
        </div>

        <div
          ref={(el) => (refs.current.container = el)}
          className="w-full flex-grow mt-[70px] lg:mt-[50px] px-4"
          style={{
            opacity:
              shouldShowLoading && !loadingState.isCompleted ? 0 : 1,
          }}
        >
          <div className="w-full hidden sm:block flex items-start mb-4" />

          <div className="w-full border-2 border-indigo-600 h-[50%] flex flex-col lg:flex-row relative">
            {/* ── Информационная панель ─────────────────────────────────── */}
            <div className="flex lg:flex-col w-full">

              {/* DESKTOP: три отдельных аккордеона */}
              <div className="hidden lg:block border-2 border-indigo-200 w-full">
                <div
                  ref={(el) => (refs.current.info = el)}
                  className="w-full border-2 border-indigo-200 flex flex-col"
                  style={{
                    opacity:
                      animationState.slideChanging ||
                      (!animationState.complete && imageData)
                        ? 0
                        : 1,
                    transform:
                      animationState.slideChanging ||
                      (!animationState.complete && imageData)
                        ? "translateY(20px)"
                        : "translateY(0)",
                    pointerEvents: animationState.slideChanging
                      ? "none"
                      : "auto",
                  }}
                >
                  <Accordion
                    items={[
                      {
                        title: currentProduct.name,
                        content: currentProduct.description2,
                      },
                    ]}
                    controlled={true}
                    openIndex={accordionState.product}
                    onToggle={handleAccordionToggle("product")}
                  />
                </div>

                <div
                  className="w-full"
                  ref={(el) => (refs.current.purchaceAccordion = el)}
                  style={{ opacity: state.purchaseShown ? 1 : 0 }}
                >
                  <Accordion
                    items={[
                      {
                        title: "замовити",
                        content: (
                          <>
                            {currentProduct.description}
                            <ContactButton />
                          </>
                        ),
                      },
                    ]}
                    controlled={true}
                    openIndex={accordionState.purchase}
                    onToggle={handleAccordionToggle("purchase")}
                  />
                </div>

                <div
                  className="w-full"
                  ref={(el) => (refs.current.productionAccordion = el)}
                  style={{ opacity: state.productionShown ? 1 : 0 }}
                >
                  <Accordion
                    items={[{ title: "вироби" }]}
                    controlled={true}
                    openIndex={accordionState.virobi}
                    onToggle={handleAccordionToggle("virobi")}
                  />
                </div>
              </div>

              {/* MOBILE: один аккордеон с тремя табами */}
              <div className="block lg:hidden w-full">
                <Accordion
                  key={state.activeProductIndex}
                  items={[
                    {
                      title: "замовити",
                      content: (
                        <>
                          {currentProduct.description}
                          <ContactButton />
                        </>
                      ),
                    },
                    {
                      title: currentProduct.name,
                      content: currentProduct.description2,
                    },
                    { title: "вироби", content: null },
                  ]}
                  mobileMode={true}
                  controlled={true}
                  openIndex={
                    accordionState.purchase === 0
                      ? 0
                      : accordionState.product === 0
                      ? 1
                      : accordionState.virobi === 0
                      ? 2
                      : null
                  }
                  onToggle={(index) => {
                    if (index === 0) handleAccordionToggle("purchase")(0);
                    else if (index === 1) handleAccordionToggle("product")(0);
                    else if (index === 2) handleAccordionToggle("virobi")(0);
                  }}
                />
              </div>
            </div>

            {/* ── Переходное изображение ───────────────────────────────── */}
            {!animationState.complete && imageData && (
              <div className="transition-image-container">
                <img
                  ref={(el) => (refs.current.transitionImage = el)}
                  src={currentProduct.image}
                  alt={currentProduct.name}
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
            )}

            {/* ── Swiper галерея ───────────────────────────────────────── */}
            <div
              ref={(el) => (refs.current.swiperContainer = el)}
              className="w-full border-2 border-indigo-200 lg:w-[75%] lg:h-[100%] mt-10 lg:mt-0 lg:content-center"
              style={{
                visibility:
                  !imageData || animationState.complete ? "visible" : "hidden",
                opacity: !imageData || animationState.complete ? 1 : 0,
              }}
            >
              <div className="w-full flex flex-row items-center justify-between gap-2">
                <div className="w-[100%]">
                  <Swiper
                    className="custom-swiper h-[250px] sm:h-[300px] md:h-[350px]"
                    modules={[Pagination, Mousewheel, Thumbs]}
                    pagination={{
                      clickable: true,
                      el: ".custom-swiper-pagination",
                    }}
                    mousewheel={true}
                    direction="horizontal"
                    centeredSlides={true}
                    thumbs={{ swiper: swiperInstances.thumbs }}
                    spaceBetween={20}
                    initialSlide={state.activeProductIndex}
                    speed={SWIPER_CONFIG.SPEED}
                    threshold={SWIPER_CONFIG.THRESHOLD}
                    resistance={true}
                    resistanceRatio={SWIPER_CONFIG.RESISTANCE_RATIO}
                    onInit={handleSwiperInit}
                    onSlideChange={handleSlideChange}
                    preventClicks={false}
                    preventClicksPropagation={false}
                    touchStartPreventDefault={false}
                    onSlideChangeTransitionStart={() => {
                      clearInterval(refs.current.hoverInterval);
                      refs.current.hoverInterval = null;
                    }}
                  >
                    {productCatalogSkateparks.map((product, index) => (
                      <SwiperSlide key={product.id} style={{ height: "100%" }}>
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src={
                              state.selectedImageIndices[index] === 0
                                ? product.image
                                : product.altImages[
                                    state.selectedImageIndices[index] - 1
                                  ]
                            }
                            alt={product.name}
                            className="max-h-full w-auto object-contain"
                            draggable="false"
                            onMouseEnter={() =>
                              handleMouseEnter(index, product)
                            }
                            onMouseLeave={() => handleMouseLeave(index)}
                            onTouchStart={() =>
                              handleTouchStart(index, product)
                            }
                            onTouchEnd={() => handleTouchEnd(index)}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

              {/* Thumbs */}
              <div
                ref={(el) => (refs.current.thumbs = el)}
                className="w-full mt-5 lg:mt-20"
                style={{ opacity: state.thumbsShown ? 1 : 0 }}
              >
                <Swiper
                  modules={[Thumbs]}
                  direction="horizontal"
                  onSwiper={(swiper) =>
                    setSwiperInstances((prev) => ({ ...prev, thumbs: swiper }))
                  }
                  slidesPerView="auto"
                  spaceBetween={10}
                  watchSlidesProgress={true}
                  slideToClickedSlide={true}
                  initialSlide={state.activeProductIndex}
                  speed={SWIPER_CONFIG.SPEED}
                  preventClicks={false}
                  preventClicksPropagation={false}
                  observer={true}
                  observeParents={true}
                  resistance={false}
                  resistanceRatio={0}
                >
                  {productCatalogSkateparks.map((product, index) => (
                    <SwiperSlide
                      key={product.id}
                      className="!w-[120px] sm:!w-[140px] lg:!w-[200px]"
                    >
                      <img
                        src={product.image}
                        onClick={() => handleThumbnailClick(index)}
                        className={`cursor-pointer transition-all duration-300 rounded-lg border-2 px-3 w-full h-20 sm:h-24 lg:h-28 object-contain ${
                          index === state.activeProductIndex
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
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}