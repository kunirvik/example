
// import { Routes, Route, useLocation } from "react-router-dom";
// import MenuPage from "./MenuPage/MenuPage";
// import RampsProductDetail from "./RampsProductDetail/RampsProductDetail";
// import SkateparksProductDetail from "./SkateparksProductDetail/SkateparksProductDetail";
// import DiyProductDetail from "./SetsProductDetail/SetsProductDetail";
// import ProjectPage from "./ProjectPage/ProjectPage"
// import './App.css'
// import SetsProductDetail from "./SetsProductDetail/SetsProductDetail";
// import Catalogue from "./Catalogue/Catalogue";
// import BlogPage from "./blog/components/BlogPage";
// import FilmGallery from "./FilmGallery";
// import GalleryPage from "./GalleryPage/GalleryPage";
// import BlogPostModal from "./blog/components/BlogPostModal";

// function App() {
//  const location = useLocation();
 
//   return (
//     <>
      
//     <Routes location={location} key={location.pathname}>
//         <Route path="/" element={<MenuPage />} />
//          <Route path="/blog" element={<BlogPage />} />
//         <Route  path="/catalogue" element={<Catalogue />} />
//     {/* <Route path="/gallery" element={<GalleryPage />} /> */}
//        {/* <Route path="/gallery" element={<FilmGallery />} />
//      */}

//      <Route path="/gallery/:type/:id" element={<GalleryPage />} />
//        <Route path="/product/sets/:id" element={<SetsProductDetail />} />
//  <Route path="/product/ramps/:id" element={<RampsProductDetail />} /> 
//  <Route path="/product/skateparks/:id" element={<SkateparksProductDetail />} />
//  <Route path="/product/diy/:id" element={<DiyProductDetail />} />
//        <Route path="/blog/post/:id" element={<BlogPostModal />} />


    
        
//          <Route path="projectpage" element={<ProjectPage/>}/>
        
//       </Routes>
     
//     </>
//   )
// }

// export default App

import { Routes, Route, useLocation } from "react-router-dom";
import MenuPage from "./MenuPage/MenuPage";
import RampsProductDetail from "./RampsProductDetail/RampsProductDetail";
import SkateparksProductDetail from "./SkateparksProductDetail/SkateparksProductDetail";
import ProjectPage from "./ProjectPage/ProjectPage"
import './App.css'
import SetsProductDetail from "./SetsProductDetail/SetsProductDetail";
import Catalogue from "./Catalogue/Catalogue";
import BlogPage from "./blog/components/BlogPage";
import GalleryPage from "./GalleryPage/GalleryPage";
import BlogPostModal from "./blog/components/BlogPostModal";
import AdminPage from "./blog/components/Adminpage";
import AllGalleryPage from "./Allgallerypage";
import MarketplacePage from "./Marketplacepage/Marketplacepage";


function App() {
  const location = useLocation();

  // Если модалка открыта — в state.background хранится /blog
  // BlogPage рендерится на фоне, модалка поверх
  // const background = location.state?.background;

  return (
    <>
      {/* <Routes location={background || location} key={(background || location).pathname}> */}
<Routes location={location} key={location.pathname}>
        <Route path="/" element={<MenuPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/catalogue" element={<Catalogue />} />
     <Route path="/gallery/all" element={<AllGalleryPage />} />    
     <Route path="/gallery/:type/:id" element={<GalleryPage />} />
 
 
        <Route path="/product/sets/:id" element={<SetsProductDetail />} />
        <Route path="/product/ramps/:id" element={<RampsProductDetail />} />
        <Route path="/product/skateparks/:id" element={<SkateparksProductDetail />} />
        <Route path="/blog/post/:id" element={<BlogPostModal />} />
        <Route path="projectpage" element={<ProjectPage />} />
           <Route path="/market"     element={<MarketplacePage />} />  
<Route path="/admin" element={<AdminPage />} />

    

      {/* Модалка рендерится ПОВЕРХ фонового роута */}
      {/* {background && ( */}
          <Route path="/blog/post/:id" element={<BlogPostModal />} />
         </Routes>
      {/* )} */}
    </>
  )
}

export default App