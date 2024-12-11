import React, { useState, useEffect } from "react";
import { Steps } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

 const ShippingOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]); // State for all orders
  const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details/shipper",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      console.log("Fetched Orders:", data);
      setOrders(data);
      setFilteredOrders(data); // Initially show all orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(); // Fetch API data on component mount
  }, []);

  // Count orders by status
  const countOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  // Filter orders by status
  const filterOrdersByStatus = (status) => {
    if (status === "All") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === status);
      setFilteredOrders(filtered);
    }
  };

  // Possible status steps
  const statusSteps = ["Delivering", "Delivered", "Returned"];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-lg py-4 px-6 mb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src="assets/images/Logofast.png" alt="Logo" className="h-12" />
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Your Saved Packages</h1>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          {["All", ...statusSteps].map((status) => (
            <button
              key={status}
              onClick={() => filterOrdersByStatus(status)}
              className={`px-4 py-2 rounded-lg text-white ${
                status === "All"
                  ? "bg-gray-500 hover:bg-gray-600"
                  : status === "Delivering"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : status === "Delivered"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 shadow-md p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-gray-600">Your Tracked Packages</p>
          </div>
          {statusSteps.map((status) => (
            <div
              key={status}
              className="bg-gray-50 shadow-md p-4 rounded-lg text-center"
            >
              <p className="text-2xl font-bold">
                {countOrdersByStatus(status)}
              </p>
              <p className="text-gray-600">{status}</p>
            </div>
          ))}
        </div>

        {/* Order List */}
        <div className="overflow-y-auto max-h-[600px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col bg-gray-50 border border-gray-200 shadow-md rounded-lg p-4"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Order ID: {order._id}
                </h3>
                <h4 className="font-semibold mb-2">Status: {order.status}</h4>

                {/* Steps for Order Status */}
                
                <Steps

                  status={
                    ["Canceled", "Returned"].includes(order.status)
                      ? "error"
                      : undefined
                  }
                  direction="vertical"
                  size="small"
                  current={order.statusHistory.findIndex(
                    (step) => step.status === order.status
                  )}
                >
                  {order.statusHistory.map((step, index) => (
                    <Steps.Step
                      subTitle={step.description}
                      key={index}
                      title={step.status}
                      description={new Intl.DateTimeFormat("vi", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false, // 24-hour format
                      }).format(new Date(step.timestamp))}

                      // className={"step-returned"}
                    />
                  ))}
                </Steps>
                <div className="flex flex-1 items-end justify-center text-center ">

                <Link
                  to={`${order._id}`}
                  className="bg-black text-white py-2 px-4 rounded-lg w-full hover:bg-gray-800 mt-4"
                >
                  View details <FontAwesomeIcon icon={faChevronRight} />
                </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingOrders;