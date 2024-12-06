import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faTruck,
  faBoxOpen,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

import Modal from "react-modal";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Button, message, Popconfirm } from "antd";
import { Steps } from "antd";
import { LoadingSpinner } from "./LoadingSpinner";

const OrderDetail = () => {
  const { orderId } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState({});
  const [steps, setSteps] = useState([]);

  const [loading, setLoading] = useState(true);

  const handleCancelOrder = async () => {
    try {
      const response = await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details/${order._id}`,
        { status: "Canceled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(response.data);

      const apiSteps = response.data.statusHistory.map((item) => ({
        status: item.status, // Map API status to local 'status'
        date: item.timestamp, // Use 'timestamp' for the time
      }));
      setSteps(apiSteps);

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
      case "Preparing":
        return "bg-pink-100 text-pink-600";
      case "Canceled":
        return "bg-red-100 text-red-600";
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
  // Gọi lại khi token thay đổi

  const fetchSteps = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apiSteps = response.data.statusHistory.map((item) => ({
        status: item.status, // Map API status to local 'status'
        date: item.timestamp, // Use 'timestamp' for the time
      }));
      setOrder(response.data);
      setSteps(apiSteps);
    } catch (error) {
      console.error("Failed to fetch steps from API", error);
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  useEffect(() => {
    console.log(orderId);

    fetchSteps();
  }, []);

  return (
    <div className="mt-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        to="/profile/orders"
        className="text-gray-600 text-sm flex items-center mb-4">
        <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Back to orders
      </Link>

      {/* Order Details Title Section */}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
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
                  order.status
                )}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Products and Status History Section */}
          <div className="flex gap-6">
            {/* Products Section */}
            <div className="bg-white border rounded-lg p-6 shadow-md mb-6 flex-1">
              <h2 className="text-lg font-medium mb-4">Products</h2>
              <div className="space-y-4 sm:space-y-6">
                {order.products?.map((item) => (
                  <div
                    className="flex items-start sm:items-center"
                    key={item.productId}>
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
                      <p className="text-gray-600 text-sm">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-medium text-sm sm:text-base">
                        ${item.priceAtPurchase}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History Section */}
            <div className="p-1">
              <h2 className="text-lg font-medium mb-4">History Status</h2>
              <div className="bg-white p-4 rounded shadow">
                <Steps
                  direction="vertical"
                  size="small"
                  current={steps.findIndex(
                    (step) => step.status === order.status
                  )}>
                  {steps.map((step, index) => (
                    <Steps.Step
                      key={index}
                      title={step.status}
                      description={new Intl.DateTimeFormat("vi", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false, // 24-hour format
                      }).format(new Date(step.date))}
                      className={step.status}
                    />
                  ))}
                </Steps>
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
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-gray-600 font-semibold">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="text-gray-600 font-semibold">
                    {order.paymentStatus}
                  </span>
                </div>
                {/* Conditional Button for Pending Payment Status */}
                {order.paymentStatus === "Pending" &&
                  order.paymentMethod !== "COD" &&
                  order.status !== "Canceled" && (
                    <div className="flex justify-between mt-4">
                      <a
                        href={order.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer">
                        <button className="bg-green-500 font-bold text-white px-4 py-2 rounded-full hover:bg-green-600">
                          Continue to Payment
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
                  <span className="text-gray-600 font-semibold ">
                    {order.shippingAddress?.recipientName}
                  </span>
                  {/* Added name field here */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="text-gray-600 font-semibold ">
                    {order.shippingAddress?.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-600 font-semibold ">
                    {order.shippingAddress?.phoneNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery method:</span>
                  <span className="text-gray-600 font-semibold ">
                    {getShippingMethod(order.shippingCost)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <hr />
          {/* Payment and Need Help */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Need Help?</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    <FontAwesomeIcon icon={faTruck} className="mr-2 text-lg" />
                    Delivery Info
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="ml-1 text-gray-600"
                    />
                  </span>
                  <span>{order.deliveryInfo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    <FontAwesomeIcon
                      icon={faBoxOpen}
                      className="mr-2 text-lg"
                    />
                    Returns
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="ml-1 text-gray-600"
                    />
                  </span>
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
                  <span className="text-gray-600 font-semibold">
                    $
                    {order.totalPrice -
                      order.shippingCost +
                      order.voucherDiscountAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-gray-600 font-semibold">
                    -${order.voucherDiscountAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ship Cost:</span>
                  <span className="text-gray-600 font-semibold">
                    +${order.shippingCost}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600 text-lg font-semibold">
                    Total:
                  </span>
                  <span className="text-black text-lg font-bold">
                    ${order.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-6">
            {order.status === "Delivered" && (
              <div class="max-w-md mx-auto mt-8 p-6">
                <div class="flex justify-center gap-4 mt-4">
                  {/* <button class="bg-white font-bold text-red-600 border-[1px] border-rose-500 rounded-full py-2 px-10 hover:bg-pink-100 transition duration-300">
                Return Order
              </button>
              <button class="bg-black font-bold text-white py-2 px-10 rounded-full hover:bg-gray-600 transition duration-300">
                Send Review
              </button> */}
                </div>
              </div>
            )}

            {order.status === "Pending" && (
              <Popconfirm
                title="Are you sure you want to cancel this order?"
                onConfirm={handleCancelOrder}
                onCancel={cancel}
                okText="Yes"
                cancelText="No">
                <div class="max-w-md mx-auto mt-8 p-6">
                  <div class="flex justify-center items-center gap-4 mt-4">
                    <Button
                      danger
                      className="bg-white font-bold text-red-600 border border-rose-500 rounded-full py-2 px-10 hover:bg-pink-100 transition duration-300">
                      Cancel Order
                    </Button>
                  </div>
                </div>
              </Popconfirm>
            )}
            {order.status === "Preparing" && (
              <Popconfirm
                title="Are you sure you want to cancel this order?"
                onConfirm={handleCancelOrder}
                onCancel={cancel}
                okText="Yes"
                cancelText="No">
                <div class="max-w-md mx-auto mt-8 p-6">
                  <div class="flex justify-center items-center gap-4 mt-4">
                    <Button
                      danger
                      className="bg-white font-bold text-red-600 border border-rose-500 rounded-full py-2 px-10 hover:bg-pink-100 transition duration-300">
                      Cancel Order
                    </Button>
                  </div>
                </div>
              </Popconfirm>
            )}
            {order.status === "Delivering" && (
              <Popconfirm
                title="Are you sure you want to cancel this order?"
                onConfirm={handleCancelOrder}
                onCancel={cancel}
                okText="Yes"
                cancelText="No">
                <div class="max-w-md mx-auto mt-2 p-2">
                  <div class="flex justify-center gap-4 mt-2">
                    <Button
                      disabled
                      className="bg-white font-bold text-red-600 border border-rose-500 rounded-full py-2 px-10 hover:bg-pink-100 transition duration-300">
                      Cancel Order
                    </Button>
                  </div>
                </div>
              </Popconfirm>
            )}
          </div>
        </>
      )}

      {/* Modal for Review */}
      {/* <Modal
        isOpen={isReviewModalOpen}
        onRequestClose={closeReviewModal}
        contentLabel="Review Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-lg font-medium mb-4">Send Review</h2>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full h-32 border border-gray-300 rounded-lg p-2 mb-4"
            placeholder="Write your review here..."></textarea>
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeReviewModal}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button
              onClick={handleReviewSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Submit Review
            </button>
          </div>
        </div>
      </Modal> */}
    </div>
  );
};

export default OrderDetail;
