import React from "react";
import "../../index.css";
import { Link } from "react-router-dom";

function ProductCard({
  id = "#",
  name = "T-Shirt with Tape Details",
  imageUrl = "https://placehold.co/295x298?text=Default-Product-Image",
  price = "19.99",
  rating = 3.5,
  maxRating = 5,
  salePercentage = 20,
}) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const salePrice =
    salePercentage > 0
      ? Number(price * (1 - salePercentage / 100))
          .toFixed(2)
          .replace(/\.00$/, "")
      : price;

  return (
    <Link
      to={`${id}`}
      className=" w-full flex flex-col items-center text-left mx-auto"
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-[172px] h-[174px] !rounded-xl transform 
        transition-transform duration-500 hover:scale-110 hover:shadow-lx md:w-[200px] md:h-[202px] max-[820px]:w-[210px] max-[820px]:h-[212px] lg:w-[230px] lg:h-[232px] xl:w-[290px] xl:h-[292px] 2xl:w-[340px] 2xl:h-[342px]"
      />
      <div className="mt-3">
        <h3 className="font-bold text-[18px] font-sans mt-2 mb-2 md:text-[22px] xl:text-[24px]">
          {name}
        </h3>
        <div className="text-yellow-500 text-[16px] mb-2 flex items-center md:text[20px] xl:text-[22px]">
          {/* Full Stars */}
          {Array(fullStars)
            .fill()
            .map((_, index) => (
              <span key={`full-${index}`} className="text-yellow">
                ★
              </span>
            ))}
          {/* Half Star */}
          {hasHalfStar && (
            <span className="relative text-yellow">
              <span className="absolute left-0 top-0 w-1/2 overflow-hidden text-yellow">
                ★
              </span>
              <span className="text-black">★</span>
            </span>
          )}
          {/* Empty Stars */}
          {Array(emptyStars)
            .fill()
            .map((_, index) => (
              <span key={`empty-${index}`} className="text-black">
                ★
              </span>
            ))}
          {/* Kiểm tra và hiển thị thông báo khi rating bằng 0 */}
          {rating === 0 && (
            <span className="ml-2 text-gray-500 italic text-[11px] md:text-[13px]">
              No reviews yet.
            </span>
          )}
          {/* Giá trị rating */}
          {rating > 0 && (
            <span className="text-black text-[12px] ml-2 md:text-[14px]">
              {rating}/{maxRating}
            </span>
          )}
        </div>

        <div className="flex items-center text-black font-bold text-base">
          <span className="mr-2 text-[20px] md:text-[22px]">${salePrice}</span>
          {salePercentage > 0 && (
            <>
              <span className=" text-gray line-through text-[20px] mr-2 opacity-50 md:text-[22px]">
                ${price}
              </span>
              <span className="bg-rose-200 text-[#FF3333] text-[10px] font-light rounded-full px-2 py-0.5 md:text[12px]">
                {salePercentage}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
