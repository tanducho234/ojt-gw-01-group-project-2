import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
  </div>
);

const Order = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const tabsRef = useRef(null);
  const [isMouseInTabs, setIsMouseInTabs] = useState(false);

  const tabs = [
    "All",
    "Pending",
    "Preparing",
    "Delivering",
    "Delivered",
    "Returned",
    "Canceled",
  ];

  const handleWheelScroll = (event) => {
    if (tabsRef.current && isMouseInTabs) {
      event.preventDefault();
      tabsRef.current.scrollLeft += event.deltaY;
    }
  };

  const handleMouseEnterTabs = () => setIsMouseInTabs(true);
  const handleMouseLeaveTabs = () => setIsMouseInTabs(false);

  useEffect(() => {
    window.addEventListener("wheel", handleWheelScroll, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheelScroll);
    };
  }, [isMouseInTabs]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setLoading(true);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Preparing":
        return "bg-pink-300 text-pink-800";
      case "Canceled":
        return "bg-red-200 text-red-600";
      case "Delivering":
        return "bg-blue-100 text-blue-600";
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Returned":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };


  // Lọc orders dựa trên tab được chọn
  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  return (
    <div className="flex">
      <main className="flex-1 w-full ml-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold">Orders</h2>
        </div>
        {/* Tabs */}
        <div
          ref={tabsRef}
          onMouseEnter={handleMouseEnterTabs}
          onMouseLeave={handleMouseLeaveTabs}
          className="flex space-x-8 pb-2 cursor-pointer"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#6B7280 #E5E7EB",
            overflowX: "hidden",
            scrollBehavior: "smooth",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-10 rounded-full border whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-black text-white border-black"
                  : "text-gray-600 border-gray-300 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            {filteredOrders && filteredOrders.length > 0 ? (
              <div className="mt-8 mb-8 w-full mx-auto space-y-8">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg p-4 sm:p-6 shadow-md bg-white"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                      <div>
                        <p className="text-gray-600 text-sm font-medium sm:text-base">
                          <span className="font-normal">Order ID:</span> #
                          {order._id}
                        </p>
                        <p className="text-gray-600 text-sm font-medium sm:text-base">
                          <span className="font-normal">Order date:</span>{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`mt-2 sm:mt-0 px-4 py-2 text-sm font-medium rounded-full ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      {order.products.map((item,index) => (
                        <div
                          className="flex items-start sm:items-center"
                          key={index}
                        >
                          <img
                            src={item.imgLink}
                            alt={item.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 2xl:w-24 2xl:h-24 object-cover rounded-md mr-4"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm sm:text-base">
                              {item.name}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {item.color}, {item.size}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm sm:text-base">
                              ${item.priceAtPurchase}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-6 border-t">
                      <Link
                        to={`${order._id}`}
                        state={{ order }}
                        className="text-black font-medium text-sm sm:text-base mb-2 sm:mb-0"
                      >
                        View details <FontAwesomeIcon icon={faChevronRight} />
                      </Link>
                      <p className="font-normal text-sm sm:text-base">
                        Grand total:{" "}
                        <span className="text-base font-medium sm:text-lg">
                          ${order.totalPrice}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src="/assets/images/ord1.png"
                  alt="No orders"
                  className="mb-6"
                />
                <p className="text-gray-600 mb-4 text-center">
                  No orders found for this category.
                </p>
                <Link to="/products">
                  <button className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800">
                    Shop Now →
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Order;
