import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Button, message, Popconfirm } from "antd"; // Import Popconfirm and message

const OrderDetail = () => {
  const { token } = useAuth();
  const location = useLocation();
  const { order } = location.state;
  const [storedOrder, setStoredOrder] = useState(order);

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

  // Confirm cancellation logic
  const handleCancelOrder = async () => {
    console.log("Order canceled:", order._id);
    try {
      const response = await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details/${order._id}`,
        {
          status: "Canceled",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStoredOrder(response.data);
      // If successful, show a success message
      message.success("Order canceled successfully");
    } catch (error) {
      // If there is an error, catch it and show an error message
      console.error("Error updating order status:", error.response ? error.response.data : error.message);
      message.error("Failed to cancel order");
    }
  };

  const cancel = () => {
    message.error("Order cancelation aborted");
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link to="/OrderSummary" className="text-gray-600 text-sm flex items-center mb-4">
        <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Back to orders
      </Link>

      <div className="border rounded-lg p-6 shadow-md bg-white">
        <div className="mb-6">
          <p className="text-gray-600 text-sm font-medium">
            <span className="font-normal">Order ID:</span> #{order._id}
          </p>
          <p className="text-gray-600 text-sm font-medium">
            <span className="font-normal">Order date:</span> {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-sm font-medium">
            <span className="font-normal">Status:</span> {storedOrder.status}
          </p>
          <p className="text-gray-600 text-sm font-medium">
            <span className="font-normal">Payment method:</span> {order.paymentMethod}
          </p>
          <p className="text-gray-600 text-sm font-medium">
            <span className="font-normal">Payment status:</span> {order.paymentStatus}
          </p>
          <p className="text-gray-600 text-sm font-medium">
            <span className="font-normal">Delivery discount:</span> {order.deliveryDiscount ? `$${order.deliveryDiscount}` : "None"}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {order.products.map((item) => (
            <div className="flex items-start sm:items-center" key={item.productId}>
              <img
                src={item.imgLink}
                alt={item.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md mr-4"
              />
              <div className="flex-1">
                <p className="font-medium text-sm sm:text-base">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.color}, {item.size}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm sm:text-base">${item.priceAtPurchase}</p>
                <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {order.status === "Delivered" && (
          <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={openReviewModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Send Review
            </button>
          </div>
        )}

        {order.status === "Delivering" && (
          <div className="mt-6 space-y-4">
            <button
              disabled
              className="bg-gray-100 text-gray-400 px-4 py-2 rounded-md cursor-not-allowed"
            >
              Cancel Order
            </button>
          </div>
        )}

        {storedOrder.status === "Pending" && (
          <div className="mt-6 space-y-4">
            <Popconfirm
              title="Are you sure you want to cancel this order?"
              onConfirm={handleCancelOrder}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Cancel Order</Button>
            </Popconfirm>
          </div>
        )}
      </div>

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
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetail;
