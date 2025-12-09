import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

// const Hero = () => {
//   return (
//     // <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70' >

//     //   <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto'>
//     //     Empower your future with the courses designed to <span className='text-blue-600'>fit your choice.</span><img src={assets.sketch} alt="sketch" className='md:block hidden absolute -bottom-7 right-0'/>
//     //   </h1>

//     //   <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>
//     //     We bring together world class instructors, interactive content, and a spportive community to help you achive your personal and professional goals
//     //   </p>

//     //   <p className='md:hidden text-gray-500 max-w-sm mx-auto'>
//     //     We bring together world-c;ass instructors to help you achive your personal and professional goals
//     //   </p>
//     //   <SearchBar/>
//     // </div>
    

// <div id="default-carousel" className="relative w-full" data-carousel="slide">
//     <div className="relative h-56 overflow-hidden rounded-base md:h-96">
//         <div className="hidden duration-700 ease-in-out" data-carousel-item>
//             <img src={assets.course_1_thumbnail} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
//         </div>
//         <div className="hidden duration-700 ease-in-out" data-carousel-item>
//             <img src={assets.course_2_thumbnail} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
//         </div>
//         <div className="hidden duration-700 ease-in-out" data-carousel-item>
//             <img src={assets.course_3_thumbnail} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
//         </div>
//         <div className="hidden duration-700 ease-in-out" data-carousel-item>
//             <img src={assets.course_4_thumbnail} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
//         </div>
//     </div>
//     <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
//         <button type="button" className="w-3 h-3 rounded-base" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
//         <button type="button" className="w-3 h-3 rounded-base" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
//         <button type="button" className="w-3 h-3 rounded-base" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
//         <button type="button" className="w-3 h-3 rounded-base" aria-current="false" aria-label="Slide 4" data-carousel-slide-to="3"></button>
//         <button type="button" className="w-3 h-3 rounded-base" aria-current="false" aria-label="Slide 5" data-carousel-slide-to="4"></button>
//     </div>
//     <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
//         <span className="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
//             <svg className="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/></svg>
//             <span className="sr-only">Previous</span>
//         </span>
//     </button>
//     <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
//         <span className="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
//             <svg className="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/></svg>
//             <span className="sr-only">Next</span>
//         </span>
//     </button>
// </div>

//   )
// }

// export default Hero


import { useEffect } from "react";
import { Carousel } from "flowbite";

const images = [
  assets.course_1_thumbnail,
  assets.course_2_thumbnail,
  assets.course_3_thumbnail,
  assets.course_4_thumbnail
];

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Hero = () => {
  return (
    <div className="w-4/5 mx-auto mt-10"> {/* Top space + centered */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        loop={true}
        className="rounded-xl overflow-hidden"
        style={{ width: "100%" }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              className="w-full h-auto object-cover rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;

