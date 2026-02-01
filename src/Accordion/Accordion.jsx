

// import { useState, useEffect } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const Accordion = ({ 
//   items, 
//   defaultOpenIndexDesktop = 0, 
//   forceCloseTrigger,
//   controlled = false,
//   openIndex: externalOpenIndex,
//   onToggle,
//   mobileMode = false // новый проп для определения режима
// }) => {
//   const [internalOpenIndex, setInternalOpenIndex] = useState(() =>
//     window.innerWidth >= 1024 ? defaultOpenIndexDesktop : null
//   );
  
//   const openIndex = controlled ? externalOpenIndex : internalOpenIndex;
//   const setOpenIndex = controlled ? onToggle : setInternalOpenIndex;
  
//   const [pendingIndex, setPendingIndex] = useState(null);
//   const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

//   useEffect(() => {
//     const handleResize = () => {
//       const desktop = window.innerWidth >= 1024;
//       setIsDesktop(desktop);

//       if (!controlled) {
//         if (desktop && openIndex === null) {
//           setOpenIndex(defaultOpenIndexDesktop);
//         } 
//         if (!desktop && openIndex !== null) {
//           setOpenIndex(null);
//         }
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [openIndex, defaultOpenIndexDesktop, controlled]);

//   useEffect(() => {
//     if (!controlled) {
//       setOpenIndex(isDesktop ? defaultOpenIndexDesktop : null);
//       setPendingIndex(null);
//     }
//   }, [forceCloseTrigger, isDesktop, defaultOpenIndexDesktop, controlled]);

//  const toggleAccordion = (index) => {


//   // 🖥 DESKTOP ACCORDION — как сейчас
//   if (openIndex === index) {
//     setOpenIndex(null);
//   } else if (openIndex !== null) {
//     setPendingIndex(index);
//     setOpenIndex(null);

//     setTimeout(() => {
//       setOpenIndex(index);
//       setPendingIndex(null);
//     }, 300);
//   } else {
//     setOpenIndex(index);
//   }
// };

//   // DESKTOP VERSION - Accordion (работает как раньше)
//   if (isDesktop) {
//     return (
//       <div className="w-full">
//         {items.map((item, index) => {
//           const isOpen = openIndex === index;

//           return (
//             <div key={index} className="w-full">
//               <button
//                 className="cursor-pointer relative w-full flex justify-between items-center py-1 text-left text-gray-900 hover:text-gray-300 transition-colors group"
//                 onClick={() => toggleAccordion(index)}
//               >
//                 <span className="font-futura text-[clamp(40px,5vw,50px)] tracking-[clamp(-1px,-0.4vw,-4px)] font-bold text-[#717171]">
//                   {item.title}
//                 </span>
//                 {isOpen ? (
//                   <ChevronUp className="w-5 h-5" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5" />
//                 )}
//               </button>

//               <div
//                 className={`transition-all duration-300 overflow-hidden ${
//                   isOpen ? "min-h-[200px] opacity-100" : "max-h-0 opacity-0"
//                 }`}
//               >
//                 <div className="text-[#717171] text-[clamp(15px,2vw,17px)] tracking-[clamp(-1px,-0.2vw,-1px)] max-h-[5000px] relative">
//                   {item.content}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

//   // MOBILE VERSION
//   // Если mobileMode=false - показываем как обычный аккордеон (для совместимости)
//   if (!mobileMode) {
//     return (
//       <div className="w-full">
//         {items.map((item, index) => {
//           const isOpen = openIndex === index;

//           return (
//             <div key={index} className="w-full mb-2">
//               <button
//                 className="cursor-pointer relative w-full flex justify-between items-center py-3 text-left border-b border-gray-300"
//                 onClick={() => toggleAccordion(index)}
//               >
//                 <span className="font-futura text-lg font-bold text-[#717171]">
//                   {item.title}
//                 </span>
//                 {isOpen ? (
//                   <ChevronUp className="w-5 h-5" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5" />
//                 )}
//               </button>

//               <div
//                 className={`transition-all duration-300 overflow-hidden ${
//                   isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
//                 }`}
//               >
//                 <div className="text-[#717171] text-sm leading-relaxed py-3">
//                   {item.content}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

//   // MOBILE TABS VERSION (только когда mobileMode=true)
//   return (
//     <div className="w-full">
//       {/* Tabs Navigation */}
//       <div className="w-full overflow-x-auto scrollbar-hide mb-4">
//         <div className="flex gap-4 pb-2 border-b border-gray-300 w-max min-w-full">
//           {items.map((item, index) => {
//             const isActive = openIndex === index;

//             return (
//               <button
//                 key={index}
//                 onClick={() => toggleAccordion(index)}
//                 className={`
//                   whitespace-nowrap px-3 py-2 font-futura font-bold text-lg
//                   transition-all duration-200 border-b-2
//                   ${isActive 
//                     ? 'text-gray-900 border-gray-900' 
//                     : 'text-gray-400 border-transparent'
//                   }
//                 `}
//               >
//                 {item.title}
//               </button>
//             );
//           })}
//         </div>
//       </div>
  
//       {/* Tab Content */}
//       <div className="w-full">
//         {items.map((item, index) => {
//           const isOpen = openIndex === index;

//           return (
//  <div className={`${isOpen ? "block" : "hidden"} w-full`}>
//   <div className="w-full text-[#717171] text-sm leading-relaxed py-3">
//     {item.content}
//   </div>
// </div>

//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Accordion;


// import { useState, useEffect } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const Accordion = ({
//   items,
//   defaultOpenIndexDesktop = 0,
//   forceCloseTrigger,
//   controlled = false,
//   openIndex: externalOpenIndex,
//   onToggle,
//   mobileMode = false,
// }) => {
//   const [internalOpenIndex, setInternalOpenIndex] = useState(() =>
//     window.innerWidth >= 1024 ? defaultOpenIndexDesktop : null
//   );

//   const openIndex = controlled ? externalOpenIndex : internalOpenIndex;
//   const setOpenIndex = controlled ? onToggle : setInternalOpenIndex;

//   const [pendingIndex, setPendingIndex] = useState(null);
//   const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

//   /* -------------------- RESIZE -------------------- */
//   useEffect(() => {
//     const handleResize = () => {
//       const desktop = window.innerWidth >= 1024;
//       setIsDesktop(desktop);

//       if (!controlled) {
//         if (desktop && openIndex === null) {
//           setOpenIndex(defaultOpenIndexDesktop);
//         }
//         if (!desktop && openIndex !== null) {
//           setOpenIndex(null);
//         }
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [openIndex, defaultOpenIndexDesktop, controlled, setOpenIndex]);

//   /* -------------------- FORCE CLOSE -------------------- */
//   useEffect(() => {
//     if (!controlled) {
//       setOpenIndex(isDesktop ? defaultOpenIndexDesktop : null);
//       setPendingIndex(null);
//     }
//   }, [forceCloseTrigger, isDesktop, defaultOpenIndexDesktop, controlled, setOpenIndex]);

//   /* -------------------- TOGGLE -------------------- */
//   const toggleAccordion = (index) => {
//     // DESKTOP LOGIC (unchanged)
//     if (isDesktop) {
//       if (openIndex === index) {
//         setOpenIndex(null);
//       } else if (openIndex !== null) {
//         setPendingIndex(index);
//         setOpenIndex(null);

//         setTimeout(() => {
//           setOpenIndex(index);
//           setPendingIndex(null);
//         }, 300);
//       } else {
//         setOpenIndex(index);
//       }
//       return;
//     }

//     // MOBILE LOGIC
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   /* =====================================================
//      =================== DESKTOP =========================
//      ===================================================== */
//   if (isDesktop) {
//     return (
//       <div className="w-full">
//         {items.map((item, index) => {
//           const isOpen = openIndex === index;

//           return (
//             <div key={index} className="w-full">
//               <button
//                 className="cursor-pointer relative w-full flex justify-between items-center py-1 text-left text-gray-900 hover:text-gray-300 transition-colors"
//                 onClick={() => toggleAccordion(index)}
//               >
//                 <span className="font-futura text-[clamp(40px,5vw,50px)] tracking-[clamp(-1px,-0.4vw,-4px)] font-bold text-[#717171]">
//                   {item.title}
//                 </span>

//                 {isOpen ? (
//                   <ChevronUp className="w-5 h-5" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5" />
//                 )}
//               </button>

//               <div
//                 className={`transition-all duration-300 overflow-hidden ${
//                   isOpen ? "min-h-[200px] opacity-100" : "max-h-0 opacity-0"
//                 }`}
//               >
//                 <div className="text-[#717171] text-[clamp(15px,2vw,17px)] tracking-[clamp(-1px,-0.2vw,-1px)] max-h-[5000px] relative">
//                   {item.content}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

//   /* =====================================================
//      ============== MOBILE ACCORDION =====================
//      ===================================================== */
//   if (!mobileMode) {
//     return (
//       <div className="w-full">
//         {items.map((item, index) => {
//           const isOpen = openIndex === index;

//           return (
//             <div key={index} className="w-full mb-2">
//               <button
//                 className="cursor-pointer relative w-full flex justify-between items-center py-3 text-left border-b border-gray-300"
//                 onClick={() => toggleAccordion(index)}
//               >
//                 <span className="font-futura text-lg font-bold text-[#717171]">
//                   {item.title}
//                 </span>

//                 {isOpen ? (
//                   <ChevronUp className="w-5 h-5" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5" />
//                 )}
//               </button>

//               <div
//                 className={`transition-all duration-300 overflow-hidden ${
//                   isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
//                 }`}
//               >
//                 <div className="text-[#717171] text-sm leading-relaxed py-3">
//                   {item.content}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

//   /* =====================================================
//      ================= MOBILE TABS =======================
//      ===================================================== */
//   return (
//     <div className="w-full">
//       {/* ---------- Tabs Navigation ---------- */}
//       <div className="w-full overflow-x-auto scrollbar-hide mb-4">
//         <div className="relative flex gap-4 pb-2 w-max min-w-full border-b border-gray-300">
//           {items.map((item, index) => {
//             const isActive = openIndex === index;

//             return (
//               <button
//                 key={index}
//                 onClick={() => toggleAccordion(index)}
//                 className={`relative px-3 py-2 font-futura font-bold text-lg transition-colors duration-200 ${
//                   isActive ? "text-gray-900" : "text-gray-400"
//                 }`}
//               >
//                 {item.title}

//                 {isActive && (
//                   <span
//                     className="
//                       absolute left-0 -bottom-[9px] w-full h-[2px]
//                       bg-gray-900
//                       animate-tab-underline
//                     "
//                   />
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* ---------- Tab Content (animated) ---------- */}
//       <div className="relative w-full min-h-[120px] overflow-hidden">
//         {items.map((item, index) => {
//           const isOpen = openIndex === index;

//           return (
//             <div
//               key={index}
//               className={`
//                 absolute inset-0
//                 transition-all duration-300 ease-out
//                 ${
//                   isOpen
//                     ? "opacity-100 translate-y-0 pointer-events-auto"
//                     : "opacity-0 translate-y-4 pointer-events-none"
//                 }
//               `}
//             >
//               <div className="w-full text-[#717171] text-sm leading-relaxed py-3">
//                 {item.content}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Accordion;

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Accordion = ({
  items,
  defaultOpenIndexDesktop = 0,
  forceCloseTrigger,
  controlled = false,
  openIndex: externalOpenIndex,
  onToggle,
  mobileMode = false,
}) => {
  const [internalOpenIndex, setInternalOpenIndex] = useState(() =>
    window.innerWidth >= 1024 ? defaultOpenIndexDesktop : null
  );

  const openIndex = controlled ? externalOpenIndex : internalOpenIndex;
  const setOpenIndex = controlled ? onToggle : setInternalOpenIndex;

  const [pendingIndex, setPendingIndex] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

  // 👉 направление анимации
  const [direction, setDirection] = useState(1);

  /* -------------------- RESIZE -------------------- */
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
  }, [openIndex, defaultOpenIndexDesktop, controlled, setOpenIndex]);

  /* -------------------- FORCE CLOSE -------------------- */
  useEffect(() => {
    if (!controlled) {
      setOpenIndex(isDesktop ? defaultOpenIndexDesktop : null);
      setPendingIndex(null);
    }
  }, [forceCloseTrigger, isDesktop, defaultOpenIndexDesktop, controlled, setOpenIndex]);

  /* -------------------- TOGGLE -------------------- */
  const toggleAccordion = (index) => {
    if (!isDesktop && openIndex !== null) {
      setDirection(index > openIndex ? 1 : -1);
    }

    // DESKTOP (как было)
    if (isDesktop) {
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
      return;
    }

    // MOBILE
    setOpenIndex(openIndex === index ? null : index);
  };

  /* =====================================================
     =================== DESKTOP =========================
     ===================================================== */
  if (isDesktop) {
    return (
      <div className="w-full">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index} className="w-full">
              <button
                className="w-full flex justify-between items-center py-1 text-left transition-colors"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-futura text-[clamp(40px,5vw,50px)] font-bold text-[#717171]">
                  {item.title}
                </span>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "min-h-[200px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="text-[#717171] text-[clamp(15px,2vw,17px)]">
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // /* =====================================================
  //    ============== MOBILE ACCORDION =====================
  //    ===================================================== */
  // if (!mobileMode) {
  //   return (
  //     <div className="w-full">
  //       {items.map((item, index) => {
  //         const isOpen = openIndex === index;

  //         return (
  //           <div key={index} className="mb-2">
  //             <button
  //               className="w-full flex justify-between items-center py-3 border-b"
  //               onClick={() => toggleAccordion(index)}
  //             >
  //               <span className="font-futura font-bold text-[#717171]">
  //                 {item.title}
  //               </span>
  //               {isOpen ? <ChevronUp /> : <ChevronDown />}
  //             </button>

  //             <div
  //               className={`transition-all duration-300 overflow-hidden ${
  //                 isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
  //               }`}
  //             >
  //               <div className="text-sm text-[#717171] py-3">
  //                 {item.content}
  //               </div>
  //             </div>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // }

  /* =====================================================
     ================= MOBILE TABS =======================
     ===================================================== */
  return (
    <div className="w-full">
      {/* ---------- Active Product Title ---------- */}
      <div className="relative mb-3 overflow-hidden ">
        {items.map((item, index) => {
          const isActive = openIndex === index;

          return (
            <span
              key={index}
              className={`
                absolute left-0 top-0
                font-futura font-bold text-lg
                transition-all duration-300 ease-out
                ${
                  isActive
                    ? "opacity-100 translate-x-0"
                    : direction === 1
                      ? "-translate-x-6 opacity-0"
                      : "translate-x-6 opacity-0"
                }
              `}
            >
              {item.title}
            </span>
          );
        })}
      </div>

      {/* ---------- Tabs Navigation ---------- */}
      <div className="overflow-x-auto scrollbar-hide mb-4">
        <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-4 gap-3 pb-2 border-b">
          {items.map((item, index) => {
            const isActive = openIndex === index;

            return (
              <button
                key={index}
                onClick={() => toggleAccordion(index)}
                className={`relative  text-[clamp(24px,3vw,26px)] whitespace-nowrap font-futura font-bold text-lg transition-colors ${
                  isActive ? "text-green-700" : "text-gray-400"
                }`}
                
              >
                {item.title}
                {isActive && (
                  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-gray-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- Tab Content ---------- */}
      <div className="relative min-h-[120px] overflow-hidden">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`
                absolute inset-0
                transition-all duration-300 ease-out
                ${
                  isOpen
                    ? "opacity-100 translate-x-0"
                    : direction === 1
                      ? "-translate-x-8 opacity-0"
                      : "translate-x-8 opacity-0"
                }
              `}
            >
              <div className="text-sm text-[#717171] ">
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

