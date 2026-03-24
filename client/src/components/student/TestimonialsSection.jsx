import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/v1/testimonials/public`
        );
        if (data.success && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      } catch {
        // Silently fail — no testimonials to show
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [backendUrl]);

  if (loading) return null;
  if (testimonials.length === 0) return null;

  return (
    <div className="pb-14 px-8 md-px-0">
      <h2 className="text-3xl font-medium text-gray-800">Testimonials</h2>
      <p className="md:text-base text-gray-500 mt-3">
        Hear from our learners as they share their journeys of transformation,
        success, and how our <br /> platform has made a difference in their
        lives.
      </p>
      <div className="grid grid-cols-auto gap-8 mt-14">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial._id}
            className="text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden"
          >
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10">
              {testimonial.imageUrl ? (
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-lg">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-medium text-gray-800">
                  {testimonial.name}
                </h1>
                {testimonial.role && (
                  <p className="text-gray-800/80">{testimonial.role}</p>
                )}
              </div>
            </div>
            <div className="p-5 pb-7">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    className="h-5"
                    key={i}
                    src={
                      i < Math.floor(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
