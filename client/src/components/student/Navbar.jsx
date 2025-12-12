import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { useClerk, UserButton, useUser } from "@clerk/clerk-react"
import { AppContext } from '../../context/AppContext'

const Navbar = () => {

  const { navigate, isEducator } = useContext(AppContext)
  
  const location = useLocation()
  const isCourseListPage = location.pathname.includes("/course-list")

  const { openSignIn } = useClerk()
  const { user } = useUser()

  const [showMenu, setShowMenu] = useState(false)

  // 🔥 Reusable hover style
  const navHover = 
    "hover:text-blue-600 transition relative after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-5 ${isCourseListPage ? "bg-white" : "bg-cyan-100/70"}`}>
      
      {/* --- Desktop Logo --- */}
      <img
  onClick={() => navigate("/")}
  src={assets.logo_new}
  alt="logo"
  className="
    w-36 lg:w-40 
    cursor-pointer 
    transition 
    duration-300 
    hover:scale-105 
    hover:drop-shadow-md
  "
/>


      {/* --- Desktop Menu --- */}
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
          {user && 
            <>
              <button onClick={() => { navigate("/educator") }} className={navHover}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              <Link to="/my-enrollments" className={navHover}>My Enrollments</Link>
            </>
          }
        </div>
        <div className='flex items-center  text-[16px] font-semibold  gap-6'>
          <Link to="/" className={navHover}>Home</Link>
          <Link to="/course-list" className={navHover}>Courses</Link>
          <Link to="/notice" className={navHover}>Notice</Link>
          <Link to="/about" className={navHover}>About</Link>
          <Link to="/contact" className={navHover}>Contact Us</Link>
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button 
            onClick={() => openSignIn()} 
            className='bg-blue-600 text-white px-5 py-2 rounded-full transition hover:bg-blue-700'>
            Create Account
          </button>
        )}
      </div>

      {/* --- Mobile Header --- */}
      <div className='md:hidden flex items-center gap-4 text-gray-500'>
        {user && <UserButton />}
        <button onClick={() => setShowMenu(true)}>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-blue-600">
             <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
           </svg>
        </button>
      </div>

      {/* --- Mobile Sidebar Overlay --- */}
      {showMenu && (
         <div 
            onClick={() => setShowMenu(false)} 
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            aria-hidden="true"
         ></div>
      )}

      {/* --- Mobile Sidebar --- */}
      <div className={`md:hidden fixed top-0 right-0 bottom-0 bg-white z-50 transition-all duration-300 ${showMenu ? 'w-[70%]' : 'w-0 overflow-hidden'}`}>
         
         <div className='flex justify-between items-center px-6 py-4 border-b border-gray-200'>
            <img src={assets.logo_new} alt="logo" className='w-24' />
            <button onClick={() => setShowMenu(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
         </div>

         <div className='flex flex-col gap-6 px-8 py-8 text-lg font-medium text-gray-600'>
            <Link onClick={() => setShowMenu(false)} to="/" className={navHover}>Home</Link>
            <Link onClick={() => setShowMenu(false)} to="/course-list" className={navHover}>Courses</Link>
            <Link onClick={() => setShowMenu(false)} to="/about" className={navHover}>About</Link>
            <Link onClick={() => setShowMenu(false)} to="/contact" className={navHover}>Contact Us</Link>
            
            {user ? (
               <>
                 <Link onClick={() => setShowMenu(false)} to="/my-enrollments" className={navHover}>My Enrollments</Link>
                 <button 
                   onClick={() => { navigate("/educator"); setShowMenu(false); }} 
                   className={`text-left ${navHover}`}>
                    {isEducator ? "Educator Dashboard" : "Become Educator"}
                 </button>
               </>
            ) : (
               <button 
                 onClick={() => { openSignIn(); setShowMenu(false); }} 
                 className={`text-left text-blue-600 ${navHover}`}>
                 Create Account
               </button>
            )}
         </div>
      </div>

    </div>
  )
}

export default Navbar
