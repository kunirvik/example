

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
import { Instagram, Mail, Plane, MoreVertical, X } from "lucide-react";

export default function SocialButtons( ) {
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
      icon: <Plane size={20} className="text-[#919191]" />,
      link: "https://t.me/parkramps",
      label: "Telegram",
    },
    {
      icon: <Mail size={20} className="text-[#919191]" />,
      onClick: () => alert("Открыть модалку"),
      label: "Email",
    },
    {
      icon: <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 320"><path fill="#919191" opacity="1.000000" stroke="none" 
	d="
M195.999878,244.361389 
	C151.500092,244.358597 107.500305,244.361298 63.500526,244.347870 
	C54.869244,244.345230 52.667416,242.110764 52.665524,233.341476 
	C52.654480,182.175064 52.674820,131.008636 52.628918,79.842262 
	C52.625095,75.582932 53.136574,71.653679 57.694897,70.001343 
	C63.099987,68.042053 67.903816,71.611206 68.157570,77.944580 
	C68.430923,84.767075 68.233727,91.608444 68.240303,98.441582 
	C68.247231,105.644524 68.246429,105.656708 75.220161,105.665237 
	C86.053429,105.678490 96.886871,105.639320 107.719940,105.687973 
	C114.734726,105.719482 116.764214,107.671669 117.380501,114.782768 
	C119.975548,144.726013 137.781342,162.867722 163.804184,174.635574 
	C176.804169,180.514328 190.630356,182.417679 204.691208,182.523132 
	C225.850555,182.681824 247.130142,183.939484 268.139587,181.476425 
	C298.507141,177.916229 322.859894,164.288116 336.216980,135.165726 
	C339.171021,128.725021 340.253052,121.814537 340.640259,114.800720 
	C340.998688,108.308289 343.439850,105.732391 349.878540,105.694229 
	C361.544708,105.625076 373.213593,105.552246 384.877136,105.740257 
	C388.789948,105.803322 390.145294,104.461929 390.122925,100.544975 
	C390.077301,92.557777 389.425568,84.535995 390.554535,76.581116 
	C391.281219,71.460510 394.256317,69.181816 399.138306,69.729813 
	C403.379181,70.205849 405.611176,72.852722 406.246552,76.899239 
	C406.476837,78.365784 406.337585,79.893082 406.337738,81.392654 
	C406.343292,131.892395 406.347748,182.392151 406.345673,232.891891 
	C406.345306,242.365448 404.373718,244.354416 394.997803,244.355072 
	C328.831818,244.359756 262.665863,244.359741 195.999878,244.361389 
M213.517288,197.929581 
	C196.134064,197.959045 178.905579,197.060303 162.446823,190.543884 
	C131.655258,178.352722 110.149765,157.964828 103.693161,124.265961 
	C103.066460,120.995041 100.914955,120.994049 98.520195,120.990334 
	C90.688919,120.978195 82.857559,120.959702 75.026360,120.985031 
	C68.251762,121.006943 68.243187,121.031883 68.242470,128.047379 
	C68.239281,159.205933 68.239395,190.364487 68.243301,221.523041 
	C68.244194,228.663879 68.253304,228.669678 75.301659,228.669769 
	C168.944016,228.671143 262.586365,228.670868 356.228729,228.670807 
	C366.226135,228.670792 376.224854,228.577713 386.220215,228.719879 
	C389.629791,228.768356 390.984985,227.579407 390.977966,224.099884 
	C390.911652,191.275269 390.919830,158.450378 390.990356,125.625763 
	C390.997833,122.151093 389.551270,120.901802 386.195343,120.948891 
	C377.699219,121.068108 369.200165,121.060287 360.703217,120.990532 
	C357.928070,120.967751 356.531342,121.917625 356.000488,124.836029 
	C354.655579,132.230270 352.485229,139.421341 348.864410,146.047409 
	C330.955292,178.820648 301.998779,193.961777 265.967438,197.238861 
	C248.867523,198.794098 231.667007,197.774887 213.517288,197.929581 
z"/></svg>,
      link: "https://instagram.com/parkramps/",
      label: "Ramp",
    },
    {
      icon: <Instagram size={20} className="text-[#919191]" />,
      link: "https://instagram.com/parkramps/",
      label: "Extra",
    },
  ];

  return (
    <>
      {/* ───────────── DESKTOP ───────────── */}
      <div className="hidden border-2 border-indigo-200 md:flex fixed top-0 left-0 w-full h-12 bg-black items-center justify-between px-4 z-50">
        <img src="/logo.png" alt="Logo" className="opacity-50 max-h-12" />

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
            className="w-9 h-9 flex items-center justify-center rounded hover:bg-white/10 transition"
          >
            <MoreVertical size={28} className="text-[#919191]" />
          </button>
        </div>
      </div>

      {/* ───────────── MOBILE ───────────── */}
      <div className="md:hidden">
        {/* Шапка */}
        <div className="fixed  flex justify-center w-full h-12 bg-black flex items-center px-4 z-50">
          <img src="/logo.png" alt="Logo" className="opacity-50 max-h-12" />
        </div>

        {/* FAB + меню */}
        <div
          ref={mobileMenuRef}
          className="fixed bottom-8 right-5 z-50 flex flex-col items-center gap-3"
        >
          <AnimatePresence>
            {open && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                className="flex flex-col-reverse gap-3"
              >
                {buttons.map((btn, i) => (
                  <motion.button
                    key={i}
                    custom={i}
                    variants={{
                      closed: { opacity: 0, y: 14, scale: 0.75 },
                      open: (idx) => ({
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          delay: idx * 0.05,
                          duration: 0.22,
                          ease: "easeOut",
                        },
                      }),
                    }}
                    onClick={
                      btn.onClick ||
                      (() => {
                        window.open(btn.link, "_blank");
                        setOpen(false);
                      })
                    }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    style={{ width: 52, height: 52 }}
                    className="rounded-2xl backdrop-blur-xl bg-black/75 border border-white/10
                               flex items-center justify-center shadow-lg hover:bg-white/20"
                    title={btn.label}
                  >
                    {btn.icon}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Кнопка — крестик / точки */}
          <motion.button
            onClick={() => setOpen(!open)}
            whileTap={{ scale: 0.9 }}
            style={{ width: 52, height: 52 }}
            className="rounded-full bg-pink-300 border border-white/15
                       flex items-center justify-center shadow-xl overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <X size={20} className="text-[#919191]" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <MoreVertical size={20} className="text-[#919191]" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </>
  );
}