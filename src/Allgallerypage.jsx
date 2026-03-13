// AllGalleryPage.jsx
// Маршрут: /gallery/all
//
// Показывает FullscreenGallery (сетку) со ВСЕМИ фото:
//   1. Слайды из продуктов (sample)
//   2. Дополнительные фото из extraGallerySlides.js
//
// При клике на фото открывает FilmGallery поверх.
// Кнопка «назад» в FilmGallery возвращает в сетку, не в историю браузера.

import { useCallback, useState } from "react";
import { useNavigate }           from "react-router-dom";
import FullscreenGallery         from "./FullscreenGallery/FullscreenGallery";
import FilmGallery               from "./FilmGallery";
import { productSlides }         from "./GalleryPage/GalleryPage";
import extraGallerySlides        from "./data/extraGallerySlides";

// ─── Мержим все источники ─────────────────────────────────────────────────────
// Порядок: сначала фото из продуктов, потом extra.
// Меняй порядок по желанию.
const allSlides = [
  ...productSlides,
  ...extraGallerySlides,
];

export default function AllGalleryPage() {
  const navigate                    = useNavigate();
  const [filmIndex, setFilmIndex]   = useState(null); // null = показываем сетку

  const handleClose       = useCallback(() => navigate(-1), [navigate]);
  const handleSelectSlide = useCallback((idx) => setFilmIndex(idx), []);
  const handleFilmClose   = useCallback(() => setFilmIndex(null), []);

  // Пользователь кликнул на фото в сетке → открываем FilmGallery
  if (filmIndex !== null) {
    return (
      <FilmGallery
        slides={allSlides}
        startIndex={filmIndex}
        onClose={handleFilmClose}   // ← переопределяем кнопку «назад»
      />
    );
  }

  return (
    <FullscreenGallery
      slides={allSlides}
      onClose={handleClose}
      onSelectSlide={handleSelectSlide}
    />
  );
}