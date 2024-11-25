import React, { useState, useEffect } from "react";
import axios from "axios";
import CartItem from "../../components/ItemCart/ItemCart";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import "../Cart/Cart.css"

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
            Authorization: `Bearer ${token}`,
          },
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
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Tính tổng giá của giỏ hàng
  const totalAmount = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="w-full p-4 flex flex-col lg:flex-row lg:justify-between gap-4">
      {/* Cart Items Section */}
      <div className="flex-1">
        <h1
          className="text-3xl text-center font-roboto font-bold mb-5 
             text-gray-800 bg-white p-4 rounded-lg shadow-md 
              sm:w-full lg:w-full 2xl:w-full"
        >
          Your Cart
        </h1>
        <div
          className="space-y-6 w-full h-[35rem] overflow-y-auto custom-scrollbar lg:w-full 2xl:h-[48rem] 2xl:w-[60rem] 2xl:ml-[10rem]"
        >
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

      {/* Summary Section */}
      <div className="w-full lg:w-[30%] bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 md:text-2xl lg:text-3xl">
          Summary
        </h2>
        {/* List of Items in Cart */}
        <div className="space-y-2 mb-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between ">
              <span className="text-sm font-roboto w-[15rem] flex-wrap italic sm:text-base md:text-lg lg:text-sm lg:w-[12rem] lg:truncate">
                {item.name}
              </span>
              <span className="text-sm font-roboto text-gray-600 sm:text-base md:text-lg lg:text-sm">
                ${item.price} x {item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center mb-2 ">
          <span className="text-lg font-medium sm:text-xl md:text-2xl">
            Total
          </span>
          <span className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
            ${totalAmount}
          </span>
        </div>

        {/* Checkout Button */}
        <Link to="/checkout">
          <button
            className="w-full bg-black text-white font-mono border-none
              cursor-pointer text-lg rounded-full py-2 px-1 hover:bg-gray
               hover:text-white
               font-semibold md:mt-[2rem] md:text-[1.5rem] "
          >
            Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
