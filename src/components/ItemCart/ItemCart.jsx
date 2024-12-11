import React, { useEffect, useState } from "react";
import "../../index.css";
import { Link } from "react-router-dom";

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(null);

  const handleIncrease = () => {
    if (quantity < item.availableQuantity) {
      const newQuantity = quantity + 1;
      onQuantityChange(item.productId, newQuantity, item.color, item.size);
    }
  };
  
  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      onQuantityChange(item.productId, newQuantity, item.color, item.size);
    }
  };

  const totalPrice = (item.price * quantity).toFixed(2);
  useEffect(() => {
    console.log("????")
    setQuantity(item.quantity);
  }, [item]);
  return (
    <div
      className="relative flex items-center font-roboto gap-4 bg-white 
    shadow-lg rounded-lg w-full mx-auto p-4 sm:w-[35rem] 2xl:w-full">
      {/* Nút xóa ở góc trên phải */}
      <button
        onClick={() => onRemove(item)}
        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600">
        <svg
          className="h-4 w-4 2xl:h-6 2xl:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      {/* Image Section */}
      <div className="flex-shrink-0">
        <img
          src={item.imgLink}
          alt={item.name}
          className="object-cover rounded-md w-[4.5rem] h-[4.5rem] sm:w-[8rem] sm:h-[8rem] 2xl:w-[14rem] 2xl:h-[14rem]"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between gap-2">
        {/* Product Info */}
        <div>
          <Link to={`/products/${item.productId}`}>
            <h2
              className="text-base font-roboto w-[10rem] font-semibold truncate 
          sm:w-[18rem] sm:text-lg max-[360px]:text-sm 
          max-[360px]:w-[8rem] 2xl:text-2xl 2xl:w-[35rem]">
              {item.name}
            </h2>
          </Link>
          <p
            className="text-xs font-roboto text-gray-600 
          sm:text-sm 2xl:text-xl">
            Size: {item.size}
          </p>
          <p
            className="text-xs font-roboto text-gray-600 
          sm:text-sm 2xl:text-xl">
            Color: {item.color}
          </p>
        </div>
        {/* Giá sản phẩm */}
        <p
          className="text-sm font-bold text-gray-800 
        sm:text-base 2xl:text-xl">
          ${totalPrice}
        </p>
      </div>
      {/* Quantity Controls ở góc dưới phải */}
      <div className="absolute bottom-8 right-3 flex items-center gap-2">
        <button
          onClick={handleDecrease}
          className="p-1 bg-gray-200 rounded-full">
          <svg
            className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12H9"
            />
          </svg>
        </button>
        <span className="text-sm font-semibold sm:text-base 2xl:text-xl min-w-10 text-center">
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          className="p-1 bg-gray-200 rounded-full">
          <svg
            className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9"
            />
          </svg>
        </button>
      </div>
      <div className="absolute bottom-2 right-3 text-xs font-semibold sm:text-sm 2xl:text-lg">
        <p className="text-gray-600">Available: {item.availableQuantity}</p>
      </div>
    </div>
  );
};

export default CartItem;
