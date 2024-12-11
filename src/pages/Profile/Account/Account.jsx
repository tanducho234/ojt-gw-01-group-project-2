import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import ProfileAddressUser from "../../../components/AddressProfileUser";
import { EditOutlined } from "@ant-design/icons";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { message } from "antd";

const ChangePasswordModal = ({ show, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Để lưu thông báo lỗi
  const [loading, setLoading] = useState(false); // Để theo dõi trạng thái đang tải

  const { token } = useAuth();

  const close = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  // Kiểm tra tính hợp lệ của các trường mật khẩu
  const validatePasswords = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return false;
    }

    // Kiểm tra độ dài mật khẩu
    if (newPassword.length < 8) {
      setError("New password must be at least 6 characters");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswords()) return;
    console.log("data", {
      currentPassword,
      newPassword,
    });

    try {
      let loadingmessage = message.loading("Changing password...");
      const response = await axios.post(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      loadingmessage();
      message.success("Change password successfully!");
      close();
    } catch (error) {
      console.log(error);
      message.error("Failed to change password.");
    }
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${
                    loading ? "bg-gray-400" : "bg-blue-500"
                  } text-white rounded-lg hover:bg-blue-600`}
                  disabled={loading} // Vô hiệu hóa nút khi đang tải
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

function AccountPage() {
  const [address, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({});
  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "other", // Add default value
    birthDate: "", // Add birthDate field
  });
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

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
          gender: response.data.gender || "other", // Set default value
          birthDate: response.data.birthDate || "", // Set default value
        });
        console.log("userdata", response.data);
      } catch (err) {
        console.error("Error fetching user", err);
        setError("Failed to fetch user");
      }
    };

    fetchAddresses().then(() => {
      fetchUserInformation().then(() => {
        setLoading(false);
      });
    });
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
          gender: updatedUserInfo.gender, // Send gender
          birthDate: updatedUserInfo.birthDate, // Send birthDate
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

  return (
    <section className="w-full mx-auto bg-white rounded-lg p-8 shadow">
      {!isEditing && <h2 className="text-2xl font-bold mb-6">Account</h2>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
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
                className="bg-black p-2 rounded-full absolute top-[-14px] right-[-9px] transform translate-x-3 z-10 w-13 h-13">
                <div>
                  <EditOutlined style={{ fontSize: "24px", color: "white" }} />
                </div>
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
              <div className="mb-4">
                <label className="block text-sm font-semibold">Gender</label>
                <select
                  name="gender"
                  value={updatedUserInfo.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold">
                  Birth Date
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={updatedUserInfo.birthDate?.split("T")[0]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-lg">
                  Save
                </button>
              </div>
            </form>
          )}

          <button
            className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            onClick={() => setShowChangePasswordModal(true)}>
            Change Password
          </button>

          <ChangePasswordModal
            show={showChangePasswordModal}
            onClose={() => setShowChangePasswordModal(false)}
          />

          <div>
            <ProfileAddressUser address={address} />
          </div>
        </>
      )}
    </section>
  );
}

export default AccountPage;
