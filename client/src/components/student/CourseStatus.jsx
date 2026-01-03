import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  PlayCircle, 
  FileText, 
  Star, 
  Menu, 
  ArrowLeft,
  Maximize 
} from 'lucide-react'; // You might need to install: npm install lucide-react

// 1. Mock Data to simulate the course content
const courseData = [
  {
    id: 1,
    title: "Basics",
    isOpen: true,
    lessons: [
      { id: 101, title: "What is NodeJS?", duration: "7m 45s", type: "video", completed: false },
      { id: 102, title: "Installation and Setup", duration: "6m 2s", type: "video", completed: false },
      { id: 103, title: "Hello World", duration: "9m 45s", type: "video", completed: false },
    ]
  },
  {
    id: 2,
    title: "Modules & Packages",
    isOpen: false,
    lessons: [
      { id: 201, title: "CommonJS Modules", duration: "12m 30s", type: "video", completed: false },
      { id: 202, title: "NPM Basics", duration: "8m 15s", type: "video", completed: false },
    ]
  },
  {
    id: 3,
    title: "HTTP Server with NodeJS",
    isOpen: false,
    lessons: [
      { id: 301, title: "Creating Server", duration: "15m 00s", type: "video", completed: false },
    ]
  },
  {
    id: 4,
    title: "Express Framework",
    isOpen: false,
    lessons: []
  }
];

const CourseStatus = () => {
  // State to manage which sections are open
  const [sections, setSections] = useState(courseData);
  const [currentVideo, setCurrentVideo] = useState("What is NodeJS?");

  // Function to toggle accordion sections
  const toggleSection = (id) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, isOpen: !section.isOpen } : section
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      
      {/* --- HEADER SECTION --- */}
      <header className="bg-gray-900 text-white h-16 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-4">
          <button className="hover:bg-gray-700 p-2 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Master NodeJS - Hindi</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 border border-gray-600 px-3 py-1 rounded hover:bg-gray-800 text-sm">
            <Star size={16} className="fill-white" /> Rate Course
          </button>
          <button className="hover:bg-gray-700 p-2 rounded">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT BODY --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDE: VIDEO PLAYER */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video Placeholder Container */}
          <div className="bg-black w-full aspect-video flex items-center justify-center relative group cursor-pointer">
            {/* Using a gradient to mimic the thumbnail */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-black opacity-80"></div>
            
            {/* Play Button Overlay */}
            <div className="z-10 text-center">
               <div className="text-6xl font-bold text-white mb-2">INTRODUCTION</div>
               <PlayCircle size={64} className="text-white fill-blue-500 mx-auto" />
            </div>

            {/* Video Controls Bar (Mock) */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 flex justify-between items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex gap-4">
                 <PlayCircle size={20} />
                 <span className="text-xs">00:00 / 07:45</span>
               </div>
               <Maximize size={20} />
            </div>
          </div>

          {/* Video Title Area */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentVideo}</h2>
            <p className="text-gray-500 text-sm">Last updated 5/4/2023</p>
          </div>
        </div>

        {/* RIGHT SIDE: COURSE CONTENT (SIDEBAR) */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 font-bold text-gray-800">
            Course Contents
          </div>

          <div className="flex-1 overflow-y-auto">
            {sections.map((section) => (
              <div key={section.id} className="border-b border-gray-100">
                {/* Accordion Header */}
                <button 
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-700">{section.title}</span>
                  {section.isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {/* Accordion Body (Lessons List) */}
                {section.isOpen && (
                  <div className="bg-white">
                    {section.lessons.map((lesson) => (
                      <div 
                        key={lesson.id} 
                        className={`flex items-start gap-3 p-3 pl-6 hover:bg-gray-50 cursor-pointer ${currentVideo === lesson.title ? 'bg-blue-50' : ''}`}
                        onClick={() => setCurrentVideo(lesson.title)}
                      >
                        {/* Checkbox */}
                        <div className="pt-1">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        </div>
                        
                        {/* Lesson Info */}
                        <div className="flex-1">
                          <p className={`text-sm ${currentVideo === lesson.title ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                             {lesson.type === 'video' ? <PlayCircle size={12} /> : <FileText size={12} />}
                             <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Bottom Floating Chat Button (Blue Bubble) */}
          <div className="p-4 bg-white border-t border-gray-200">
             <div className="flex justify-end">
                <button className="bg-blue-600 p-3 rounded-full text-white shadow-lg hover:bg-blue-700 transition">
                   <Menu size={20} /> {/* Represents the chat icon */}
                </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CourseStatus