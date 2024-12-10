import React, { useState } from "react";

const mockOrders = [
  {
    id: 1,
    shipmentNumber: "OJI202331120204",
    status: "Package being sent to recipient's address",
    details: [
      { time: "10:20", description: "Package being picked up" },
      { time: "11:09", description: "Package being sent to recipient's address" },
    ],
  },
  {
    id: 2,
    shipmentNumber: "NO1210914921231012",
    status: "Package successfully received",
    details: [
      { time: "09:21", description: "Package successfully received" },
    ],
  },
  {
    id: 3,
    shipmentNumber: "MK0120194123129190",
    status: "Package arrived",
    details: [
      { time: "05:05", description: "Package being picked up" },
      { time: "08:45", description: "Package arrived" },
    ],
  },
  {
    id: 4,
    shipmentNumber: "XY1234567890",
    status: "Package being sent to recipient's address",
    details: [
      { time: "12:00", description: "Package being picked up" },
      { time: "13:30", description: "Package being sent to recipient's address" },
    ],
  },
  {
    id: 5,
    shipmentNumber: "AB9876543210",
    status: "Package arrived",
    details: [
      { time: "02:15", description: "Package arrived" },
    ],
  },
  

];


export const ShippingOrders = () => {
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);

  // Tính số lượng đơn hàng theo trạng thái
  const countOrdersByStatus = (status) => {
    return mockOrders.filter((order) => order.status === status).length;
  };

  // Lọc đơn hàng theo trạng thái
  const filterOrdersByStatus = (status) => {
    if (status === "All") {
      setFilteredOrders(mockOrders);
    } else {
      const filtered = mockOrders.filter((order) => order.status === status);
      setFilteredOrders(filtered);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-lg py-4 px-6 mb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <img
            src="assets/images/Logofast.png"
            alt="Logo"
            className="h-12"
          />
          {/* Logout Button */}
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Your Saved Packages</h1>

        {/* Stats (Buttons to filter by status) */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => filterOrdersByStatus("All")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            All Orders
          </button>
          <button
            onClick={() => filterOrdersByStatus("Package being sent to recipient's address")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Delivering
          </button>
          <button
            onClick={() => filterOrdersByStatus("Package successfully received")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Delivered
          </button>
          <button
            onClick={() => filterOrdersByStatus("Package arrived")}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Returned
          </button>
        </div>

        {/* Stats (Number of orders by status) */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 shadow-md p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">{mockOrders.length}</p>
            <p className="text-gray-600">Your Tracked Packages</p>
          </div>
          <div className="bg-gray-50 shadow-md p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">
              {countOrdersByStatus("Package being sent to recipient's address")}
            </p>
            <p className="text-gray-600">Delivering</p>
          </div>
          <div className="bg-gray-50 shadow-md p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">
              {countOrdersByStatus("Package successfully received")}
            </p>
            <p className="text-gray-600">Delivered</p>
          </div>
          <div className="bg-gray-50 shadow-md p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">
              {countOrdersByStatus("Package arrived")}
            </p>
            <p className="text-gray-600">Returned</p>
          </div>
        </div>

        {/* Orders */}
        <div className="overflow-y-auto max-h-[400px] sm:max-h-[500px] md:max-h-[600px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 border border-gray-200 shadow-md rounded-lg p-4"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Shipment Number: {order.shipmentNumber}
                </h3>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Status: {order.status}</h4>
                  <ul className="relative pl-6">
                    {order.details.map((detail, index) => (
                      <li
                        key={index}
                        className="mb-2 text-sm flex items-start gap-2 relative"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === order.details.length - 1
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span>
                          <span className="font-bold">{detail.time}:</span>{" "}
                          {detail.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="bg-black text-white py-2 px-4 rounded-lg w-full hover:bg-gray-800">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
