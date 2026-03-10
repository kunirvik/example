// AllGalleryPage.jsx
// Маршрут: /gallery/all
//
// Отображает FullscreenGallery (сетку всех фото) как полноценную страницу.
// При клике на фото переходит в FilmGallery с нужным startIndex.

import { useCallback, useState } from "react";
import { useNavigate }           from "react-router-dom";
import FullscreenGallery         from "./FullscreenGallery/FullscreenGallery";
import FilmGallery               from "./FilmGallery";
import { allSlides }             from "./GalleryPage/GalleryPage";

export default function AllGalleryPage() {
  const navigate  = useNavigate();
  const [filmIndex, setFilmIndex] = useState(null); // null = показываем сетку

  const handleClose = useCallback(() => navigate(-1), [navigate]);

  // Пользователь кликнул на фото → открываем FilmGallery поверх
  const handleSelectSlide = useCallback((idx) => {
    setFilmIndex(idx);
  }, []);

  // Закрыть FilmGallery — вернуться в сетку
  const handleFilmClose = useCallback(() => {
    setFilmIndex(null);
  }, []);

  if (filmIndex !== null) {
    return (
      <FilmGallery
        slides={allSlides}
        startIndex={filmIndex}
        // Переопределяем кнопку «назад»: вместо navigate(-1) возвращаемся в сетку
        onClose={handleFilmClose}
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