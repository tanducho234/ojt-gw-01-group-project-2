import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const ReturnOrder = () => {
  const { token } = useAuth();
  const [reason, setReason] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const [steps, setSteps] = useState([]);
  const navigate = useNavigate();

  const handleChange = (selectedOption) => {
    setReason(selectedOption.value);
  };

  const handleReturnOrder = async () => {
    if (!reason) {
      message.info("Please select a reason for returning the order.");
      return;
    }
    let loadingmessage = message.loading("Submitting reviews...");
    try {
      const response = await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details/${order._id}`,
        { status: "Returned", description: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrder(response.data);

      const apiSteps = response.data.statusHistory.map((item) => ({
        status: item.status,
        date: item.timestamp,
        description: item.description,
      }));
      setSteps(apiSteps);
      loadingmessage();
      message.success("Order returned successfully");

      navigate(-1);
    } catch (error) {
      loadingmessage();
      console.error(
        "Error updating order status:",
        error.response?.data || error.message
      );
      message.error("Failed to return order");
    }
  };
  const handleBack = () => {
    navigate(`/profile/orders/${orderId}`); // Navigate to the order details page
  };

  const fetchOrderDetails = async () => {
    if (!orderId) {
      console.error("Order ID is undefined. Cannot fetch order details.");
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

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
      setOrder(response.data);

      if (response.data.returnReason) {
        setReason(response.data.returnReason);
      }

      setError(null);
    } catch (err) {
      console.error("Failed to fetch order details", err);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setError("Order ID is missing.");
      setLoading(false);
    }
  }, [orderId]);

  const options = [
    { value: "", label: "Select reason here" },
    { value: "Product is defective", label: "Product is defective" },
    {
      value: "Wrong model, color, or size",
      label: "Wrong model, color, or size",
    },
    {
      value: "Product damaged during shipping",
      label: "Product damaged during shipping",
    },
    {
      value: "Product doesn’t fit or is not suitable",
      label: "Product doesn’t fit or is not suitable",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={handleBack} // Trigger the navigate function on click
        className="text-gray-600 text-sm flex items-center mb-4"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
        Back to order details
      </button>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-500"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Form Container */}
          <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Left Side: Order Details */}

            <div className="w-full lg:w-2/3 p-4 border bg-gray-100 rounded-lg">
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Register your return
                </h2>
                <p>
                  Here, select the items you would like to return from your
                  order and provide a detailed reason for order's return
                </p>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-4">
                Products in Order
              </h3>
              <div className="space-y-4">
                {order.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-gray-50 border rounded-lg"
                  >
                    <img
                      src={product.imgLink}
                      alt={product.name}
                      className="w-16 h-16 mr-4 rounded-md"
                    />
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-gray-600">
                        Color: {product.color} | Size: {product.size}
                      </p>
                      <p className="text-gray-800 font-semibold">
                        Quantity: {product.quantity}
                      </p>
                      <p className="text-gray-800 font-semibold">
                        Price: ${product.priceAtPurchase}
                      </p>
                    </div>
                  </div>
                ))}
                <h3 className="text-xl font-semibold mb-4">
                  Reason for Return
                </h3>
                <Select
                  value={options.find((option) => option.value === reason)}
                  onChange={handleChange}
                  options={options}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select reason here"
                />
              </div>
            </div>

            {/* Right Side: Return Form */}
            <div className="w-full lg:w-1/3 p-4 border bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Return Order</h2>
              <div className="flex flex-col space-y-2">
                <p className="break-words">
                  Order ID: #
                  <span className="font-bold text-wrap">{order._id}</span>
                </p>
                <p className="break-words">
                  Order Date:{" "}
                  <span className="font-bold">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={handleReturnOrder}
                  disabled={order.status !== "Delivered"}
                  className={`w-full bg-black text-white font-bold py-4 rounded-full cursor-pointer transition-all ${
                    order.status !== "Delivered"
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200 hover:text-black"
                  }`}
                >
                  Submit Return Request
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReturnOrder;
