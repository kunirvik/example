import { Canvas } from '@react-three/fiber';
import LogoModel from '../LogoModel/LogoModel';
import css from '../LoadingScreen/LoadingScreen.module.css'




const LoadingScreen = ({ isFadingOut }) => {
  return (
    <div className={`${css.loadingScreen} ${isFadingOut ? css.fadeOut : ""}`}>
      
      <Canvas camera={{ position: [25, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <LogoModel></LogoModel>
      </Canvas>
    </div>
  );
};
export default LoadingScreen
