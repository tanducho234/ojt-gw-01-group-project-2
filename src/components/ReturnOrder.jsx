import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useAuth } from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import { message } from "antd";

const ReturnOrder = () => {
  const { token } = useAuth(); // Token from context
  const [reason, setReason] = useState(null); // State for return reason
  const [order, setOrder] = useState(null); // State to hold order details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { orderId } = useParams();
  const [steps, setSteps] = useState([]);

  const handleChange = (selectedOption) => {
    setReason(selectedOption.value);
  };

  const handleReturnOrder = async () => {
    if (!reason) {
      alert("Please select a reason before returning the order"); // Simple alert
      return;
    }

    try {
  
      const response = await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details/${order._id}`,
        { status: "Returned", description: reason }, // Send the return reason
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update order status and history
      setOrder(response.data);

      // Map API steps to local status history
      const apiSteps = response.data.statusHistory.map((item) => ({
        status: item.status,
        date: item.timestamp,
        description: item.description,
      }));
      setSteps(apiSteps);

      alert("Order returned successfully"); // Use simple alert
    } catch (error) {
      console.error(
        "Error updating order status:",
        error.response?.data || error.message
      );
      alert("Failed to return order");
    }
  };

  // Fetch order details
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

      // Set the return reason if available from the API
      if (response.data.returnReason) {
        setReason(response.data.returnReason); // Update reason from order data
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
    { value: "Wrong model, color, or size", label: "Wrong model, color, or size" },
    { value: "Product damaged during shipping", label: "Product damaged during shipping" },
    { value: "Product doesn’t fit or is not suitable", label: "Product doesn’t fit or is not suitable" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col space-y-6">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-500"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="p-4 border bg-gray-400 text-white rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Return Order</h2>
            <p className="mb-4">
              Order ID: <span className="font-bold">{order._id}</span>
            </p>
            <p>
              Order Date: <span className="font-bold">{order.createdAt}</span>
            </p>
          </div>

          <div className="w-full overflow-y-auto space-y-4">
            <h3 className="text-xl font-semibold mb-4">Products in Order</h3>
            {order.products.map((product) => (
              <div
                key={product.productId}
                className="flex items-center p-4 bg-gray-100 border rounded-lg"
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
          </div>

          <div className="w-full mt-6">
            <Select
              value={options.find((option) => option.value === reason)}
              onChange={handleChange}
              options={options}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select reason here"
            />
          </div>

          <div className="text-center mt-4">
            <button
              onClick={handleReturnOrder}
              className="bg-black text-white font-bold py-4 px-10 rounded-full cursor-pointer hover:bg-gray-200 hover:text-black transition-all"
            >
              Submit Return Request
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReturnOrder;
