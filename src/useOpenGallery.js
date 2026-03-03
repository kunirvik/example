// src/hooks/useOpenGallery.js
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import productCatalogSets from "./data/productCatalogSets";
import productCatalogRamps from "./data/productCatalogRamps";
import productCatalogSkateparks from "./data/productCatalogSkateparks";

const ALL_CATALOGS = [
  ...productCatalogSets,
  ...productCatalogRamps,
  ...productCatalogSkateparks,
];

export function useOpenGallery() {
  const navigate = useNavigate();

  const openGallery = useCallback(
    (type, activeProductIndex) => {
      const catalogs = {
        sets: productCatalogSets,
        ramps: productCatalogRamps,
        skateparks: productCatalogSkateparks,
      };

      const catalog = catalogs[type];
      const currentProduct = catalog[activeProductIndex];

      // Считаем сколько слайдов идёт ДО нужного продукта
      // по всем каталогам вместе
      const globalIndex = ALL_CATALOGS.findIndex(
        (p) => p.id === currentProduct.id
      );

      const startIndex = ALL_CATALOGS
        .slice(0, globalIndex)
        .reduce((acc, p) => acc + (p.sample?.length || 0), 0);

      navigate(`/gallery/${type}/${currentProduct.id}`, {
        state: { startIndex },
      });
    },
    [navigate]
  );

  return openGallery;
}