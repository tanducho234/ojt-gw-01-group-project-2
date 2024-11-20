import React, { useState } from "react";
import CartItem from "../../components/ItemCart/ItemCart";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Product 1",
      size: "M",
      color: "Red",
      price: 29.99,
      quantity: 1,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Product 2",
      size: "L",
      color: "Blue",
      price: 49.99,
      quantity: 2,
      image: "https://via.placeholder.com/150",
    },
  ]);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Tính tổng giá của giỏ hàng
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ).toFixed(2); // Tính tổng tiền và định dạng với 2 chữ số thập phân

  return (
    <div className="max-w-6xl mx-auto mt-10 flex flex-col lg:flex-row gap-6">
      <div className="flex-1 lg:max-w-2/3">
        <h1 className="text-2xl font-bold mb-5">Your Cart</h1>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>
      </div>

      {/* Right Section: Total Amount Details */}
      <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        {/* List of Items in Cart */}
        <div className="space-y-2 mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-sm">{item.name}</span>
              <span className="text-sm text-gray-600">
                ${item.price} x {item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium">Total</span>
          <span className="text-lg font-bold text-gray-800">${totalAmount}</span>
        </div>
        
        {/* Checkout Button */}
        <button className="w-full bg-blue-500 text-white p-3 rounded-md mt-4 hover:bg-blue-600">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
