import React, { useState } from "react";

const Star = ({ rating, onRatingChange }) => {
  const handleClick = (value) => {
    onRatingChange(value); // Cập nhật đánh giá sao khi người dùng chọn
  };

  return (
    <div className="flex items-center space-x-3 ">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => handleClick(star)}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 cursor-pointer ${
            rating >= star ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12 17.27l6.18 3.73-1.64-7.03 5.45-4.73-7.19-.61L12 2.5l-2.81 6.13-7.19.61 5.45 4.73-1.64 7.03L12 17.27z"
          />
        </svg>
      ))}
    </div>
  );
};

export default Star;
