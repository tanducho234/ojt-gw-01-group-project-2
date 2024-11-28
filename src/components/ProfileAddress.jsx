import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faLocationDot, faTrash } from "@fortawesome/free-solid-svg-icons"; // Add faTrash import

const AddressComponent = () => {
  const [showInput, setShowInput] = useState(false); // Quản lý modal
  const [newAddress, setNewAddress] = useState({
    street: "",
    district: "",
    city: "",
  }); // Lưu trữ thông tin địa chỉ
  const [addresses, setAddresses] = useState([]); // Danh sách địa chỉ

  // Hàm xử lý khi người dùng nhập dữ liệu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  // Hàm lưu địa chỉ mới
  const handleSave = () => {
    if (
      newAddress.street.trim() &&
      newAddress.district.trim() &&
      newAddress.city.trim()
    ) {
      setAddresses([...addresses, newAddress]); // Thêm địa chỉ mới vào danh sách
      setNewAddress({ street: "", district: "", city: "" }); // Reset form
      setShowInput(false); // Đóng modal
    }
  };

  // Hàm xóa địa chỉ
  const handleDelete = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index)); // Lọc và xóa địa chỉ tại vị trí index
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* Danh sách địa chỉ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full">
        {addresses.map((address, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex flex-col items-start bg-white shadow-md relative"
          >
            {/* Nút xóa */}
            <button
              onClick={() => handleDelete(index)}
              className="absolute top-2 right-2 text-red-600"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>

            <p className="text-gray-800 w-full font-medium overflow-auto whitespace-normal">
              <FontAwesomeIcon icon={faLocationDot} />
              {`${address.street}, ${address.district}, ${address.city}`}
            </p>
          </div>
        ))}
      </div>

      {/* Nút thêm địa chỉ */}
      <button
        onClick={() => setShowInput(true)}
        className="mt-6 bg-black text-white border-none cursor-pointer text-sm rounded-full py-2 px-3 hover:bg-gray hover:text-white font-semibold md:mt-[20px]"
      >
        <FontAwesomeIcon icon={faPlus} /> Add new address
      </button>

      {/* Modal thêm địa chỉ */}
      {showInput && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Add a New Address
            </h3>

            {/* Input: Street */}
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700">
                Street
              </label>
              <input
                type="text"
                name="street"
                value={newAddress.street}
                onChange={handleInputChange}
                placeholder="Enter street"
                className="mt-2 p-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Input: District */}
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700">
                District
              </label>
              <input
                type="text"
                name="district"
                value={newAddress.district}
                onChange={handleInputChange}
                placeholder="Enter district"
                className="mt-2 p-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Input: City */}
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                className="mt-2 p-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowInput(false)}
                className="bg-red-800 text-white py-1 px-4 rounded-full mr-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-black text-white py-1 px-4 rounded-full text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressComponent;
