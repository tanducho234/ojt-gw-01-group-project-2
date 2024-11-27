import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('');

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="w-64 bg-white text-black h-screen flex flex-col border-r border-gray-300 transition-all duration-300 hover:w-80">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-300">
        <Link to="/" className="flex items-center gap-3">
          <FaCartShopping className="text-2xl text-black" />
          <span className="text-lg font-semibold">Home</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col mt-4 space-y-2">
        {/* Account */}
        <div
          className={`px-4 py-2 flex items-center cursor-pointer rounded-lg transition ${
            activeItem === 'account' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100 hover:font-bold hover:text-xl'
          }`}
          onClick={() => handleItemClick('account')}
        >
          <Link to="/account" className="text-lg w-full">
            <span className="pl-6 transition-all duration-300 hover:ml-4">Account</span>
          </Link>
        </div>

        {/* Orders */}
        <div
          className={`px-4 py-2 flex items-center cursor-pointer rounded-lg transition ${
            activeItem === 'orders' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100 hover:font-bold hover:text-xl'
          }`}
          onClick={() => handleItemClick('orders')}
        >
          <Link to="/orders" className="text-lg w-full">
            <span className="pl-6 transition-all duration-300 hover:ml-4">Orders</span>
          </Link>
        </div>

        {/* Reviews */}
        <div
          className={`px-4 py-2 flex items-center cursor-pointer rounded-lg transition ${
            activeItem === 'reviews' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100 hover:font-bold hover:text-xl'
          }`}
          onClick={() => handleItemClick('reviews')}
        >
          <Link to="/reviews" className="text-lg w-full">
            <span className="pl-6 transition-all duration-300 hover:ml-4">Reviews</span>
          </Link>
        </div>

        {/* Logout */}
        <div
          className={`px-4 py-2 flex items-center cursor-pointer rounded-lg transition ${
            activeItem === 'logout' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100 hover:font-bold hover:text-xl'
          }`}
          onClick={() => handleItemClick('logout')}
        >
          <Link to="/logout" className="text-lg w-full">
            <span className="pl-6 transition-all duration-300 hover:ml-4">Log out</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
