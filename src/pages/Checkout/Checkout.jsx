import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import ItemCheckout from "../../components/ItemCheckout/ItemCheckout";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, message, Popconfirm } from "antd";
import { set } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
  </div>
);

const Checkout = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await axios.get(
          "https://ojt-gw-01-final-project-back-end.vercel.app/api/vouchers/"
        );
        setDiscounts(response.data);
      } catch (error) {
        console.error("Failed to fetch discounts:", error);
      }
    };

    const fetchUserAddresses = async () => {
      try {
        const response = await axios.get(
          "https://ojt-gw-01-final-project-back-end.vercel.app/api/addresses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAddresses(response.data || []);
      } catch (error) {
        console.error("Failed to fetch user addresses:", error);
        alert("Unable to fetch addresses. Please try again later.");
      }
    };

    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          "https://ojt-gw-01-final-project-back-end.vercel.app/api/carts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCartItems(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch cart data:", error);
      }
    };

    fetchCartItems();
    fetchDiscounts();
    fetchUserAddresses();
  }, []);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");

  // Modal control
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  const [newAddress, setNewAddress] = useState({
    recipientName: "",
    phoneNumber: "",
    address: "",
  });

  const shippingCosts = {
    economy: 2.0,
    standard: 3.5,
    express: 5.0,
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
    setIsAddressModalOpen(false);
  };

  const handleApplyDiscount = async () => {
    const subtotal = calculateSubtotal();
    const selectedDiscount = discounts.find(
      (discount) => discount.code === discountCode && discount.isActive
    );
    const url = `https://ojt-gw-01-final-project-back-end.vercel.app/api/vouchers/check`;
    const requestBody = {
      orderValue: subtotal,
      code: discountCode || selectedDiscount.code,
    };

    try {
      // Gửi yêu cầu kiểm tra mã giảm giá
      const response = await axios.post(url, requestBody);
      const data = response.data;

      if (!data.canUse) {
        toast.error(data.message || "Discount code cannot be used!");
        return false;
      }

      // Kiểm tra và áp dụng mã giảm giá
      const selectedDiscount = data.voucher;

      if (!selectedDiscount) {
        toast.error("Invalid discount code or expired!");
        return false;
      }

      // Kiểm tra giá trị đơn hàng có đủ điều kiện không
      if (subtotal < selectedDiscount.minOrderValue) {
        toast.error(
          `Order must have a minimum value of $${selectedDiscount.minOrderValue.toFixed(
            2
          )} to apply this discount.`
        );
        return false;
      }

      // Áp dụng mã giảm giá
      if (selectedDiscount.discountAmount > 0) {
        setAppliedDiscount({
          type: "amount",
          value: selectedDiscount.discountAmount,
        });
      } else if (selectedDiscount.discountPercentage > 0) {
        setAppliedDiscount({
          type: "percentage",
          value: selectedDiscount.discountPercentage,
        });
      }

      toast.success("Discount applied successfully!");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while applying the discount."
      );
      return false;
    }
  };

  const handleAddNewAddress = async () => {
    if (
      !newAddress.recipientName ||
      !newAddress.phoneNumber ||
      !newAddress.address
    ) {
      toast.info("Please fill in all fields to add a new address.");
      return;
    }

    try {
      const response = await axios.post(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/addresses",
        {
          recipientName: newAddress.recipientName,
          phoneNumber: newAddress.phoneNumber,
          address: newAddress.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdAddress = {
        _id: response.data.address._id,
        recipientName: response.data.address.recipientName,
        phoneNumber: response.data.address.phoneNumber,
        address: response.data.address.address,
      };
      setAddresses((prevAddresses) => [...prevAddresses, createdAddress]);
      toast.success("Address added successfully!");
      setNewAddress({ recipientName: "", phoneNumber: "", address: "" });
    } catch (error) {
      console.error("Failed to add new address:", error);
      toast.error(
        "An error occurred while adding the address. Please try again."
      );
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + price * item.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount =
      appliedDiscount?.type === "amount"
        ? appliedDiscount.value
        : appliedDiscount?.type === "percentage"
        ? (subtotal * appliedDiscount.value) / 100
        : 0;
    const shippingCost = shippingCosts[shippingMethod];
    return subtotal - discount + shippingCost;
  };

  const handleConfirmOrder = async () => {
    console.log("Order confirmed!");

    // Find the selected shipping address
    const shippingAddress = addresses.find(
      (addr) => addr._id === selectedAddress
    );

    // Ensure a valid shipping address is selected
    if (!selectedAddress) {
      toast.info("Please select a shipping address.");
      return;
    }

    // Ensure a valid payment method is selected
    if (!paymentMethod) {
      toast.info("Please select a payment method.");
      return;
    }

    if (discountCode) {
      //check valid discount
      const isDiscountValid = await handleApplyDiscount();
      if (!isDiscountValid) return;
    }

    // Map cart items to the required format
    const products = cartItems.map((item) => ({
      productId: item.productId, // Assuming you have an _id for the product
      name: item.name, // Assuming the product has a name field
      color: item.color, // Assuming the product has a color field
      size: item.size, // Assuming the product has a size field
      quantity: item.quantity,
      imgLink: item.imgLink, // Assuming the product has an imgLink field
      priceAtPurchase: item.price, // Assuming the item price is in `price` field
    }));

    // Calculate the voucher discount amount (if any)
    const voucherDiscountAmount =
      appliedDiscount?.type === "amount"
        ? appliedDiscount.value
        : appliedDiscount?.type === "percentage"
        ? (calculateSubtotal() * appliedDiscount.value) / 100
        : 0;

    // Get the shipping cost based on the selected shipping method
    const shippingCost = shippingCosts[shippingMethod];

    // Calculate the total price
    const totalPrice = calculateTotal();

    // Construct the order details object
    const orderDetails = {
      products,
      shippingCost,
      voucherDiscountAmount: voucherDiscountAmount.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
      voucherCode: discountCode,
      shippingAddress: {
        recipientName: shippingAddress.recipientName,
        phoneNumber: shippingAddress.phoneNumber,
        address: shippingAddress.address,
      },
      paymentMethod,
    };

    // Log the order details (or send them to your backend)
    console.log("Order Details:", orderDetails);

    // Send the order details to your backend to process the order
    await axios
      .post(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details",
        orderDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const orderId = response.data._id;

        // If the payment method is "Stripe", redirect to the Stripe payment link
        if (paymentMethod === "Stripe" || paymentMethod === "VNPAY") {
          window.location.href = response.data.paymentLink; // Assuming the response contains a paymentLink field
        } else if (paymentMethod === "COD") {
          // If it's "COD", redirect to the success page with the order ID
          window.location.href = `/checkout/success/${orderId}`;
        }

        // Optionally, show a success message or perform other actions
        toast.success("Order confirmed successfully!");
        console.log("Order Response:", response.data);
      })
      .catch((error) => {
        toast.error(
          "There was an issue confirming your order. Please try again."
        );
      });
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <ToastContainer closeOnClick={true} />
          {cartItems.length === 0 ? (
            <div className="w-full py-12 rounded-lg shadow-md items-center justify-center text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Your Cart is Empty
              </h1>
              <img
                src="/images/emptycart.png"
                alt="Empty Cart"
                className="mx-auto mb-6 w-64 h-64 object-cover"
              />
              <p className="mb-4">
                Add some products to your cart to continue shopping.
              </p>
              <Link to="/products">
                <button className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105">
                  Continue Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col  md:flex-row gap-6">
              {/* Left Column */}
              <div className="flex-1 space-y-6">
                {/* Cart Items Section */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                  <div className="space-y-4 h-screen overflow-y-auto">
                    {cartItems.map((item, index) => (
                      <ItemCheckout key={index} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 space-y-6">
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                      Select or Add Shipping Address
                    </button>
                    {selectedAddress && (
                      <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold">
                          Selected Shipping Address
                        </h3>
                        <p className="mt-2">
                          <span className="font-semibold">Name: </span>
                          {
                            addresses.find(
                              (addr) => addr._id === selectedAddress
                            )?.recipientName
                          }
                        </p>
                        <p>
                          <span className="font-semibold">Phone: </span>
                          {
                            addresses.find(
                              (addr) => addr._id === selectedAddress
                            )?.phoneNumber
                          }
                        </p>
                        <p>
                          <span className="font-semibold">Address: </span>
                          {
                            addresses.find(
                              (addr) => addr._id === selectedAddress
                            )?.address
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Method Section */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Shipping Method
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    {["economy", "standard", "express"].map((method) => (
                      <button
                        key={method}
                        onClick={() => setShippingMethod(method)}
                        className={`lg:flex-1 py-2 px-4 rounded-lg text-white font-semibold w-full ${
                          shippingMethod === method
                            ? "bg-black"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}>
                        {method === "economy"
                          ? "Economy  ($2.00)"
                          : method === "standard"
                          ? "Standard  ($3.50)"
                          : "Express ($5.00)"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount Section */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Discount Code</h2>
                  <div className="flex gap-2">
                    {/* Input field with datalist */}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        list="available-discounts"
                        placeholder="Enter or select a discount code"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      />
                      <datalist id="available-discounts">
                        {discounts
                          .filter((discount) => discount.isActive)
                          .map((discount) => (
                            <option key={discount._id} value={discount.code}>
                              {discount.discountAmount > 0
                                ? `$${discount.discountAmount.toFixed(2)}`
                                : `${discount.discountPercentage}%`}
                              - (Min Order: ${discount.minOrderValue.toFixed(2)}
                              )
                            </option>
                          ))}
                      </datalist>
                    </div>
                    <button
                      onClick={
                        appliedDiscount
                          ? () => {
                              setAppliedDiscount(null);
                              setDiscountCode("");
                            }
                          : handleApplyDiscount
                      }
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                      {appliedDiscount ? "Reset" : "Apply"}
                    </button>
                  </div>
                  {appliedDiscount && (
                    <p className="mt-2 text-green-600">
                      Applied Discount:
                      {appliedDiscount.type === "amount"
                        ? `$${appliedDiscount.value.toFixed(2)}`
                        : `${appliedDiscount.value}%`}
                    </p>
                  )}
                </div>

                {/* Summary Section */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2 text-lg">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Cost:</span>
                      <span>${shippingCosts[shippingMethod].toFixed(2)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>
                          {appliedDiscount.type === "amount"
                            ? `-$${appliedDiscount.value.toFixed(2)}`
                            : `-$${(
                                (calculateSubtotal() * appliedDiscount.value) /
                                100
                              ).toFixed(2)}`}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      Cash on Delivery (COD)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="Stripe"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      Stripe Payment
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="VNPAY"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      VNPAY Payment
                    </label>
                  </div>
                </div>

                {/* Order Confirmation */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Order Confirmation
                  </h2>
                  <Popconfirm
                    title="Place Order"
                    description="Are you sure you want to place this order?"
                    onConfirm={handleConfirmOrder}
                    // onCancel={cancel}
                    okText="Yes"
                    cancelText="No">
                    <button
                      className="w-full bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600"
                      // disabled={!selectedAddress || !paymentMethod}
                      // onClick={handleConfirmOrder}
                    >
                      Confirm Order (${calculateTotal().toFixed(2)})
                    </button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Address Selection */}
          {isAddressModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[85vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">
                  Choose or Add Shipping Address
                </h2>
                <div className="space-y-4">
                  {addresses.map((address, index) => (
                    <div
                      key={address._id || index}
                      onClick={() => handleAddressSelect(address._id)}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
                      <p className="font-semibold">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="mr-2 text-gray-700"
                        />

                        {address.recipientName}
                      </p>
                      <p>
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="mr-2 text-gray-700"
                        />
                        {address.phoneNumber}
                      </p>
                      <p>
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="mr-2 text-gray-700"
                        />
                        {address.address}
                      </p>
                    </div>
                  ))}

                  {/* Button to Open Add Address Modal */}
                  <button
                    onClick={() => {
                      setIsAddressModalOpen(false); // Close Address Modal
                      setIsAddAddressModalOpen(true); // Open Add Address Modal
                    }}
                    className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                    Add New Address
                  </button>

                  <button
                    onClick={() => setIsAddressModalOpen(false)}
                    className="w-full mt-4 text-center text-black hover:text-gray-700">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Adding a New Address */}
          {isAddAddressModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="recipientName"
                    value={newAddress.recipientName}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        recipientName: e.target.value,
                      }))
                    }
                    placeholder="Recipient Name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={newAddress.phoneNumber}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    placeholder="Phone Number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <textarea
                    name="address"
                    value={newAddress.address}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Full Address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <button
                    onClick={() => {
                      handleAddNewAddress(); // Call Add Address Logic
                      setIsAddAddressModalOpen(false); // Close Add Address Modal
                      setIsAddressModalOpen(true); // Reopen Address Selection Modal
                    }}
                    className="w-full bg-black text-white py-2 px-4 rounded-lg mt-4 hover:bg-gray-600">
                    Save New Address
                  </button>
                  <button
                    onClick={() => {
                      setIsAddAddressModalOpen(false); // Close Add Address Modal
                      setIsAddressModalOpen(true); // Reopen Address Selection Modal
                    }}
                    className="w-full mt-4 text-center text-black hover:text-gray-700">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Checkout;
