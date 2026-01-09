
import { useEffect, useState } from "react";
import CloudGallery from "../CloudGallery/CloudGallery";
import { useNavigate } from "react-router-dom";
import { useTransition, animated } from "@react-spring/web";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons"; // Подключаем SocialButtons
import Footer from "../Footer/Footer";

const images = [
  {
    public_id: "skatepark-1",
    secure_url: "/images/project2026/halloween.jpg", // путь к твоей картинке
    resource_type: "image",
    context: {
      caption: "Скейтпарк",
      alt: "Современный бетонный скейтпарк"
    }
  },
  {
    public_id: "skatepark-2",
    secure_url: "/images/project2026/2017.jpg",
    resource_type: "image",
    context: {
      caption: "Скейтпарк №2",
      alt: "Вид на другой скейтпарк"
    }
  },
  {
    public_id: "ramp-1",
    secure_url: "/images/project2026/halloween2.jpg",
    resource_type: "image",
    context: {
      caption: "Рампа",
      alt: "Небольшая мини-рампa для скейтборда"
    }
  },

  {
    public_id: "skatepark-2",
    secure_url: "/images/project2026/bmxsesh.jpg",
    resource_type: "image",
    context: {
      caption: "Скейтпарк №2",
      alt: "Вид на другой скейтпарк"
    }
  },  
  {
    public_id: "skatepark-2",
    secure_url: "/images/project2026/2021.jpg",
    resource_type: "image",
    context: {
      caption: "Скейтпарк №2",
      alt: "Вид на другой скейтпарк"
    }
  },
  
    {
    public_id: "skatepark-2",
    secure_url: "/images/project2026/skatesesh.jpg",
    resource_type: "image",
    context: {
      caption: "Скейтпарк №2",
      alt: "Вид на другой скейтпарк"
    }, },
     {
    public_id: "skatepark-2",
    secure_url: "/images/project2026/2015.jpg",
    resource_type: "image",
    context: {
      caption: "Скейтпарк №2",
      alt: "Вид на другой скейтпарк"
    }},{
    public_id: "skatepark-2",
    secure_url: "/images/project2026/2020.jpg",
    resource_type: "image",
    context: {
      caption: "Скейтпарк №2",
      alt: "Вид на другой скейтпарк"
    }
  },
      {
    public_id: "skatepark-2",
    secure_url: "/images/project2026/bmx2016.jpg",
    resource_type: "image",
    context: {
      caption: "Скейтпарк №2",
      alt: "Вид на другой скейтпарк"
    }}
 
]; 
const ProjectPage = () => {
  // const [images, setImages] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const navigate = useNavigate();







  const exitTransition = useTransition(!isExiting, {
    from: { transform: "translateY(0%)", opacity: 1 },
    leave: { transform: "translateY(-100vh)", opacity: 0 },
    config: { tension: 200, friction: 25, duration: 1000 },
    onRest: () => {
      if (isExiting) {
        window.scrollTo(0, 0);
        navigate("/catalogue");
      }
    },
  });

  const handleExit = () => {
    setIsExiting(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1500);

    const galleryTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2300);

    return () => {
      clearTimeout(timer);
      clearTimeout(galleryTimer);
    };
  }, []);


  return (
    <>
      {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

      {/* Передаем handleExit в SocialButtons */}
     {/* Передаем название кнопки, обработчик клика и анимацию */}
     <SocialButtons
        buttonLabel="shop"
        onButtonClick={handleExit}
        buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
      />

<div className="min-h-screen  mt-10 font-futura ">

        {exitTransition(
          (styles, item) =>
            item && (
              <animated.div style={styles} className="w-full bg-black h-full">
                <CloudGallery images={images} />
              </animated.div>
            )
        )}
      </div>

<Footer></Footer>

    </>
  );
};

export default ProjectPage;
