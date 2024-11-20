import React, { useState } from "react";
import ItemCheckout from "../../components/ItemCheckout/ItemCheckout";
import ShippingAddress from "../../components/ShippingAddress/ShippingAddress";

const Checkout = () => {
  const cartItems = [
    {
      id: 1,
      imageUrl: "https://via.placeholder.com/100",
      name: "Basic T-Shirt",
      size: "M",
      color: "White",
      quantity: 2,
      price: "15.00",
    },
    {
      id: 2,
      imageUrl: "https://via.placeholder.com/100",
      name: "Jeans",
      size: "32",
      color: "Blue",
      quantity: 1,
      price: "25.00",
    },
    {
      id: 3,
      imageUrl: "https://via.placeholder.com/100",
      name: "Jeans",
      size: "32",
      color: "Blue",
      quantity: 1,
      price: "25.00",
    },
    {
      id: 4,
      imageUrl: "https://via.placeholder.com/100",
      name: "Jeans",
      size: "32",
      color: "Blue",
      quantity: 1,
      price: "25.00",
    },
    {
      id: 5,
      imageUrl: "https://via.placeholder.com/100",
      name: "Jeans",
      size: "32",
      color: "Blue",
      quantity: 1,
      price: "25.00",
    },
    {
      id: 6,
      imageUrl: "https://via.placeholder.com/100",
      name: "Jeans",
      size: "32",
      color: "Blue",
      quantity: 1,
      price: "25.00",
    },
  ];

  const discounts = [
    {
      _id: "67356534e73a195a4e736eea",
      code: "SALE10$",
      type: "public",
      discountAmount: 10,
      discountPercentage: 0,
      minOrderValue: 50,
      isActive: true,
    },
    {
      _id: "67356534e73a195a4e736eed",
      code: "SALE15$",
      type: "public",
      discountAmount: 0,
      discountPercentage: 15,
      minOrderValue: 50,
      isActive: true,
    },
    {
      _id: "67356a42b889683851011ac5",
      code: "SALE30%",
      type: "public",
      discountAmount: 0,
      discountPercentage: 30,
      minOrderValue: 75,
      isActive: true,
    },
    {
      _id: "673581d4b889683851011acb",
      code: "SALE20%",
      type: "public",
      discountAmount: 0,
      discountPercentage: 20,
      minOrderValue: 100,
      isActive: true,
    },
  ];

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      phone: "123-456-7890",
      address: "123 ABC Street, XYZ City, California",
    },
    {
      id: 2,
      name: "Jane Smith",
      phone: "987-654-3210",
      address: "456 DEF Road, UVW City, New York",
    },
  ]);

  const [showAll, setShowAll] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingMethod, setShippingMethod] = useState("basic");

  // Modal control
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const shippingCosts = {
    economy: 2.0,
    basic: 3.5,
    express: 5.0,
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
    setIsAddressModalOpen(false); // Close the modal after selection
  };

  const handleApplyDiscount = () => {
    const selectedDiscount = discounts.find(
      (discount) => discount.code === discountCode && discount.isActive
    );

    if (selectedDiscount) {
      const subtotal = calculateSubtotal();

      // Check minOrderValue condition
      if (subtotal >= selectedDiscount.minOrderValue) {
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
      } else {
        alert(
          `Order must have a minimum value of $${selectedDiscount.minOrderValue.toFixed(
            2
          )} to apply this discount.`
        );
      }
    } else {
      alert("Invalid discount code or expired!");
    }
  };

  const handleAddNewAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      alert("Please fill in all fields to add a new address.");
      return;
    }

    const newAddressData = {
      id: addresses.length + 1,
      ...newAddress,
    };

    setAddresses((prevAddresses) => [...prevAddresses, newAddressData]);
    setNewAddress({
      name: "",
      phone: "",
      address: "",
    });
    setIsAddressModalOpen(false); // Close modal after adding address
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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Cart Items Section */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <ItemCheckout key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Select or Add Shipping Address
              </button>
              {selectedAddress && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold">
                    Selected Shipping Address
                  </h3>
                  <p className="mt-2">
                    <span className="font-semibold">Name:</span>{" "}
                    {
                      addresses.find((addr) => addr.id === selectedAddress)
                        ?.name
                    }
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {
                      addresses.find((addr) => addr.id === selectedAddress)
                        ?.phone
                    }
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {
                      addresses.find((addr) => addr.id === selectedAddress)
                        ?.address
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Method Section */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
            <div className="flex gap-2 flex-wrap">
              {["economy", "basic", "express"].map((method) => (
                <button
                  key={method}
                  onClick={() => setShippingMethod(method)}
                  className={`lg:flex-1 py-2 px-4 rounded-lg text-white font-semibold w-full ${
                    shippingMethod === method
                      ? "bg-blue-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  {method === "economy"
                    ? "Economy ($2.00)"
                    : method === "basic"
                    ? "Basic ($3.50)"
                    : "Express ($5.00)"}
                </button>
              ))}
            </div>
          </div>

          {/* Discount Section */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Discount Code</h2>
            <div className="flex gap-2">
              <select
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 w-1/2"
              >
                <option value="">Select a Discount Code</option>
                {discounts
                  .filter((discount) => discount.isActive)
                  .map((discount) => (
                    <option key={discount._id} value={discount.code}>
                      {discount.code} -{" "}
                      {discount.discountAmount > 0
                        ? `$${discount.discountAmount.toFixed(2)}`
                        : `${discount.discountPercentage}%`}
                    </option>
                  ))}
              </select>
              <button
                onClick={handleApplyDiscount}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
            {appliedDiscount && (
              <p className="mt-2 text-green-600">
                Applied Discount:{" "}
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
                      : `-${appliedDiscount.value}%`}
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
                  value="Online"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                Online Payment
              </label>
            </div>
          </div>

          {/* Order Confirmation */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Order Confirmation</h2>
            <button
              className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600"
              disabled={!selectedAddress || !paymentMethod}
            >
              Confirm Order (${calculateTotal().toFixed(2)})
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Address Selection */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              Choose or Add Shipping Address
            </h2>
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => handleAddressSelect(address.id)}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <p className="font-semibold">{address.name}</p>
                  <p>{address.phone}</p>
                  <p>{address.address}</p>
                </div>
              ))}
              <div className="flex justify-between">
                <button
                  onClick={handleAddNewAddress}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600"
                >
                  Add New Address
                </button>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="w-full mt-4 text-center text-blue-500 hover:text-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
