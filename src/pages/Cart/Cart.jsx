import React, { useState, useEffect } from "react";
import axios from "axios";
import CartItem from "../../components/ItemCart/ItemCart";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { token } = useAuth();

  // Fetch cart data from API
  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/carts",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCartItems(response.data || []); // Lấy danh sách sản phẩm từ `products`
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.productId !== id));
  };

  const handleQuantityChange = (id, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Tính tổng giá của giỏ hàng
  const totalAmount = cartItems
    .reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
    .toFixed(2);

  return (
    <div className="max-w-6xl mx-auto mt-10 flex flex-col lg:flex-row gap-6">
      <div className="flex-1 lg:max-w-2/3">
        <h1 className="text-2xl font-bold mb-5">Your Cart</h1>
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <CartItem
              key={index}
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
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between">
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
        <Link to="/checkout">
          <button className="w-full bg-black text-white p-3 rounded-md mt-4 hover:bg-gray-600">
            Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
