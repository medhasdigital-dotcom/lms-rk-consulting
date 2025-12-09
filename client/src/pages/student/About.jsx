import Footer from "../../components/student/Footer";

const About = () => {
  return (
    <>
    <div className="bg-cyan-100/70 min-h-screen text-gray-700 pt-20">

      {/* Hero Section */}
      <section className="text-center px-6 py-16">
        <h1 className="text-4xl font-extrabold text-cyan-700 mb-4">About LearnSphere</h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          LearnSphere is a next-generation LMS designed to make learning simple, personalized,
          and accessible for everyone.
        </p>
      </section>


      {/* Stats Section */}
      <section className="flex flex-wrap justify-center gap-6 py-12">
        {[
          { number: "50K+", label: "Students" },
          { number: "500+", label: "Courses" },
          { number: "120+", label: "Mentors" },
          { number: "98%", label: "Success Rate" },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-cyan-200 shadow-md rounded-xl px-8 py-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <h3 className="text-3xl font-bold text-cyan-600">{stat.number}</h3>
            <p className="text-gray-600 mt-2">{stat.label}</p>
          </div>
        ))}
      </section>


      {/* Mission Section */}
      <section className="bg-white max-w-5xl mx-auto p-10 rounded-xl shadow-md border border-cyan-200 my-10">
        <h2 className="text-3xl font-bold text-cyan-700 mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-7">
          Our mission is to empower learners with high-quality education through advanced digital 
          learning tools. LearnSphere brings together live classes, AI-based assessments, 
          and personalized learning paths to help learners achieve their goals faster.
        </p>
      </section>


      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-cyan-700 text-center mb-8">Why Choose Us?</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Interactive Learning", text: "Live classes, quizzes, AI & gamified learning." },
            { title: "Expert Mentors", text: "Professionals & educators shaping real industry careers." },
            { title: "Career Focused", text: "Roadmaps, skill tracking & placement assistance." },
            { title: "Personalized Dashboard", text: "Track classes, certification & growth metrics." },
            { title: "Lifetime Access", text: "Access learning anywhere, anytime at your pace." },
            { title: "Global Community", text: "Connect with learners from across the world." },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-cyan-200 shadow-sm rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-cyan-600">{item.title}</h3>
              <p className="text-gray-600 mt-3">{item.text}</p>
            </div>
          ))}
        </div>
      </section>


      {/* CTA Section */}
      <section className="text-center py-16 bg-cyan-600 text-white mt-20">
        <h2 className="text-3xl font-bold mb-3">Start Your Learning Journey 🚀</h2>
        <p className="max-w-xl mx-auto mb-6">
          Unlock unlimited access to premium courses, mentorship and certification.
        </p>
        <button className="bg-white text-cyan-700 font-semibold px-8 py-3 rounded-lg hover:bg-cyan-50 transition-all">
          Explore Courses
        </button>
      </section>
    </div>
           <Footer/>
    </>
  );
};

export default About;
