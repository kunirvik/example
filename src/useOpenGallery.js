// src/hooks/useOpenGallery.js
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import productCatalogSets       from "./data/productCatalogSets";
import productCatalogRamps      from "./data/productCatalogRamps";
import productCatalogSkateparks from "./data/productCatalogSkateparks";


const CATALOG_ORDER = [
  { key: "sets",       catalog: productCatalogSets       },
  { key: "ramps",      catalog: productCatalogRamps      },
  { key: "skateparks", catalog: productCatalogSkateparks },
];

export function useOpenGallery() {
  const navigate = useNavigate();

  const openGallery = useCallback(
    (type, activeProductIndex) => {
      let startIndex = 0;

      for (const { key, catalog } of CATALOG_ORDER) {
        if (key === type) {
          // Додаємо слайди продуктів ДО поточного — в межах тієї ж категорії
          for (let i = 0; i < activeProductIndex; i++) {
            startIndex += catalog[i]?.sample?.length || 0;
          }
          break;
        }
        // Поточна категорія ще не досягнута — рахуємо всі її слайди
        for (const product of catalog) {
          startIndex += product.sample?.length || 0;
        }
      }

      navigate("/gallery", { state: { startIndex } });
    },
    [navigate]
  );

  return openGallery;
}