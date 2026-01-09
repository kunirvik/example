import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {  useRef } from "react";

const LogoModel = () => {

    const gltf = useLoader(GLTFLoader, "/model.glb");
      const modelRef = useRef();
    
     useFrame(() => {
        if (modelRef.current) {
         modelRef.current.rotation.y += 0.01;
        }
      });
    
      return <primitive ref={modelRef} object={gltf.scene} scale={[0.01, 0.01, 0.01]} />;
    };

export default LogoModel