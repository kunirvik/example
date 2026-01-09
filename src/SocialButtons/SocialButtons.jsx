

import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Mail, Phone, Plane } from "lucide-react"; // предполагаю, что иконки берутся отсюда
import ModalRequestSkatepark from "../ModalRequestSkatepark/ModalRequestSkatepark";

export default function SocialButtons() {
  const buttons = [
    { icon: <Instagram size={30} className="text-[#919191]" />, link: "https://instagram.com/parkramps/" },
    // { icon: <Phone size={15} className="text-[#919191]" />, link: "tel:+3806812553" },
    {icon:<Plane size={30} className="text-[#919191]" />, link: "https://t.me/parkramps"},
    { icon: <Mail size={30} className="text-[#919191]" />,  onClick: () => setIsModalOpen(true) }, // ✅ вместо ссылки открываем модалку,
    
  ];
const [isModalOpen, setIsModalOpen] = useState(false);

  const text = "сайт собирается. мы строим и продаем скейтпарки. пишите нам в соцсети 12.2025";

  return (
    <>
      {/* --- Desktop: статичный баннер --- */}
      <div className="hidden sm:flex fixed top-0 left-0 w-full h-6 bg-red-400 items-center justify-center z-40">
        <span className="text-sm font-futura font-medium">{text}</span>
      </div>

      {/* --- Mobile: бесконечная бегущая строка --- */}
      <div className="sm:hidden fixed   top-0 left-0 w-full h-6 bg-red-400 overflow-hidden z-40">
        <div className="marquee">
          <div className="track ">
            <span className="text-sm font-futura font-medium" >{text} </span>
            <span className="text-sm font-futura font-medium" >{text} </span>
            <span className="text-sm font-futura font-medium">{text} </span>
            <span className="text-sm font-futura font-medium" >{text} </span>
          </div>
        </div>
      </div>

      {/* --- Хедер --- */}
      <div className="fixed top-6 left-0 w-full h-12.6 bg-black flex items-center justify-between shadow-md z-50 px-4">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" style={{ maxHeight: "clamp(50px, 3vw, 300px)",}} className="opacity-50 drop-shadow-lg" />
        </div>

 {/* <div className="flex items-center gap-2">

 <button className="font-futura text-[#717171] font-bold text-[55px] tracking-[-2px]" onClick={() => window.open()}>
 contacts</button></div> */}




        <div className="flex items-center gap-2">
          {buttons.map((button, index) => (
            <motion.a
              key={index}
              href={button.link}
              target="_blank"
              rel="noopener noreferrer"
              className="backdrop-blur-xl shadow-lg flex items-center justify-center w-9 h-9 rounded transition-all hover:bg-white/30"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={button.onClick ? button.onClick : () => window.open( button.link, "_blank")}
            >
              {button.icon}
            </motion.a>
            
          ))}
          </div>
          {/* <ModalRequestSkatepark isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
        
      </div>
    </>
  );
}
