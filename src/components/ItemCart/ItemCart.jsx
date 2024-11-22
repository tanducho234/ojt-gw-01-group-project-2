import React, { useState } from "react";

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(item._id, newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(item._id, newQuantity);
    }
  };

  const totalPrice = (item.price * quantity).toFixed(2);

  return (
    <div className="md:flex-row flex flex-row  items-center gap-4 p-4 bg-white shadow-md rounded-lg relative">
      {/* Image Section */}
      <div className="md:w-1/4 w-1/2 flex-shrink-0 mb-4 sm:mb-0">
        <img
          src={item.imgLink}
          alt={item.name}
          className="object-cover rounded-md w-full h-full"
        />
      </div>
      <div className="md:flex">
        {/* Information and Quantity Control Section */}
        <div className="flex-1 ml-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-600">Size: {item.size}</p>
            <p className="text-sm text-gray-600">Color: {item.color}</p>
          </div>
          <p className="text-lg font-bold text-gray-800">${totalPrice}</p>
        </div>

        <div className="flex flex-col ml-4 items-center justify-between flex-1">
          {/* Remove Button */}
          <button
            onClick={() => onRemove(item)}
            className="absolute top-2 right-2 bg-red-500 text-black p-2 rounded-full shadow-md hover:bg-red-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>

          {/* Quantity Controls */}
          <div className="flex items-center justify-evenly bg-gray-100 px-3 py-2 min-w-[160px] rounded-full shadow-sm mt-auto">
            <button onClick={handleDecrease}>
              <svg
                className="h-5 w-5 text-black-500 hover:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button onClick={handleIncrease}>
              <svg
                className="h-5 w-5 text-black-500 hover:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
