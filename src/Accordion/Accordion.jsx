

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Accordion = ({ 
  items, 
  defaultOpenIndexDesktop = 0, 
  forceCloseTrigger,
  controlled = false,
  openIndex: externalOpenIndex,
  onToggle,
  mobileMode = false // новый проп для определения режима
}) => {
  const [internalOpenIndex, setInternalOpenIndex] = useState(() =>
    window.innerWidth >= 1024 ? defaultOpenIndexDesktop : null
  );
  
  const openIndex = controlled ? externalOpenIndex : internalOpenIndex;
  const setOpenIndex = controlled ? onToggle : setInternalOpenIndex;
  
  const [pendingIndex, setPendingIndex] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      if (!controlled) {
        if (desktop && openIndex === null) {
          setOpenIndex(defaultOpenIndexDesktop);
        } 
        if (!desktop && openIndex !== null) {
          setOpenIndex(null);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [openIndex, defaultOpenIndexDesktop, controlled]);

  useEffect(() => {
    if (!controlled) {
      setOpenIndex(isDesktop ? defaultOpenIndexDesktop : null);
      setPendingIndex(null);
    }
  }, [forceCloseTrigger, isDesktop, defaultOpenIndexDesktop, controlled]);

 const toggleAccordion = (index) => {
  // ✅ MOBILE TABS — мгновенно
  if (!isDesktop && mobileMode) {
    if (openIndex === index) return;

    setPendingIndex(index);
    setOpenIndex(null);

    setTimeout(() => {
      setOpenIndex(index);
      setPendingIndex(null);
    }, 250);

    return;
  }

  // 🖥 DESKTOP ACCORDION — как сейчас
  if (openIndex === index) {
    setOpenIndex(null);
  } else if (openIndex !== null) {
    setPendingIndex(index);
    setOpenIndex(null);

    setTimeout(() => {
      setOpenIndex(index);
      setPendingIndex(null);
    }, 300);
  } else {
    setOpenIndex(index);
  }
};

  // DESKTOP VERSION - Accordion (работает как раньше)
  if (isDesktop) {
    return (
      <div className="w-full">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index} className="w-full">
              <button
                className="cursor-pointer relative w-full flex justify-between items-center py-1 text-left text-gray-900 hover:text-gray-300 transition-colors group"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-futura text-[clamp(40px,5vw,50px)] tracking-[clamp(-1px,-0.4vw,-4px)] font-bold text-[#717171]">
                  {item.title}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "min-h-[200px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="text-[#717171] text-[clamp(15px,2vw,17px)] tracking-[clamp(-1px,-0.2vw,-1px)] max-h-[5000px] relative">
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // MOBILE VERSION
  // Если mobileMode=false - показываем как обычный аккордеон (для совместимости)
  if (!mobileMode) {
    return (
      <div className="w-full">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index} className="w-full mb-2">
              <button
                className="cursor-pointer relative w-full flex justify-between items-center py-3 text-left border-b border-gray-300"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-futura text-lg font-bold text-[#717171]">
                  {item.title}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="text-[#717171] text-sm leading-relaxed py-3">
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // MOBILE TABS VERSION (только когда mobileMode=true)
  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div className="w-full overflow-x-auto scrollbar-hide mb-4">
        <div className="flex gap-4 pb-2 border-b border-gray-300 w-max min-w-full">
          {items.map((item, index) => {
            const isActive = openIndex === index;

            return (
              <button
                key={index}
                onClick={() => toggleAccordion(index)}
                className={`
                  whitespace-nowrap px-3 py-2 font-futura font-bold text-lg
                  transition-all duration-200 border-b-2
                  ${isActive 
                    ? 'text-gray-900 border-gray-900' 
                    : 'text-gray-400 border-transparent'
                  }
                `}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </div>
  
      {/* Tab Content */}
      <div className="w-full">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
 <div className={`${isOpen ? "block" : "hidden"} w-full`}>
  <div className="w-full text-[#717171] text-sm leading-relaxed py-3">
    {item.content}
  </div>
</div>

          );
        })}
      </div>
    </div>
  );
};

export default Accordion;

