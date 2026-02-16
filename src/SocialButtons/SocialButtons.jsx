

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Instagram, Mail, Phone, Plane } from "lucide-react"; // предполагаю, что иконки берутся отсюда
// import ModalRequestSkatepark from "../ModalRequestSkatepark/ModalRequestSkatepark";

// export default function SocialButtons() {
//   const buttons = [
//     { icon: <Instagram size={30} className="text-[#919191]" />, link: "https://instagram.com/parkramps/" },
//     // { icon: <Phone size={15} className="text-[#919191]" />, link: "tel:+3806812553" },
//     {icon:<Plane size={30} className="text-[#919191]" />, link: "https://t.me/parkramps"},
//     { icon: <Mail size={30} className="text-[#919191]" />,  onClick: () => setIsModalOpen(true) }, // ✅ вместо ссылки открываем модалку,
//     // {icon:<img src="ramp.png" className="w-6 h-6"/>, link:"https://instagram.com/parkramps/"},
//   ];
// const [isModalOpen, setIsModalOpen] = useState(false);

//   const text = "сайт собирается. мы строим и продаем скейтпарки. пишите нам в соцсети 01.2026";

//   return (
//     <>
//       {/* --- Desktop: статичный баннер --- */}
//       <div className="hidden sm:flex fixed top-0 left-0 w-full h-6 bg-red-400 items-center justify-center z-40">
//         <span className="text-sm font-futura font-medium">{text}</span>
//       </div>

//       {/* --- Mobile: бесконечная бегущая строка --- */}
//       <div className="sm:hidden fixed   top-0 left-0 w-full h-6 bg-red-400 overflow-hidden z-40">
//         <div className="marquee">
//           <div className="track ">
//             <span className="text-sm font-futura font-medium" >{text} </span>
//             <span className="text-sm font-futura font-medium" >{text} </span>
//             <span className="text-sm font-futura font-medium">{text} </span>
//             <span className="text-sm font-futura font-medium" >{text} </span>
//           </div>
//         </div>
//       </div>

//       {/* --- Хедер --- */}
//       <div className="fixed top-6 left-0 w-full h-12.6 bg-black flex items-center justify-between shadow-md z-50 px-4">
//         <div className="flex items-center space-x-2">
//           <img src="/logo.png" alt="Logo" style={{ maxHeight: "clamp(50px, 3vw, 300px)",}} className="opacity-50 drop-shadow-lg" />
//         </div>

//  {/* <div className="flex items-center gap-2">

//  <button className="font-futura text-[#717171] font-bold text-[55px] tracking-[-2px]" onClick={() => window.open()}>
//  contacts</button></div> */}




//         <div className="flex items-center gap-2">
//           {buttons.map((button, index) => (
//             <motion.a
//               key={index}
//               href={button.link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="backdrop-blur-xl shadow-lg flex items-center justify-center w-9 h-9 rounded transition-all hover:bg-white/30"
//               whileHover={{ scale: 1.08 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={button.onClick ? button.onClick : () => window.open( button.link, "_blank")}
//             >
//               {button.icon}
//             </motion.a>
            
//           ))}
//           </div>
//           {/* <ModalRequestSkatepark isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
        
//       </div>
//     </>
//   );
// }


import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Mail, Plane, MoreVertical } from "lucide-react";

export default function SocialButtons() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleScroll = () => setOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  const buttons = [
    {
      icon: <Instagram size={16} className="text-[#919191]" />,
      link: "https://instagram.com/parkramps/",
      label: "Instagram",
    },
    {
      icon: <Plane size={16} className="text-[#919191]" />,
      link: "https://t.me/parkramps",
      label: "Telegram",
    },
    {
      icon: <Mail size={16} className="text-[#919191]" />,
      onClick: () => alert("Открыть модалку"),
      label: "Email",
    },
    {
      icon: <img src="ramp.png" className="w-4 h-4 opacity-60" />,
      link: "https://instagram.com/parkramps/",
      label: "Ramp",
    },
   
  ];

  return (
    <>
      {/* ───────────── DESKTOP (md и выше) ───────────── */}
      <div className="hidden md:flex fixed top-0 left-0 w-full h-12 bg-black items-center justify-between px-4 z-50">
        <img src="/logo.png" alt="Logo" className="opacity-50 max-h-8" />

        <div ref={menuRef} className="flex items-center gap-2 relative">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex gap-2 overflow-hidden"
              >
                {buttons.map((btn, i) => (
                  <motion.button
                    key={i}
                    onClick={btn.onClick || (() => window.open(btn.link, "_blank"))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded backdrop-blur-xl bg-white/10
                               flex items-center justify-center hover:bg-white/20"
                  >
                    {btn.icon}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center rounded
                       hover:bg-white/10 transition"
          >
            <MoreVertical size={18} className="text-[#919191]" />
          </button>
        </div>
      </div>

      {/* ───────────── MOBILE (меньше md) ───────────── */}
      <div className="md:hidden">
        {/* Шапка только с лого */}
        <div className="fixed top-0 left-0 w-full h-12 bg-black flex items-center px-4 z-50000">
          <img src="/logo.png" alt="Logo" className="opacity-50 max-h-8" />
        </div>

        {/* FAB-кнопка + вертикальное меню снизу */}
        <div
          ref={mobileMenuRef}
          className="fixed bottom-6 right-4 z-50 flex flex-col items-center gap-2"
        >
          {/* Кнопки — выезжают снизу вверх */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                className="flex flex-col-reverse gap-2"
              >
                {buttons.map((btn, i) => (
                  <motion.button
                    key={i}
                    custom={i}
                    variants={{
                      closed: { opacity: 0, y: 10, scale: 0.8 },
                      open: (idx) => ({
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          delay: idx * 0.04,
                          duration: 0.2,
                          ease: "easeOut",
                        },
                      }),
                    }}
                    onClick={btn.onClick || (() => { window.open(btn.link, "_blank"); setOpen(false); })}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.93 }}
                    className="w-10 h-10 rounded-xl backdrop-blur-xl bg-black/70 border border-white/10
                               flex items-center justify-center shadow-lg hover:bg-white/20"
                    title={btn.label}
                  >
                    {btn.icon}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Главная кнопка ⋮ */}
          <motion.button
            onClick={() => setOpen(!open)}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-11 h-11 rounded-full bg-black/80 border border-white/15
                       flex items-center justify-center shadow-xl"
          >
            <MoreVertical size={18} className="text-[#919191]" />
          </motion.button>
        </div>
      </div>
    </>
  );
}