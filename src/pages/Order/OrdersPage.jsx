import React, { useState, useRef, useEffect } from "react";

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const tabsRef = useRef(null); // Tham chiếu đến danh sách tabs
  const [isMouseInTabs, setIsMouseInTabs] = useState(false); // Kiểm tra chuột có trong phần tabs

  const tabs = ["All", "Confirming", "Preparing", "Delivering", "Returned", "Delivered", "Canceled"];

  const handleWheelScroll = (event) => {
    if (tabsRef.current && isMouseInTabs) {
      // Ngừng cuộn trang dọc và cuộn ngang trong phần tabs
      event.preventDefault();
      tabsRef.current.scrollLeft += event.deltaY;
    }
  };

  const handleMouseEnterTabs = () => {
    setIsMouseInTabs(true); // Khi chuột vào vùng tabs
  };

  const handleMouseLeaveTabs = () => {
    setIsMouseInTabs(false); // Khi chuột rời khỏi vùng tabs
  };

  useEffect(() => {
    // Thêm event listener cho cuộn chuột khi chuột vào vùng tabs
    window.addEventListener("wheel", handleWheelScroll, { passive: false });

    // Cleanup listener khi component unmount
    return () => {
      window.removeEventListener("wheel", handleWheelScroll);
    };
  }, [isMouseInTabs]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-auto"> {/* Giữ cuộn dọc */}
      {/* Sidebar */}
      <aside className="w-1/4 lg:w-1/5 bg-white p-6 border-r hidden md:block">
        <ul className="space-y-4">
          <li className="text-black font-medium">Account</li>
          <li className="bg-black text-white rounded-lg py-2 px-4">Orders</li>
          <li className="text-gray-600 hover:text-black cursor-pointer">Reviews</li>
          <li className="text-gray-600 hover:text-black cursor-pointer">Log out</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:w-4/5 p-10 ml-auto max-w-screen-lg">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold">Orders</h2>
        </div>

        {/* Tabs */}
        <div
          ref={tabsRef}
          onMouseEnter={handleMouseEnterTabs}
          onMouseLeave={handleMouseLeaveTabs}
          className="flex overflow-x-auto space-x-8 mb-10 pb-2 cursor-pointer scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#6B7280 #E5E7EB',
            overflowX: 'hidden', // Ẩn thanh cuộn ngang
            scrollBehavior: 'smooth', // Thêm hiệu ứng cuộn mượt mà
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-10 rounded-full border whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-black text-white border-black"
                  : "text-gray-600 border-gray-300 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-col items-center mt-20 pb-20">
          <img
            src="/assets/images/ord1.png"
            alt="No orders"
            className="mb-6"
          />
          <p className="text-gray-600 mb-4 text-center">
            You don't have any orders yet
          </p>
          <button className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800">
            Order Now →
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
