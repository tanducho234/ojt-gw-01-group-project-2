import React from "react";

const ItemCheckout = ({ item }) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <div className="relative w-24 h-24">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover rounded-lg"
        />
        <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {item.quantity}
        </span>
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">
          Size: {item.size}, Color: {item.color}
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-800">${item.price * item.quantity}</p>
      </div>
    </div>
  );
};

export default ItemCheckout;
