import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";

function AccountPage() {
  const [address, setAddresses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({});
  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const { token } = useAuth(); // Assuming useAuth() returns { token }

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
      } catch (err) {
        console.error("Error fetching addresses", err);
        setError("Failed to fetch addresses");
      } finally {
        setLoading(false);
      }
    };
    const fetchUserInformation = async () => {
      try {
        const response = await axios.get(
          "https://ojt-gw-01-final-project-back-end.vercel.app/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
        setUpdatedUserInfo({
          fullName: response.data.fullName,
          email: response.data.email,
          phone: response.data.phoneNumber,
        });
        console.log("userdata", response.data);
      } catch (err) {
        console.error("Error fetching user", err);
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAddresses();
      fetchUserInformation();
    } else {
      setError("No token found.");
      setLoading(false);
    }
  }, [token]); // Refetch if token changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/auth/profile", // API endpoint for updating
        {
          fullName: updatedUserInfo.fullName,
          email: updatedUserInfo.email,
          phoneNumber: updatedUserInfo.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If update is successful, update the user state with the new data
      setUser(response.data); // Update the user data from the API response
      setIsEditing(false); // Exit the editing mode
      alert("Account updated successfully!"); // Show success message
    } catch (err) {
      console.error("Failed to update user information", err);
      setError("Failed to update user information");
      alert("Failed to update account. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="w-[730px] mx-auto bg-white rounded-lg p-8 shadow">
      {!isEditing && <h2 className="text-2xl font-bold mb-6">Account</h2>}
      {!isEditing && (
        <p className="text-lg text-[#747474] mb-6">
          Explore your information here
        </p>
      )}
      {!isEditing && (
        <h2 className="text-[16px] font-bold mb-6">Basic information</h2>
      )}

      {!isEditing ? (
        <div className="relative shadow-[0px_0px_10px_0px_#00000033] rounded-lg p-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">{user.fullName}</h3>
            <div className="flex justify-between">
              <span className="">Email: {user.email}</span>
              <span>Phone: {user.phoneNumber}</span>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-black p-2 rounded-full absolute top-[-14px] right-[-9px] transform translate-x-3 z-10 w-13 h-13"
          >
            <img
              src="/images/iconedit.png"
              alt="Edit"
              className="w-full h-full object-contain"
            />
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdateAccount} className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Update account</h2>
          <p className="text-lg text-[#747474] mb-6">
            Update or modify your basic information here
          </p>
          <div className="mb-4">
            {/* Nhãn với dấu sao đỏ cho trường bắt buộc */}
            <label className="block text-sm font-semibold mb-2">
              Name <span className="text-red-500">*</span>
            </label>

            {/* Container bao gồm icon và input */}
            <div className="relative">
              {/* Icon nằm bên trái */}
              <img
                src="/images/IconName.png" // Đường dẫn hình ảnh icon
                alt="icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />

              {/* Trường nhập liệu có padding để không đè lên icon */}
              <input
                type="text"
                name="fullName"
                value={updatedUserInfo.fullName}
                onChange={handleInputChange}
                className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your name" // Thêm placeholder
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold">Email</label>
            <div className="relative">
              {/* Icon nằm bên trái */}
              <img
                src="/images/IconEmail.png" // Đường dẫn hình ảnh icon
                alt="icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            <input
              type="email"
              name="email"
              value={updatedUserInfo.email}
              onChange={handleInputChange}
              className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 bg-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
              readOnly
            />
          </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Phone</label>
            <div className="relative">
              {/* Icon nằm bên trái */}
              <img
                src="/images/IconPhone.png" // Đường dẫn hình ảnh icon
                alt="icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            <input
              type="text"
              name="phone"
              value={updatedUserInfo.phone}
              onChange={handleInputChange}
              className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default AccountPage;
