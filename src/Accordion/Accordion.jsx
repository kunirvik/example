
// import React, { useState, useEffect } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const Accordion = ({ items, defaultOpenIndexDesktop = 0, forceCloseTrigger }) => {
//   const [openIndex, setOpenIndex] = useState(() =>
//     window.innerWidth >= 1024 ? defaultOpenIndexDesktop : null
//   );
//   const [pendingIndex, setPendingIndex] = useState(null);
//   const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

//   useEffect(() => {
//     const handleResize = () => {
//       const desktop = window.innerWidth >= 1024;
//       setIsDesktop(desktop);

//       // Автоматически открываем первый элемент на десктопе, если ничего не открыто
//       if (desktop && openIndex === null) {
//         setOpenIndex(defaultOpenIndexDesktop);
//       } 
//       // На мобильных закрываем все
//       if (!desktop && openIndex !== null) {
//         setOpenIndex(null);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [openIndex, defaultOpenIndexDesktop]);

//   useEffect(() => {
//     setOpenIndex(isDesktop ? defaultOpenIndexDesktop : null);
//     setPendingIndex(null);
//   }, [forceCloseTrigger, isDesktop, defaultOpenIndexDesktop]);

//   const toggleAccordion = (index) => {
//     if (openIndex === index) {
//       setOpenIndex(null);
//     } else if (openIndex !== null) {
//       setPendingIndex(index);
//       setOpenIndex(null);

//       setTimeout(() => {
//         setOpenIndex(index);
//         setPendingIndex(null);
//       }, 300);
//     } else {
//       setOpenIndex(index);
//     }
//   };

//   return (
//     <div className="w-full">
//       {items.map((item, index) => {
//         const isOpen = openIndex === index;

//         return (
//           <div key={index} className="w-full">
            
//             <button
//               className="cursor-pointer relative w-full flex justify-between items-center py-1 text-left text-gray-900 hover:text-gray-300 transition-colors group"
//               onClick={() => toggleAccordion(index)}
//             >
//               <span className="font-futura text-[clamp(28px,5vw,50px)] tracking-[clamp(-1px,-0.4vw,-4px)] font-bold text-[#717171]">
//                 {item.title}
//               </span>
//               {isOpen ? (
//                 <ChevronUp className="w-5 h-5" />
//               ) : (
//                 <ChevronDown className="w-5 h-5" />
//               )}
//               <span
//                 className={`absolute left-0 w-full h-[1px] bg-gray-500 transition-transform duration-300`}
//                 style={{
//                   bottom: isOpen ? "-8px" : "0px",
//                   transform: isOpen ? "translateY(100%)" : "translateY(0)",
//                   opacity: isOpen ? 0 : 1,
//                 }}
//               />
//             </button>

//             <div
//               className={`transition-all duration-300 overflow-hidden ${
//                 isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//               }`}
//             >
//               <div className="text-[#717171] text-[clamp(10px,2vw,17px)] tracking-[clamp(-1px,-0.2vw,-1px)]  relative">
//                 {item.content}
//               </div>
              


//               {/* {isOpen && <span className="left-0 bottom-0 w-full h-[1px] bg-gray-500" />} */}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };
// export default Accordion;

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Accordion = ({ 
  items, 
  defaultOpenIndexDesktop = 0, 
  forceCloseTrigger,
  controlled = false,
  openIndex: externalOpenIndex,
  onToggle
  
}) => {
  const [internalOpenIndex, setInternalOpenIndex] = useState(() =>
    window.innerWidth >= 1024 ? defaultOpenIndexDesktop : null
  );
  
  // Используем внешнее или внутреннее состояние
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
              <span className="font-futura text-[clamp(28px,5vw,50px)] tracking-[clamp(-1px,-0.4vw,-4px)] font-bold text-[#717171]">
                {item.title}
              </span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
              {/* <span
                className={`absolute left-0 w-full h-[1px] bg-gray-500 transition-transform duration-300`}
                style={{
                  bottom: isOpen ? "-8px" : "0px",
                  transform: isOpen ? "translateY(100%)" : "translateY(0)",
                  opacity: isOpen ? 0 : 1,
                }}
              /> */}
            </button>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="text-[#717171] text-[clamp(10px,2vw,17px)] tracking-[clamp(-1px,-0.2vw,-1px)] max-h-[5000px] relative">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;

