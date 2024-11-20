import React from "react";

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-8 max-w-screen-xl mx-auto">
        {/* Left Column */}
        <div className="col-span-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-6">ABOUT US</h1>
          <p className="text-lg mb-6">
            Lashes – where fashion meets dynamism. Born from a burning passion
            for fashion, Lashes is dedicated to bringing you the most
            exceptional shopping experience.
          </p>
          <button className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800">
            Explore
          </button>
        </div>

        {/* Right Column: Image Grid */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <img
            src="https://via.placeholder.com/300x300"
            alt="Fashion 1"
            className="w-full h-full object-cover"
          />
          <img
            src="https://via.placeholder.com/300x300"
            alt="Fashion 2"
            className="w-full h-full object-cover"
          />
          <img
            src="https://via.placeholder.com/300x300"
            alt="Fashion 3"
            className="w-full h-full object-cover"
          />
          <img
            src="https://via.placeholder.com/300x300"
            alt="Fashion 4"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 max-w-screen-xl mx-auto mt-10">
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://via.placeholder.com/300x300"
            alt="Fashion 5"
            className="w-full h-full object-cover"
          />
          <img
            src="https://via.placeholder.com/300x300"
            alt="Fashion 6"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-lg mb-6">
            With youthful, bold designs and premium materials, Lashes empowers
            you to confidently express your unique style.
          </p>
          <p className="text-lg">
            Our mission is to inspire and connect people through fashion,
            ensuring you shine in every situation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
