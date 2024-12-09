import React, { useState } from "react";

const Review = ({ review }) => {
  const [showFull, setShowFull] = useState(false); // Trạng thái hiển thị đầy đủ nội dung

  return (
    <div className="flex relative mb-2 mt-2">
      {/* Review Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm w-[400px] mx-auto flex flex-col h-full">
        {/* Rating stars */}
        <div className="">
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
        <div className="mb-2">
          <span className="font-semibold text-xl">{review.userId.fullName}</span>
        </div>

        {/* Review content */}
        <p
          className={`text-gray-600 leading-relaxed mb-2 text-base italic transition-all duration-300 ease-in-out ${
            !showFull ? "line-clamp-3" : "h-auto"
          }`}
          style={{
            maxHeight: !showFull ? "6rem" : "none", // Giới hạn chiều cao khi chưa nhấn
            overflow: !showFull ? "hidden" : "initial", // Ẩn phần bị cắt bớt
          }}
          onClick={() => setShowFull(!showFull)}
        >
          "{review.feedback}"
        </p>

        {/* Date */}
        <p className="text-gray-400 text-sm mt-auto">
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
