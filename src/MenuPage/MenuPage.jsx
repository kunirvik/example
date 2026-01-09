import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingScreen from "../LoadingScreen/LodingScreen";

const words = ["Skateparks",  "Ramps", "Events", "Parkramps"];

export default function MenuPage() {
  const [index, setIndex] = useState(0);
  const [tooltip, setTooltip] = useState({ visible: false, x:0 , y: 0 });
  const tooltipRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); 
    const [isFadingOut, setIsFadingOut] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    setTooltip({ visible: true, x: e.clientX , y: e.clientY  });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };

   useEffect(() => {
    // Запускаем анимацию исчезновения перед снятием лоадинга
    const timer = setTimeout(() => setIsFadingOut(true), 1500);
    const removeLoadingScreen = setTimeout(() => setIsLoading(false), 2300);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(removeLoadingScreen);
    };
  }, []);  

  return (<>
   {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}
   
    <div className="relative w-full  bg-white-200  h-screen flex items-center justify-center overflow-visible ">
      {/* Фоновое видео */}
      {/* <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover grayscale"
      >
        <source src="/tlprshrt.mp4" type="video/mp4" />
      </video> */}



  {/* <div className="  absolute inset-0 w-full h-[100vh] overflow-hidden lg:w-full lg:h-full">
  <img
    src="/project2.png"
    alt="Project"
    className="w-full h-full object-contain lg:object-fill lg:rotate-90"
  />
</div>
 */}

<picture>
  {/* для телефонов и планшетов */}
  <source srcSet="/project2.png" media="(max-width: 1024px)" />
  {/* для десктопа */}
  <img
    src="/project.png"
    alt="Project"
    className="absolute top-0 left-0 w-full h-full object-cover"
  />
</picture>



      
      {/* Анимированный текст */}
      <div className="relative z-10 flex flex-col items-center overflow-visible">
       <motion.h1
  key={index}
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.5 }}
  className={`
    text-center
    break-words
    whitespace-normal
    font-futura
    tracking-[-5px]
    mb-6
    cursor-pointer
    overflow-hidden
    bg-clip-text
    ${index === words.length - 1 
      ? "font-bold text-transparent bg-pink-300" 
      : "font-medium text-transparent bg-white/50"}
  `}
  style={{
    fontSize: "clamp(60px, 10vw, 150px)",
    padding: "0 20px"
  }}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
>
  {words[index]}
</motion.h1>

        {/* <span className="text-[250px] font-bold text-transparent bg-clip-text bg-white/30 ">skatepark</span>
         */}

             {/* Подсказка */}
             {/* {tooltip.visible && (
          <motion.div
            ref={tooltipRef}
            className="absolute bg-black font-futura font-medium text-white text-sm px-3 py-1 rounded-lg shadow-lg "
            style={{ top: tooltip.y, left: tooltip.x }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
          <PiEyesFill />
          </motion.div>
        )} */}




        {/* Кнопка перехода */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}

          className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg text-lg font-futura font-light shadow-lg hover:bg-pink-300 cursor-pointer"
         onClick={() =>{
 
        
           navigate("/catalogue")
        }
          
          }
        >explore
        </motion.button>
      </div>
    </div></>
  );
}
