import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { calculateRating } = useContext(AppContext);

  const standardTier = course.pricingTiers?.find(t => t.tier === 'standard');
  const premiumTier = course.pricingTiers?.find(t => t.tier === 'premium');

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-100 pb-5 overflow-hidden rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative">
        <img
          className="w-full aspect-video object-cover"
          src={course.thumbnail || 'https://via.placeholder.com/400x300?text=Course+Image'}
          alt={course.title}
          width={400}
          height={225}
        />
        {/* Optional premium badge overlay */}
        {premiumTier && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
            Premium
          </div>
        )}
      </div>

      <div className="p-4 text-left flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-500 text-sm mb-2 font-medium">
          {course.instructorId?.firstName || course.instructor?.name || "Expert Educator"}
        </p>
        
        <div className="flex items-center space-x-2 mb-auto pb-4">
          <p className="font-bold text-yellow-500">{Number(calculateRating(course)).toFixed(1)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(course))
                    ? assets.star
                    : assets.star_blank
                }
                alt="star"
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm">({course.totalReviews || 0})</p>
          <span className="text-gray-300 mx-1">•</span>
          <p className="text-gray-500 text-sm">{course.enrollmentCount || 0} students</p>
        </div>

        {/* Pricing Section */}
        <div className="border-t border-gray-100 pt-3 space-y-2">
          {/* Standard Price */}
          {standardTier && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Standard</span>
              <div className="flex items-center gap-2">
                {standardTier.discount > 0 ? (
                  <>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{standardTier.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      ₹{standardTier.finalPrice.toLocaleString('en-IN')}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-gray-900">
                    ₹{standardTier.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Premium Price */}
          {premiumTier && (
            <div className="flex items-center justify-between bg-amber-50/50 rounded-md -mx-1 px-1 py-0.5">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Premium</span>
              <div className="flex items-center gap-2">
                {premiumTier.discount > 0 ? (
                  <>
                    <span className="text-xs text-amber-300 line-through">
                      ₹{premiumTier.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-bold text-amber-600">
                      ₹{premiumTier.finalPrice.toLocaleString('en-IN')}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-amber-600">
                    ₹{premiumTier.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </Link>
  );
};

export default CourseCard;
