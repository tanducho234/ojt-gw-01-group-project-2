import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

const OrderSummary = () => {
  const orderData = {
    id: "1234",
    date: "September 03, 2024",
    status: "Pending",
    items: [
      {
        name: "Product name",
        variant: "Black",
        size: "XL",
        price: 99,
        quantity: 1,
        imageUrl: "https://via.placeholder.com/50",
      },
      {
        name: "Product name",
        variant: "Green",
        size: "XL",
        price: 99,
        quantity: 1,
        imageUrl: "https://via.placeholder.com/50",
      },
    ],
    total: 198,
  };
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

  return (
    <div className="mt-8 max-w-4xl mx-auto border rounded-lg p-4 sm:p-6 shadow-md bg-white">
      {/* Order Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <p className="text-gray-600 text-sm font-medium sm:text-base">
            <span className="font-normal">Order ID:</span> #{orderData.id}
          </p>
          <p className="text-gray-600 text-sm font-medium sm:text-base">
            <span className="font-normal">Order date:</span> {orderData.date}
          </p>
        </div>
        <span
          className={`mt-2 sm:mt-0 px-4 py-2 text-sm font-medium rounded-full ${getStatusStyle(
            orderData.status
          )}`}
        >
          {orderData.status}
        </span>
      </div>

      {/* Product Items */}
      <div className="space-y-4 sm:space-y-6">
        {orderData.items.map((item, index) => (
          <div className="flex items-start sm:items-center" key={index}>
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-12 h-12 sm:w-16 sm:h-16 2xl:w-24 2xl:h-24 object-cover rounded-md mr-4"
            />
            <div className="flex-1">
              <p className="font-medium text-sm sm:text-base">{item.name}</p>
              <p className="text-gray-600 text-sm">
                {item.variant}, {item.size}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm sm:text-base">${item.price}</p>
              <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-6 border-t">
        <Link 
          to={`/order-details/${orderData.id}`} 
          className="text-black font-medium text-sm sm:text-base mb-2 sm:mb-0"
        >
          View details <FontAwesomeIcon icon={faChevronRight}/>
        </Link>
        <p className="font-normal text-sm sm:text-base">
          Grand total:{" "}
          <span className="text-base font-medium sm:text-lg">
            ${orderData.total}
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
