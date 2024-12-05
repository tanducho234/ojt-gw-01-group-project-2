import React, { useState, useEffect } from "react";
import axios from "axios";
import CartItem from "../../components/ItemCart/ItemCart";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import "../Cart/Cart.css";
import { toast } from "react-toastify";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
  </div>
);

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  // Fetch cart data from API

  useEffect(() => {
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
        setCartItems(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch cart data:", error);
      }
    };

    fetchCartData();
  }, []);

  const onRemove = async (item) => {
    try {
      const url =
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/carts/remove";
      const body = {
        productId: item.productId,
        color: item.color,
        size: item.size,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(url, {
        data: body,
        ...config,
      });

      // Remove item locally
      setCartItems((prevItems) =>
        prevItems.filter(
          (cartItem) =>
            !(
              cartItem.productId === item.productId &&
              cartItem.color === item.color &&
              cartItem.size === item.size
            )
        )
      );

      toast.success("Item has been successfully removed from your cart!");
    } catch (error) {
      console.error("Error removing item:", error);
      alert(
        "An error occurred while removing the item from your cart. Please try again!"
      );
    }
  };

  const handleQuantityChange = async (productId, quantity, color, size) => {
    try {
      const url =
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/carts/update";
      const body = {
        productId,
        color,
        size,
        quantity,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(url, body, config);

      // Update quantity locally
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId &&
          item.color === color &&
          item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity. Please try again!");
    }
  };

  const totalAmount = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full p-4 flex flex-col lg:flex-row lg:justify-between gap-4">
          {cartItems.length === 0 ? (
            <div className="w-full py-12 rounded-lg shadow-md items-center justify-center text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Your Cart is Empty
              </h1>
              <img
                src="./././public/images/emptycart.png"
                alt="Empty Cart"
                className="mx-auto mb-6 w-64 h-64 object-cover"
              />
              <p className="mb-4">
                Add some products to your cart to continue shopping.
              </p>
              <Link to="/products">
                <button className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105">
                  Continue Shopping
                </button>
              </Link>
            </div>
          ) : (
            // Giao diện khi có sản phẩm trong giỏ hàng
            <>
              {/* Cart Items Section */}
              <div className="flex-1">
                <h1
                  className="text-3xl text-center font-roboto font-bold mb-5 
            text-gray-800 bg-white p-4 rounded-lg shadow-md 
            sm:w-full lg:w-full 2xl:w-full"
                >
                  Your Cart
                </h1>
                <div className="space-y-6 w-full h-[35rem] overflow-y-auto custom-scrollbar lg:w-full 2xl:h-[48rem] 2xl:w-[60rem] 2xl:ml-[10rem]">
                  {cartItems.map((item, index) => (
                    <CartItem
                      key={index}
                      item={item}
                      onRemove={onRemove}
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
              font-semibold md:mt-[2rem] md:text-[1.5rem]"
                  >
                    Checkout
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Cart;
