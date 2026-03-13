// import { useLocation, useNavigate } from "react-router-dom";
// import FullscreenGallery from "../FullscreenGallery/FullscreenGallery";
// import productCatalogSets from "../data/productCatalogSets";
// import productCatalogRamps from "../data/productCatalogRamps";
// import productCatalogSkateparks from "../data/productCatalogSkateparks";
// import { useMemo } from "react";

// export default function GalleryPage() {
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const allImages = useMemo(() => {
//     // const normalize = (catalog) =>
//     //   catalog.flatMap((p) =>
//     //     (p.sample || p.sampleImages || []).map((src, i) => ({
//     //       src,
//     //       caption: p.sampleCaptions?.[i] || p.name || "",
//     //     }))
//     const normalize = (catalog) =>
//   catalog.flatMap((p) =>
//     (p.sample || p.sampleImages || []).map((item, i) => {
//       // item может быть строкой или объектом { src, type, caption }
//       if (typeof item === "string") {
//         return {
//           src: item,
//           caption: p.sampleCaptions?.[i] || p.name || "",
//         };
//       }
//       // объект — сохраняем всё, caption из объекта приоритетнее
//       return {
//         ...item,
//         caption: item.caption || p.sampleCaptions?.[i] || p.name || "",
//       };
//     })
//   );
//     //   );
//     return [
//       ...normalize(productCatalogSets),
//       ...normalize(productCatalogRamps),
//       ...normalize(productCatalogSkateparks),
//     ];
//   }, []);

//   return (
//     <FullscreenGallery
//       images={allImages}
//       startIndex={state?.startIndex ?? 0}
//       isOpen={true}
//       onClose={() => navigate(-1)}
//     />
//   );
// }

// import { useParams } from "react-router-dom";
// import FilmGallery from "../FilmGallery";

// import productCatalogSets from "../data/productCatalogSets";
// import productCatalogRamps from "../data/productCatalogRamps";
// import productCatalogSkateparks from "../data/productCatalogSkateparks";

// export default function GalleryPage() {
//   const { type, id } = useParams();

//   const catalogs = {
//     sets: productCatalogSets,
//     ramps: productCatalogRamps,
//     skateparks: productCatalogSkateparks,
//   };

//   const product = catalogs[type]?.find(p => p.id === Number(id));

//   if (!product) return <p>Продукт не найден</p>;

//   return (
//     <FilmGallery slides={product.sample} />
//   );
// }


// import { useParams } from "react-router-dom";
// import FilmGallery from "../FilmGallery";

// import productCatalogSets from "../data/productCatalogSets";
// import productCatalogRamps from "../data/productCatalogRamps";
// import productCatalogSkateparks from "../data/productCatalogSkateparks";

// export default function GalleryPage() {
//   const { type, id } = useParams();

//   // Определяем нужный каталог
//   const catalogs = {
//     sets: productCatalogSets,
//     ramps: productCatalogRamps,
//     skateparks: productCatalogSkateparks,
//   };

//   // Ищем продукт по ID
//   const product = catalogs[type]?.find(p => p.id === Number(id));

//   if (!product) return <p>Продукт не найден</p>;

//   // Передаём sample продукта как slides в FilmGallery
//   return <FilmGallery slides={product.sample} />;
// }

// GalleryPage.jsx
// Маршруты:
//   /gallery/:type/:id  →  FilmGallery (конкретный продукт, startIndex из state)
//   /gallery/all        →  AllGalleryPage (общая галерея-сетка всех фото)

// GalleryPage.jsx
// Маршрут: /gallery/:type/:id
// Открывается из карточки продукта, показывает только слайды продуктов.

import { useMemo }          from "react";
import { useLocation }      from "react-router-dom";
import FilmGallery          from "../FilmGallery";
 
import productCatalogSets       from "../data/productCatalogSets";
import productCatalogRamps      from "../data/productCatalogRamps";
import productCatalogSkateparks from "../data/productCatalogSkateparks";
 
// ─── Всі слайди продуктів (для FilmGallery з картки) ────────────────────
// Порядок: sets → ramps → skateparks.
// Це той самий порядок, що використовує useOpenGallery для розрахунку startIndex.
export const productSlides = [
  ...productCatalogSets.flatMap((p) =>
    (p.sample || []).map((s) => ({ ...s, cat: s.type === "video" ? "video" : "sets" }))
  ),
  ...productCatalogRamps.flatMap((p) =>
    (p.sample || []).map((s) => ({ ...s, cat: s.type === "video" ? "video" : "ramps" }))
  ),
  ...productCatalogSkateparks.flatMap((p) =>
    (p.sample || []).map((s) => ({ ...s, cat: s.type === "video" ? "video" : "skateparks" }))
  ),
];
 
export default function GalleryPage() {
  const location   = useLocation();
  const startIndex = location.state?.startIndex ?? 0;
 
  const safeIndex = useMemo(
    () =>
      Number.isFinite(startIndex) && startIndex >= 0 && startIndex < productSlides.length
        ? startIndex
        : 0,
    [startIndex]
  );
 
  return <FilmGallery slides={productSlides} startIndex={safeIndex} />;
}
// import { useParams, useLocation } from "react-router-dom";
// import { useState } from "react";
// import FilmGallery from "../FilmGallery";

// import productCatalogSets from "../data/productCatalogSets";
// import productCatalogRamps from "../data/productCatalogRamps";
// import productCatalogSkateparks from "../data/productCatalogSkateparks";


// // ВСЕ слайды из всех каталогов
// // const allSlides = [
// //   ...productCatalogSets,
// //   ...productCatalogRamps,
// //   ...productCatalogSkateparks,
// // ].flatMap((p) => p.sample || []);

// // const allSlides = [
// //   ...productCatalogSets.flatMap((p) =>
// //     (p.sample || []).map((s) => ({ ...s, cat: "sets" }))
// //   ),
// //   ...productCatalogRamps.flatMap((p) =>
// //     (p.sample || []).map((s) => ({ ...s, cat: "ramps" }))
// //   ),
// //   ...productCatalogSkateparks.flatMap((p) =>
// //     (p.sample || []).map((s) => ({ ...s, cat: "skateparks" }))
// //   ),
// // ];

// // GalleryPage.jsx
// const allSlides = [
//   ...productCatalogSets.flatMap((p) =>
//     (p.sample || []).map((s) => ({
//       ...s,
//       // видео получают cat: "video", фото — cat: "sets"
//       cat: s.type === "video" ? "video" : "sets",
//     }))
//   ),
//   ...productCatalogRamps.flatMap((p) =>
//     (p.sample || []).map((s) => ({
//       ...s,
//       cat: s.type === "video" ? "video" : "ramps",
//     }))
//   ),
//   ...productCatalogSkateparks.flatMap((p) =>
//     (p.sample || []).map((s) => ({
//       ...s,
//       cat: s.type === "video" ? "video" : "skateparks",
//     }))
//   ),
// ];

// export default function GalleryPage() {
//   const { type, id } = useParams();
//   const location = useLocation();

//   const startIndex = location.state?.startIndex ?? 0;

//   return <FilmGallery slides={allSlides} startIndex={startIndex} />;
// }