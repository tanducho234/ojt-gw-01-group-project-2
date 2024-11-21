import React from "react";

function ProductCard({ product }) {
  const rating =
    product.totalReview > 0 ? product.totalRating / product.totalReview : 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const salePrice =
    product.salePercentage > 0
      ? Number(product.price * (1 - product.salePercentage / 100))
          .toFixed(2)
          .replace(/\.00$/, "")
      : product.price;

  return (
    <div className="rounded-lg w-[320px] text-left">
      <img
        src={product.generalImgLink}
        alt={product.name}
        className="w-[300px] h-[300px] rounded-lg transform transition-transform duration-500 hover:scale-110 hover:shadow-lg"
      />
      <div className="mt-3">
        <h3 className="font-bold text-[25px] font-sans mt-2 mb-2">
          {product.name}
        </h3>
        <div className="text-yellow-500 text-[20px] text-sm mb-2 flex items-center">
          {/* Full Stars */}
          {Array(fullStars)
            .fill()
            .map((_, index) => (
              <span key={`full-${index}`} className="text-yellow-500">
                ★
              </span>
            ))}
          {/* Half Star */}
          {hasHalfStar && (
            <span className="relative">
              <span className="absolute left-0 top-0 w-1/2 overflow-hidden text-yellow-500">
                ★
              </span>
              <span className="text-gray-300">★</span>
            </span>
          )}
          {/* Empty Stars */}
          {Array(emptyStars)
            .fill()
            .map((_, index) => (
              <span key={`empty-${index}`} className="text-gray-300">
                ★
              </span>
            ))}
          {/* Kiểm tra và hiển thị thông báo khi không có đánh giá */}
          {product.totalReview === 0 && (
            <span className="ml-2 text-gray-500 italic text-sm">
              No reviews yet.
            </span>
          )}
          {/* Giá trị rating */}
          {product.totalReview > 0 && (
            <span className="text-black text-xs ml-2">{rating.toFixed(1)}</span>
          )}
        </div>

        <div className="flex items-center text-black font-bold text-xl">
          <span className="mr-2">${salePrice}</span>
          {product.salePercentage > 0 && (
            <>
              <span className="text-gray-500 line-through mr-2 opacity-50">
                ${product.price}
              </span>
              <span className="bg-rose-300 text-red-600 text-lg font-light rounded-full px-2 py-0.5">
                {product.salePercentage}%
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
