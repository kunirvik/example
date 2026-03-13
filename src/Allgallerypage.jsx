
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
 
import FullscreenGallery from "./FullscreenGallery/FullscreenGallery";
import FilmGallery       from "./FilmGallery";
 
import productCatalogSets       from "./data/productCatalogSets";
import productCatalogRamps      from "./data/productCatalogRamps";
import productCatalogSkateparks from "./data/productCatalogSkateparks";
 
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
 
export default function AllGalleryPage() {
  const navigate = useNavigate();
 
  // null = сітка, { slides, index } = FilmGallery
  const [filmState, setFilmState] = useState(null);
 
  const generalSlides = useMemo(buildGeneralSlides, []);
 
  // FullscreenGallery тепер передає { slides, index }:
  //   slides = відфільтрований масив (або всі)
  //   index  = позиція кліканого фото у цьому масиві
  const handleSelectSlide = ({ slides, index }) => {
    setFilmState({ slides, index });
  };
 
  // Закрити FilmGallery → назад у сітку
  const handleCloseFilm = () => setFilmState(null);
 
  // Закрити сітку → назад (каталог / продукт)
  const handleCloseGrid = () => navigate(-1);
 
  if (filmState) {
    return (
      <FilmGallery
        slides={filmState.slides}
        startIndex={filmState.index}
        // onClose → кнопка × і кнопка сітки обидві повертають у сітку
        onClose={handleCloseFilm}
      />
    );
  }
 
  return (
    <FullscreenGallery
      slides={generalSlides}
      onClose={handleCloseGrid}
      onSelectSlide={handleSelectSlide}
    />
  );
}