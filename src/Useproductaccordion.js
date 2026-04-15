import { useState, useCallback } from "react";

/**
 * useProductAccordion - управление раскрытием аккордеонов
 * 
 * Отвечает за:
 * - Состояние каких аккордеонов открыты
 * - Логику переключения при клике
 * - Разные поведения для мобильной и десктопной версий
 */
export function useProductAccordion() {
  const [accordionState, setAccordionState] = useState({
    purchase: null,
    product: 0,
    virobi: null,
  });

  /**
   * Переключает аккордеон определенного типа
   * @param {string} type - 'purchase' | 'product' | 'virobi'
   * @returns {function} обработчик клика на аккордеон
   */
  const handleAccordionToggle = useCallback((type) => (index) => {
    setAccordionState((prev) => {
      switch (type) {
        case "purchase":
          return {
            virobi: prev.virobi,
            purchase: prev.purchase === index ? null : index,
            product: null, // закрыть product при открытии purchase
          };

        case "product":
          return {
            virobi: prev.virobi,
            purchase: null, // закрыть purchase при открытии product
            product: prev.product === index ? null : index,
          };

        case "virobi":
          return {
            ...prev,
            virobi: prev.virobi === index ? null : index,
          };

        default:
          return prev;
      }
    });
  }, []);

  return {
    accordionState,
    setAccordionState,
    handleAccordionToggle,
  };
}