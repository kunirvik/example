import React from "react";
import Accordion from "./Accordion/Accordion";
import ContactButton from "./ContactButtons/ContactButton";

/**
 * ProductInfo - компонент для отображения информации о продукте
 * 
 * Props:
 * - product: объект продукта { name, description, description2, ... }
 * - isMobile: boolean для выбора мобильной или десктопной версии
 * - accordionState: { purchase: null|index, product: null|index, virobi: null|index }
 * - onAccordionToggle: (type) => (index) => void
 * - refs: объект с refs на элементы { info, purchaseAccordion, productionAccordion }
 * - animationState: { complete, slideChanging }
 */
export default function ProductInfo({
  product,
  isMobile,
  accordionState,
  onAccordionToggle,
  refs,
  animationState,
  onGalleryOpen,
}) {
  if (isMobile) {
    return (
      <div className="block lg:hidden w-full">
        <Accordion
          items={[
            {
              title: "замовити",
              content: (
                <>
                  {product.description}
                  <ContactButton />
                </>
              ),
            },
            {
              title: product.name,
              content: product.description2,
            },
            {
              title: "вироби",
              content: null,
            },
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
            if (index === 0) onAccordionToggle("purchase")(0);
            else if (index === 1) onAccordionToggle("product")(0);
            else if (index === 2) onAccordionToggle("virobi")(0);
          }}
        />
      </div>
    );
  }

  // DESKTOP VERSION
  return (
    <div className="hidden lg:block border-2 border-indigo-200 w-full">
      {/* Product Name/Description */}
      <div
        ref={(el) => (refs.info = el)}
        className="w-full border-2 border-indigo-200 flex flex-col"
        style={{
          opacity:
            animationState.slideChanging || (!animationState.complete && product.image)
              ? 0
              : 1,
          transform:
            animationState.slideChanging || (!animationState.complete && product.image)
              ? "translateY(20px)"
              : "translateY(0)",
          pointerEvents: animationState.slideChanging ? "none" : "auto",
          transition: "opacity 0.3s ease",
        }}
      >
        <Accordion
          items={[
            {
              title: product.name,
              content: product.description2,
            },
          ]}
          controlled={true}
          openIndex={accordionState.product}
          onToggle={onAccordionToggle("product")}
        />
      </div>

      {/* Purchase Section */}
      <div
        className="w-full"
        ref={(el) => (refs.purchaseAccordion = el)}
        style={{ opacity: 1, transition: "opacity 0.3s ease" }}
      >
        <Accordion
          items={[
            {
              title: "замовити",
              content: (
                <>
                  {product.description}
                  <ContactButton />
                </>
              ),
            },
          ]}
          controlled={true}
          openIndex={accordionState.purchase}
          onToggle={onAccordionToggle("purchase")}
        />
      </div>

      {/* Gallery/Works Section */}
      <div
        className="w-full"
        ref={(el) => (refs.productionAccordion = el)}
        style={{ opacity: 1, transition: "opacity 0.3s ease" }}
      >
        <Accordion
          items={[{ title: "вироби" }]}
          controlled={true}
          openIndex={accordionState.virobi}
          onToggle={onAccordionToggle("virobi")}
        />
      </div>
    </div>
  );
}