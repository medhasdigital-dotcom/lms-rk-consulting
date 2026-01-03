import React from "react";
import Footer from "../../components/student/Footer";

const About = () => {
  return (
    // 1. Set main background to white and position relative
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      
      {/* 2. THE GRADIENT LAYER (Exactly 200px height) */}
      <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-cyan-100/70 to-white z-0" />

      {/* 3. Main Content (z-10 ensures it sits ON TOP of the gradient) */}
      <div className="relative z-10 pt-20 md:pt-4 pb-0 px-4 md:px-0">
        
        <div className="pb-10">
          
          {/* --- Hero Section --- */}
          <section className="text-center px-6 py-16 max-w-5xl mx-auto">
            <span className="text-cyan-600 font-semibold tracking-wider uppercase text-sm bg-cyan-100 px-4 py-1 rounded-full">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-6 mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">RK-Consultant</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
              LearnSphere is a next-generation LMS designed to make learning simple, 
              personalized, and accessible. We bridge the gap between curiosity and expertise.
            </p>
          </section>

          {/* --- Stats Section --- */}
          <section className="px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: "50K+", label: "Active Students", icon: "🎓" },
                { number: "500+", label: "Premium Courses", icon: "📚" },
                { number: "120+", label: "Expert Mentors", icon: "👨‍🏫" },
                { number: "98%", label: "Success Rate", icon: "⭐" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 shadow-lg shadow-gray-200/50 rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <h3 className="text-3xl font-bold text-gray-800">{stat.number}</h3>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* --- Mission Section --- */}
          <section className="px-6 my-24">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
                <p className="text-gray-600 leading-8 text-lg">
                  Our mission is to empower learners with high-quality education through advanced digital 
                  learning tools. LearnSphere brings together <span className="font-semibold text-cyan-700">live classes</span>, 
                  <span className="font-semibold text-cyan-700"> AI-based assessments</span>, 
                  and personalized learning paths to help learners achieve their goals faster.
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                 {/* Abstract Visual Representation */}
                 <div className="relative w-64 h-64 bg-cyan-600 rounded-full opacity-10 blur-3xl absolute"></div>
                 <div className="relative z-10 grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-md animate-pulse">🚀 Growth</div>
                    <div className="bg-white p-4 rounded-xl shadow-md mt-8">🧠 Knowledge</div>
                    <div className="bg-white p-4 rounded-xl shadow-md -mt-4">🌍 Community</div>
                    <div className="bg-white p-4 rounded-xl shadow-md mt-4">💡 Innovation</div>
                 </div>
              </div>
            </div>
          </section>

          {/* --- Why Choose Us (Grid with Icons) --- */}
          <section className="max-w-6xl mx-auto py-12 px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose LearnSphere?</h2>
              <p className="text-gray-500 mt-3">Discover the features that make us unique.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((item, i) => (
                <div
                  key={i}
                  className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-cyan-200 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
    </div>
  );
};

// Data for Features with SVG Icons
const features = [
  { 
    title: "Interactive Learning", 
    text: "Live classes, quizzes, AI & gamified learning experiences.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> 
  },
  { 
    title: "Expert Mentors", 
    text: "Learn from industry professionals & educators shaping real careers.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> 
  },
  { 
    title: "Career Focused", 
    text: "Roadmaps, skill tracking & placement assistance to get you hired.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> 
  },
  { 
    title: "Personalized Dashboard", 
    text: "Track classes, certification & growth metrics all in one place.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> 
  },
  { 
    title: "Lifetime Access", 
    text: "Access learning materials anywhere, anytime at your own pace.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
  },
  { 
    title: "Global Community", 
    text: "Connect, collaborate, and grow with learners from across the world.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
  },
];

export default About;