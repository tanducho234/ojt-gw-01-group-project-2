import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const OrderSummary = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setOrders(response.data); // Adjust this based on your API response structure
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders");
        setLoading(true);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Shipped":
        return "bg-blue-100 text-blue-600";
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Canceled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-8 mb-8 max-w-4xl mx-auto space-y-8">
      {orders.map((order) => (
        <div
          key={order._id} // Use your API's unique order identifier
          className="border rounded-lg p-4 sm:p-6 shadow-md bg-white"
        >
          {/* Order Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <p className="text-gray-600 text-sm font-medium sm:text-base">
                <span className="font-normal">Order ID:</span> #{order._id}
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

          {/* Product Items */}
          <div className="space-y-4 sm:space-y-6">
            {order.products.map((item, index) => (
              <div
                className="flex items-start sm:items-center"
                key={item.productId}
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
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
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
  );
};

export default OrderSummary;
