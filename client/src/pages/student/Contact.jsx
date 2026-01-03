import React, { useState } from "react";
import { toast } from "react-toastify";
import Footer from "../../components/student/Footer";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const scriptURL = "https://script.google.com/macros/s/AKfycbzmrm1vG5pfq2P8nwf1mgDrVlWSlIyUq9kk0dN7LGOmJ93KM9lc1P3pqWHWjJZen6L_/exec";

    setLoading(true);
    toast.info("Sending message...");

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Message sent successfully! 📩");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error("Something went wrong ❌");
      }
    } catch (error) {
      toast.error("Network error! Check connection ⚠");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      
      {/* --- Top Gradient Layer (Consistent with About Page) --- */}
      <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-cyan-100/70 to-white z-0" />

      {/* --- Background Dot Pattern (Subtle Texture) --- */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 pt-20 md:pt-6 pb-0 px-4 md:px-0">
        
        <div className="pb-20">

            {/* Header Section */}
            <section className="text-center px-6 py-12 max-w-5xl mx-auto">
                <span className="text-cyan-600 font-bold tracking-wider uppercase text-xs bg-cyan-100/80 px-4 py-1.5 rounded-full border border-cyan-200">
                  We'd love to hear from you
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-6 mb-4">
                  Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Our Team</span>
                </h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                  Have a question about our courses? Need help with your account? Drop us a line.
                </p>
            </section>

            {/* Content Grid */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden border border-gray-100">

                {/* LEFT: Contact Form (White) */}
                <div className="bg-white p-10 md:p-12 order-2 md:order-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                placeholder="Tell us how we can help..."
                                rows="4"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-lg font-bold text-white tracking-wide shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5 ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                            }`}
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>

                {/* RIGHT: Contact Info (Dark Gradient Theme) */}
                <div className="relative bg-gray-900 p-10 md:p-12 order-1 md:order-2 flex flex-col justify-between overflow-hidden">
                    
                    {/* Decorative Background Blob */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-600 blur-3xl opacity-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600 blur-3xl opacity-20 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
                        <p className="text-gray-400 mb-10 text-sm">Fill up the form or contact us directly.</p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-cyan-400 shrink-0 backdrop-blur-sm border border-white/10">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Phone</h3>
                                    <p className="text-gray-400 text-sm mt-1">+91 80062 62813</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-cyan-400 shrink-0 backdrop-blur-sm border border-white/10">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Email</h3>
                                    <p className="text-gray-400 text-sm mt-1">info@rkconsultant.org.in</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-cyan-400 shrink-0 backdrop-blur-sm border border-white/10">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Address</h3>
                                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                                        KW Delhi-6, Raj Nagar Extension,<br /> Ghaziabad, Uttar Pradesh, 201003
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Icons (SVGs) */}
                    <div className="relative z-10 mt-12">
                        <p className="text-sm font-medium text-gray-400 mb-4">Connect with us</p>
                        <div className="flex gap-4">
                            {[
                              { name: 'facebook', path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                              { name: 'twitter', path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                              { name: 'instagram', path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" },
                              { name: 'linkedin', path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-cyan-600 transition-all duration-300"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d={social.path}></path>
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;