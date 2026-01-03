import React from 'react';
// import { assets } from '../../assets/assets'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Autoplay, Pagination } from 'swiper/modules';

const Hero = () => {
  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
      // Split title into normal text and highlighted text
      title: "Full Stack",
      highlight: "Web Development",
      subtitle: "Learn MERN stack from scratch with real-world projects.",
      price: "$49",
      originalPrice: "$199",
      discount: "75% OFF"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      title: "Data Science",
      highlight: "Bootcamp",
      subtitle: "Master Python, Pandas, and Machine Learning algorithms.",
      price: "$59",
      originalPrice: "$249",
      discount: "70% OFF"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
      title: "UI/UX Design",
      highlight: "Masterclass",
      subtitle: "Design beautiful mobile apps and websites using Figma.",
      price: "$39",
      originalPrice: "$149",
      discount: "60% OFF"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
      title: "Digital Marketing",
      highlight: "Pro",
      subtitle: "Grow any business with SEO, SEM, and Social Media strategies.",
      price: "$29",
      originalPrice: "$99",
      discount: "50% OFF"
    }
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center pt-20 md:pt-16 pb-0 bg-gradient-to-b from-cyan-100/70 to-white px-4 md:px-0">
      
      <div className="w-[80%] mx-auto"> 
        
        <Swiper
          modules={[Autoplay, Pagination]} 
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id} className="h-full">
              
              <div className="flex flex-col md:flex-row h-full">
                
                {/* Left Side (Green Background) */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-start space-y-5 text-left order-2 md:order-1 bg-green-50">
                  
                  {/* === UPDATED HEADING === */}
                  <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
                    {slide.title} <span className="text-blue-600">{slide.highlight}</span>
                  </h1>
                  
                  <p className="text-gray-600 text-base md:text-lg">
                    {slide.subtitle}
                  </p>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Total Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">{slide.price}</span>
                        <span className="text-lg text-gray-400 line-through decoration-red-500">{slide.originalPrice}</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                      {slide.discount}
                    </div>
                  </div>

                  <div className="flex gap-4 w-full pt-4">
                    <button className="flex-1 md:flex-none px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                      Enroll Now
                    </button>
                    <button className="flex-1 md:flex-none px-8 py-3 border border-gray-400 text-gray-700 font-semibold rounded-lg hover:bg-white transition duration-300">
                      View Demo
                    </button>
                  </div>
                </div>

                {/* Right Side Image */}
                <div className="relative w-full h-64 md:h-auto md:w-1/2 order-1 md:order-2 overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;