import React, { useState } from "react";

const Review = ({ review }) => {
  const [showFull, setShowFull] = useState(false); // Trạng thái hiển thị đầy đủ nội dung

  return (
    <div className="relative">
      {/* Review Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm w-[400px] min-h-[240px] mx-auto">
        {/* Rating stars */}
        <div className="mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`text-2xl mr-1 ${
                i < review.rating ? "text-yellow-400" : "text-gray-200"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* User name */}
        <div className="mb-4">
          <span className="font-semibold text-xl">
            {review.userId.fullName}
          </span>
        </div>

        {/* Review content */}
        <p
          className={`text-gray-600 leading-relaxed text-base italic ${
            !showFull ? "line-clamp-3" : ""
          }`}
          onClick={() => setShowFull(!showFull)}
        >
          "{review.feedback}"
        </p>

        {/* Date */}
        <p className="text-gray-400 text-sm mt-4">
          {new Date(review.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default Review;
