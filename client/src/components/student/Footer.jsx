import React from 'react'
import { assets } from '../../assets/assets'
import {Link} from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
        
        {/* --------- Logo + Description ---------- */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <img 
            src={assets.logo_new} 
            alt="logo" 
            className='w-40 md:w-48 transition duration-300 hover:scale-105 hover:drop-shadow-md'
          />
          
          <p className='mt-6 text-center md:text-left text-sm text-white/80 leading-relaxed'>
            We bring together world-class instructors, interactive content,  
            and a supportive community to help you achieve your personal  
            and professional goals.
          </p>
        </div>

        {/* --------- Company Links ---------- */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>

            <li><Link to="/" >Home</Link></li>
            <li><Link to="/course-list" >Courses</Link></li>
            <li><Link to="/about" >About</Link></li>
            <li><Link to="/contact" >Contact Us</Link></li>
           </ul>
        </div>

        {/* --------- Newsletter ---------- */}
        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h2>
          <p className='text-sm text-white/80 leading-relaxed'>
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>

          <div className='flex items-center gap-2 pt-4'>
            <input 
              type="email" 
              placeholder='Enter your email' 
              className='border border-gray-500/30 bg-gray-800 text-white placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm'
            />
            <button className='bg-blue-600 w-24 h-9 text-white rounded hover:bg-blue-700 transition'>
              Subscribe
            </button>
          </div>
        </div>

      </div>

      <p className='py-4 text-center text-xs md:text-sm text-white/60'>
        Copyright 2025 © RK Consultant. All Rights Reserved.
      </p>
    </footer>
  )
}

export default Footer
