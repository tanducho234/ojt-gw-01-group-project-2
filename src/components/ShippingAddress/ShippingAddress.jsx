import React, { useState } from "react";

const ShippingAddress = ({ addresses, onAddressSelect }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleSelect = (addressId) => {
    setSelectedAddress(addressId);
    if (onAddressSelect) {
      onAddressSelect(addressId);
    }
  };

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`p-4 border rounded-lg cursor-pointer ${
            selectedAddress === address.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          }`}
          onClick={() => handleSelect(address.id)}
        >
          <div className="font-bold text-lg">{address.name}</div>
          <div className="text-gray-700">📞 {address.phone}</div>
          <div className="text-gray-600">{address.address}</div>
        </div>
      ))}
    </div>
  );
};

export default ShippingAddress;
