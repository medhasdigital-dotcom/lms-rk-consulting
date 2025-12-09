import { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzmrm1vG5pfq2P8nwf1mgDrVlWSlIyUq9kk0dN7LGOmJ93KM9lc1P3pqWHWjJZen6L_/exec";

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
    <div className="bg-cyan-100/70 min-h-screen pt-20">
      
      {/* Header */}
      <section className="text-center py-10 px-6">
        <h1 className="text-4xl font-extrabold text-cyan-700">Contact Us</h1>
        <p className="text-gray-600 max-w-xl mt-3 mx-auto">
          Have questions or need help? We’re here for you!
        </p>
      </section>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 pb-20">

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md border border-cyan-200 rounded-xl p-8"
        >
          <h2 className="text-2xl font-semibold text-cyan-700 mb-6">Send us a message</h2>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Full Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="mt-2 w-full p-3 rounded-lg border border-cyan-200 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Email Address</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="mt-2 w-full p-3 rounded-lg border border-cyan-200 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </label>

          <label className="block mb-5">
            <span className="text-gray-700 font-medium">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Write your message..."
              rows="5"
              className="mt-2 w-full p-3 rounded-lg border border-cyan-200 focus:ring-2 focus:ring-cyan-500 outline-none"
            ></textarea>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-semibold transition-all ${
              loading ? "bg-cyan-400 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Message"}
          </button>
        </form>

        {/* Contact Information */}
        <div className="bg-white border border-cyan-200 shadow-md rounded-xl p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-cyan-700 mb-6">Get in Touch</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-cyan-600">📍 Address</h3>
              <p className="text-gray-600 mt-1">
                KW Delhi-6, Raj Nagar Extension, Ghaziabad <br /> Uttar Pradesh, 201003
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-cyan-600">📞 Phone</h3>
              <p className="text-gray-600 mt-1">+91 80062 62813</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-cyan-600">📧 Email</h3>
              <p className="text-gray-600 mt-1">info@rkconsultant.org.in</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-cyan-600">⏰ Support Hours</h3>
              <p className="text-gray-600 mt-1">Mon - Fri: 9:00 AM — 6:00 PM IST</p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 mt-8">
            {["facebook", "instagram", "linkedin", "twitter"].map((icon, idx) => (
              <a
                key={idx}
                href="#"
                className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-700 hover:text-white p-3 rounded-full transition-all"
              >
                {icon.charAt(0).toUpperCase() + icon.slice(1)}
              </a>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Contact;
