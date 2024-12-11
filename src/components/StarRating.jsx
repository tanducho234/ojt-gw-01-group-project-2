import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating, size = "text-xl" }) => {
  // Default size is 'text-xl'
  const stars = Array.from({ length: 5 }, (_, index) => {
    const fullStarThreshold = Math.floor(rating); // Full stars are for the integer part of the rating
    const hasHalfStar = rating - fullStarThreshold >= 0.5; // Check if we need a half star

    // Render full star
    if (index < fullStarThreshold) {
      return <FaStar key={index} className={`text-yellow-500 ${size}`} />;
    }
    // Render half star
    else if (index === fullStarThreshold && hasHalfStar) {
      return (
        <FaStarHalfAlt key={index} className={`text-yellow-500 ${size}`} />
      );
    }
    // Render empty star
    else {
      return <FaRegStar key={index} className={`text-yellow-500 ${size}`} />;
    }
  });

  return (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">{stars}</div>
      <span className="text-sm">
        <span className="text-black">
          {(rating || 0).toFixed(1).replace(".0", "")}
        </span>
        <span className="text-gray-600">/5</span>
      </span>
    </div>
  );
};
export default StarRating;
