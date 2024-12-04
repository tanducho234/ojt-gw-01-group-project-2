import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const AddressComponent = () => {
  const [showInput, setShowInput] = useState(false); // Manage modal visibility
  const [newAddress, setNewAddress] = useState({
    recipientName: "",
    phoneNumber: "",
    address: "",
  }); // Store new address
  const [addresses, setAddresses] = useState([]); // List of addresses
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
  const { token } = useAuth();

  // Fetch address list from server
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          "https://ojt-gw-01-final-project-back-end.vercel.app/api/addresses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAddresses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError("Failed to load addresses");
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token]);

  // Handle input changes for the new address
  const handleInputChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  // Handle adding a new address
  const handleAddNewAddress = async () => {
    if (!newAddress.recipientName || !newAddress.phoneNumber || !newAddress.address) {
      setSnackbar({ open: true, message: "Please fill in all fields.", severity: "error" });
      return;
    }

    if (!/^\d+$/.test(newAddress.phoneNumber)) {
      setSnackbar({ open: true, message: "Phone number must contain only numbers.", severity: "error" });
      return;
    }

    try {
      const response = await axios.post(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/addresses",
        newAddress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddresses([...addresses, response.data.address]);
      setSnackbar({ open: true, message: "Address added successfully!", severity: "success" });
      setShowInput(false);
      setNewAddress({ recipientName: "", phoneNumber: "", address: "" });
    } catch (err) {
      console.error("Failed to add address:", err);
      setSnackbar({ open: true, message: "Failed to add address.", severity: "error" });
    }
  };

  // Handle deleting an address
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/addresses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddresses(addresses.filter((address) => address._id !== id));
      setSnackbar({ open: true, message: "Address deleted successfully!", severity: "success" });
    } catch (err) {
      console.error("Failed to delete address:", err);
      setSnackbar({ open: true, message: "Failed to delete address.", severity: "error" });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center p-4">
      {/* Address list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address._id}
              className="border rounded-lg p-4 flex flex-col items-start bg-white shadow-md relative"
            >
              {/* Delete button */}
              <button
                onClick={() => handleDelete(address._id)}
                className="absolute top-2 right-2 text-red-600"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <p className="text-gray-800 font-medium">Recipient Name: {address.recipientName}</p>
              <p className="text-gray-800 font-medium">Phone Number: {address.phoneNumber}</p>
              <p className="text-gray-800 font-medium">Address: {address.address}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No addresses found. Add a new one!</p>
        )}
      </div>

      {/* Add address button */}
      <button
        onClick={() => setShowInput(true)}
        className="mt-6 bg-black text-white text-sm rounded-full py-2 px-3 hover:bg-gray-700 font-semibold"
      >
        <FontAwesomeIcon icon={faPlus} /> Add new address
      </button>

      {/* Add address modal */}
      {showInput && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target.classList.contains("fixed")) setShowInput(false);
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Add a New Address</h3>
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700">Recipient Name</label>
              <input
                type="text"
                name="recipientName"
                value={newAddress.recipientName}
                onChange={handleInputChange}
                placeholder="Enter recipient name"
                className="mt-2 p-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={newAddress.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="mt-2 p-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={newAddress.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="mt-2 p-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowInput(false)}
                className="bg-red-800 text-white py-1 px-4 rounded-full mr-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewAddress}
                className="bg-black text-white py-1 px-4 rounded-full text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddressComponent;
