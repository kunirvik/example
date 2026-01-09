
import { Routes, Route, useLocation } from "react-router-dom";
import MenuPage from "./MenuPage/MenuPage";
import RampsProductDetail from "./RampsProductDetail/RampsProductDetail";
import SkateparksProductDetail from "./SkateparksProductDetail/SkateparksProductDetail";
import DiyProductDetail from "./SetsProductDetail/SetsProductDetail";
import ProjectPage from "./ProjectPage/ProjectPage"
import './App.css'
import SetsProductDetail from "./SetsProductDetail/SetsProductDetail";
import Catalogue from "./Catalogue/Catalogue";



function App() {
 const location = useLocation();
 
  return (
    <>
      
    <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MenuPage />} />
        
        <Route  path="/catalogue" element={<Catalogue />} />
    
       <Route path="/product/sets/:id" element={<SetsProductDetail />} />
 <Route path="/product/ramps/:id" element={<RampsProductDetail />} /> 
 <Route path="/product/skateparks/:id" element={<SkateparksProductDetail />} />
 <Route path="/product/diy/:id" element={<DiyProductDetail />} />
       


    
        
         <Route path="projectpage" element={<ProjectPage/>}/>
        
      </Routes>
     
    </>
  )
}

export default App
