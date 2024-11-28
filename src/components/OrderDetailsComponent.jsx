import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Button, message, Popconfirm } from "antd";
import { Steps } from "antd";

const OrderDetail = () => {
  const { token } = useAuth();
  const location = useLocation();
  const { order } = location.state;
  const [storedOrder, setStoredOrder] = useState(order);

  const calculateSubtotal = () => {
    return order.products.reduce((total, item) => {
      return total + item.priceAtPurchase * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [review, setReview] = useState(order.review || "");

  const openReviewModal = () => {
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleReviewSubmit = () => {
    console.log("Review submitted:", review);
    closeReviewModal();
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details/${order._id}`,
        { status: "Canceled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStoredOrder(response.data);
      message.success("Order canceled successfully");
    } catch (error) {
      console.error(
        "Error updating order status:",
        error.response?.data || error.message
      );
      message.error("Failed to cancel order");
    }
  };

  const cancel = () => {
    message.error("Order cancelation aborted");
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
  const getShippingMethod = (shippingCost) => {
    switch (shippingCost) {
      case 2:
        return "Economy";
      case 3.5:
        return "Standard";
      case 5:
        return "Express";
      default:
        return "Unknown";
    }
  };
  const steps = [
    {
      label: "Pending",
      description: "Order is being processed",
      status: "completed",
      date: "2024-11-25 10:00 AM",
    },
    {
      label: "Delivered",
      description: "Package delivered to courier",
      status: "completed",
      date: "2024-11-26 2:00 PM",
    },
    {
      label: "Delivered",
      description: "Order delivered to the recipient",
      status: "in-progress",
      date: "2024-11-27 3:30 PM",
    },
    {
      label: "Canceled",
      description: "Order was canceled by the customer",
      status: "pending",
      date: "2024-11-28 9:00 AM",
    },
  ];

  return (
    <div className="mt-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        to="/profile/orders"
        className="text-gray-600 text-sm flex items-center mb-4"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Back to orders
      </Link>
      {/* Order Details Title Section */}
      <div className="bg-white border rounded-lg p-6 shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-medium">Order ID: #{order._id}</h2>
            <p className="text-gray-600 text-sm">
              Order date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`mt-2 sm:mt-0 px-4 py-2 text-sm font-medium rounded-full ${getStatusStyle(
              storedOrder.status
            )}`}
          >
            {storedOrder.status}
          </span>
        </div>
      </div>

      {/* Products and Status History Section */}
      <div className="flex gap-6">
        {/* Products Section */}
        <div className="bg-white border rounded-lg p-6 shadow-md mb-6 flex-1">
          <h2 className="text-lg font-medium mb-4">Products</h2>
          <div className="space-y-4 sm:space-y-6">
            {order.products.map((item) => (
              <div
                className="flex items-start sm:items-center"
                key={item.productId}
              >
                <img
                  src={item.imgLink}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm sm:text-base">
                    {item.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {item.color}, {item.size}
                  </p>
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  <p className="font-medium text-sm sm:text-base">
                    ${item.priceAtPurchase}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status History Section */}
        <div className="  p-1">
        <h2 className="text-lg font-medium mb-4">History Status</h2>
          <div className="bg-white p-4 rounded shadow">
            <Steps
              progressDot
              direction="vertical"
              current={steps.findIndex((step) => step.status === "in-progress")}
              items={steps.map((step, index) => ({
                title: (
                  <span
                    className={
                      step.status === "completed" &&
                      index ===
                        steps.findIndex((s) => s.status === "in-progress") - 1
                        ? "text-black font-semibold"
                        : "text-gray-500"
                    }
                  >
                    {step.label}
                  </span>
                ),
                description: (
                  <span
                    className={
                      step.status === "completed" &&
                      index ===
                        steps.findIndex((s) => s.status === "in-progress") - 1
                        ? "text-black"
                        : "text-gray-500"
                    }
                  >
                    {`${step.description} - ${step.date}`}
                  </span>
                ),
                status:
                  step.status === "completed"
                    ? "finish"
                    : step.status === "in-progress"
                    ? "process"
                    : "wait",
              }))}
            />
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Payment Info */}
        {/* Need Help */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Payment</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span>{order.paymentStatus}</span>
            </div>
            {/* Conditional Button for Pending Payment Status */}
            {order.paymentStatus === "Pending" &&
              order.status !== "Canceled" && (
                <div className="flex justify-between mt-4">
                  <a
                    href={order.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                      Complete Payment
                    </button>
                  </a>
                </div>
              )}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Delivery</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span>{order.shippingAddress.recipientName}</span>{" "}
              {/* Added name field here */}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span>{order.shippingAddress.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span>{order.shippingAddress.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery method:</span>
              <span>{getShippingMethod(order.shippingCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment and Need Help */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Need Help?</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Info?</span>
              <span>{order.deliveryInfo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Returns?</span>
              <span>{order.returnPolicy}</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount:</span>
              <span>-${order.voucherDiscountAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ship Cost:</span>
              <span>+${order.shippingCost}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>${order.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        {order.status === "Delivered" && (
          <button
            onClick={openReviewModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Send Review
          </button>
        )}

        {storedOrder.status === "Pending" && (
          <Popconfirm
            title="Are you sure you want to cancel this order?"
            onConfirm={handleCancelOrder}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Cancel Order</Button>
          </Popconfirm>
        )}
        {storedOrder.status === "Delivering" && (
          <Popconfirm
            title="Are you sure you want to cancel this order?"
            onConfirm={handleCancelOrder}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button disabled>Cancel Order</Button>
          </Popconfirm>
        )}
      </div>

      {/* Modal for Review */}
      <Modal
        isOpen={isReviewModalOpen}
        onRequestClose={closeReviewModal}
        contentLabel="Review Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0"
      >
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-lg font-medium mb-4">Send Review</h2>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full h-32 border border-gray-300 rounded-lg p-2 mb-4"
            placeholder="Write your review here..."
          ></textarea>
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeReviewModal}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleReviewSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Submit Review
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetail;
