import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faTruck,
  faBoxOpen,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Button, message, Popconfirm } from "antd";
import { Steps } from "antd";
import { LoadingSpinner } from "./LoadingSpinner";
import Star from "./Star";

const OrderDetail = () => {
  const { orderId } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState({});
  const [steps, setSteps] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);

  // Group products by productId
  const groupProductsByProductId = (products) => {
    const grouped = {};
    products.forEach((item) => {
      if (!grouped[item.productId]) {
        grouped[item.productId] = {
          productId: item.productId,
          name: item.name,
          imgLink: item.imgLink,
          items: [],
          rating: 5,
          feedback: "",
        };
      }
      grouped[item.productId].items.push(`${item.color}, ${item.size}`);
    });

    return Object.values(grouped).map((product) => ({
      ...product,
      item: product.items.join("; "),
    }));
  };

  // Open modal with grouped products
  const openModal = () => {
    const grouped = groupProductsByProductId(order.products);
    setGroupedProducts(grouped);
    setRatings(
      grouped.map((product) => ({
        productId: product.productId,
        rating: product.rating,
        feedback: product.feedback,
      }))
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Update rating for a specific product
  const handleRatingChange = (productId, newRating) => {
    setRatings((prevRatings) =>
      prevRatings.map((item) =>
        item.productId === productId ? { ...item, rating: newRating } : item
      )
    );
  };

  // Update review text for a specific product
  const handleReviewChange = (productId, feedback) => {
    setRatings((prevRatings) =>
      prevRatings.map((item) =>
        item.productId === productId ? { ...item, feedback } : item
      )
    );
  };

  // Submit reviews for all products
  const handleSubmitReview = async () => {
    // Send the reviews to the API, for example, through a POST request
    try {
      const reviews = ratings.map((rating) => ({
        productId: rating.productId,
        rating: rating.rating,
        feedback: rating.feedback,
      }));
      let loadingmessage = message.loading("Submitting reviews...");
      console.log("Review data:", reviews);

      await axios.post(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/reviews",
        { orderId, reviews },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      closeModal();
      loadingmessage();
      message.success("Reviews submitted successfully!");
    } catch (error) {
      console.error("Error submitting reviews:", error);
      message.error("Failed to submit reviews.");
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  // Predefined reasons for cancellation
  const reasons = [
    "No longer needed",
    "Bought by mistake",
    "Better price available",
    "Wrong address",
    "Others",
  ];

  // Handlers
  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  const handleCancelOrder = async () => {
    if (!selectedReason) {
      message.error("Please select a reason before canceling the order"); // Thông báo lỗi
      return; // Ngăn thực thi tiếp
    }

    try {
      hideModal();
      const response = await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details/${order._id}`,
        { status: "Canceled", description: selectedReason }, // Gửi thêm lý do hủy
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Cập nhật trạng thái đơn hàng mới
      setOrder(response.data);

      // Map lại các bước trong status history
      const apiSteps = response.data.statusHistory.map((item) => ({
        status: item.status, // Map API status to local 'status'
        date: item.timestamp, // Use 'timestamp' for the time
        description: item.description,
      }));
      setSteps(apiSteps);

      message.success("Order canceled successfully");
      // Đóng modal sau khi hủy thành công
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
        description: item.description,
      }));
      console.log("data: ", response.data);

      setOrder(response.data);
      setSteps(apiSteps);
    } catch (error) {
      console.error("Failed to fetch steps from API", error);
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);
  const navigate = useNavigate();

  const handleReturnOrder = () => {
    navigate(`return`);
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        to="/profile/orders"
        className="text-gray-600 text-sm flex items-center mb-4"
      >
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
                )}`}
              >
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
                {order.products?.map((item, index) => (
                  <div className="flex items-start sm:items-center" key={index}>
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
                  status={
                    ["Canceled", "Returned"].includes(order.status)
                      ? "error"
                      : undefined
                  }
                  direction="vertical"
                  size="small"
                  current={steps.findIndex(
                    (step) => step.status === order.status
                  )}
                >
                  {steps.map((step, index) => (
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
                      }).format(new Date(step.date))}

                      // className={"step-returned"}
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
                        rel="noopener noreferrer"
                      >
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
                    {(
                      order.totalPrice -
                      order.shippingCost +
                      order.voucherDiscountAmount
                    ).toFixed(2)}
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
            <div className="max-w-md mx-auto mt-8 p-6">
              {order.status === "Delivered" && (
                <div className="max-w-md mx-auto mt-8 p-6">
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={handleReturnOrder}
                      className="bg-white font-bold text-red-600 border-[1px] border-rose-500 rounded-full py-2 px-10 hover:bg-pink-100 transition duration-300"
                    >
                      Return Order
                    </button>
                    <>
                      {order.isReviewed != true && (
                        <button
                          className="bg-black font-bold text-white py-2 px-10 rounded-full hover:bg-gray-600 transition duration-300"
                          onClick={openModal}
                        >
                          Send Review
                        </button>
                      )}
                    </>
                  </div>
                </div>
              )}
              {(order.status === "Pending" || order.status === "Preparing") && (
                <>
                  {/* Cancel Order Button */}
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                      onClick={showModal}
                      className="bg-white font-bold text-red-600 border border-rose-500 rounded-full py-2 px-10 hover:bg-pink-100 transition duration-300"
                    >
                      Cancel Order
                    </button>
                  </div>

                  {/* Modal Pop-up */}
                  {isModalVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                      <div className="bg-white rounded-xl shadow-lg p-6 w-[25rem] h-[26rem]">
                        {/* Modal Title */}
                        <h2 className="mt-8 text-lg font-bold mb-4 text-center">
                          Why are you canceling this order?{" "}
                          <span className="text-red-500">*</span>
                        </h2>
                        <p className="text-sm mb-4 text-gray-600 text-center">
                          Pick a reason from the options provided below:
                        </p>

                        {/* Radio Buttons for Reasons */}
                        <form>
                          {reasons.map((reason, index) => (
                            <label
                              key={index}
                              className="flex items-center ml-8 gap-2 mb-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="cancelReason"
                                value={reason}
                                checked={selectedReason === reason}
                                onChange={(e) =>
                                  setSelectedReason(e.target.value)
                                }
                                className="text-rose-500 focus:ring-rose-500"
                              />
                              <span className="text-gray-700">{reason}</span>
                            </label>
                          ))}
                        </form>

                        {/* Modal Buttons */}
                        <div className="flex justify-center gap-4 mt-6">
                          <button
                            onClick={hideModal}
                            className="bg-white font-bold text-black border border-black rounded-full py-4 px-12 hover:bg-rose-600 hover:text-white hover:border-none transition duration-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleCancelOrder}
                            className="bg-black font-bold text-white border border-white rounded-full py-4 px-12 hover:bg-gray-600 hover:text-black hover:border hover:border-black transition duration-300"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {order.status === "Delivering" && (
              <Popconfirm
                title="Are you sure you want to cancel this order?"
                onConfirm={handleCancelOrder}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <div className="max-w-md mx-auto mt-2 p-2">
                  <div className="flex justify-center gap-4 mt-2">
                    <Button
                      disabled
                      className="bg-white font-bold text-red-600 border border-rose-500 rounded-full py-2 px-10 hover:bg-pink-100 transition duration-300"
                    >
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-medium mb-4">Send Review</h2>
            <div className="space-y-4">
              {groupedProducts.map((product) => (
                <div key={product.productId} className="border-b pb-4 mb-4">
                  <div className="flex items-center mb-2">
                    <img
                      src={product.imgLink}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-gray-600 text-sm">
                        Items: {product.item}
                      </p>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="mb-2 flex item-center justify-center">
                    <Star
                      rating={
                        ratings.find((r) => r.productId === product.productId)
                          ?.rating || 5
                      }
                      onRatingChange={(newRating) =>
                        handleRatingChange(product.productId, newRating)
                      }
                    />
                  </div>
                  {/* Textarea for comments */}
                  <div>
                    <textarea
                      onChange={(e) =>
                        handleReviewChange(product.productId, e.target.value)
                      }
                      rows="4"
                      className="w-full p-2 border rounded-md"
                      placeholder="Write your review here..."
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
