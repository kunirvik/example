
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
 
import FullscreenGallery from "../FullscreenGallery/FullscreenGallery";
import FilmGallery       from "../FilmGallery";
 
import productCatalogSets       from "../data/productCatalogSets";
import productCatalogRamps      from "../data/productCatalogRamps";
import productCatalogSkateparks from "../data/productCatalogSkateparks";
 
// ─── Додаткові слайди (не з sample) ────────────────────────────────────────
// Додавай сюди будь-які фото/відео які хочеш показати у загальній галереї.
// cat: "stroyka"  → показується у фільтрі як "stroyka"
// cat: "figures"  → показується у фільтрі як "3d models"
// Якщо cat немає — слайд показується, але не підсвічується при фільтрі.
const extraSlides = [
  // Приклад:
  // { type: "image", src: "/images/stroyka/photo1.jpg", caption: "Будівництво", cat: "stroyka" },
  // { type: "image", src: "/images/figures/model1.jpg", caption: "3D модель",   cat: "figures" },
  // { type: "video", src: "/videos/promo.mp4",          caption: "Відео",        cat: "video"   },
];
 
// ─── Збірка всіх слайдів загальної галереї ────────────────────────────────
// Тут беремо sample з кожного продукту + extraSlides.
// cat для продуктових фото: "sets" / "ramps" / "skateparks" / "video"
// FullscreenGallery показує фільтр лише для cats, що є в CAT_LABEL
// (video, stroyka, figures). Решта cat просто не підсвічуються — це нормально.
function buildGeneralSlides() {
  const fromCatalog = (catalog, defaultCat) =>
    catalog.flatMap((p) =>
      (p.sample || []).map((s) => ({
        ...s,
        cat: s.type === "video" ? "video" : defaultCat,
      }))
    );
 
  return [
    ...fromCatalog(productCatalogSets,       "sets"),
    ...fromCatalog(productCatalogRamps,      "ramps"),
    ...fromCatalog(productCatalogSkateparks, "skateparks"),
    ...extraSlides,
  ];
}
 
// ─── Компонент ────────────────────────────────────────────────────────────
export default function AllGalleryPage() {
  const navigate = useNavigate();
 
  // null = показувати сітку, число = показувати FilmGallery з цим startIndex
  const [filmIndex, setFilmIndex] = useState(null);
 
  // Мемоізуємо слайди — щоб не пересчитувати при кожному рендері
  const generalSlides = useMemo(buildGeneralSlides, []);
 
  // Клік на фото у сітці → відкрити FilmGallery
  const handleSelectSlide = (idx) => setFilmIndex(idx);
 
  // Закрити FilmGallery → повернутися до сітки
  const handleCloseFilm = () => setFilmIndex(null);
 
  // Закрити сітку → назад (каталог / продукт / звідки прийшли)
  const handleCloseGrid = () => navigate(-1);
 
  // ── FilmGallery режим ─────────────────────────────────────────────────
  if (filmIndex !== null) {
    return (
      <FilmGallery
        slides={generalSlides}
        startIndex={filmIndex}
        // onClose передаємо → кнопка × та кнопка сітки обидві повертають у сітку
        onClose={handleCloseFilm}
      />
    );
  }
 
  // ── Сітка (FullscreenGallery) ─────────────────────────────────────────
  return (
    <FullscreenGallery
      slides={generalSlides}
      onClose={handleCloseGrid}
      onSelectSlide={handleSelectSlide}
    />
  );
}