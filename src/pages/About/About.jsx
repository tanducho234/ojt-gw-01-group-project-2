import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-white">
      <div className="max-w-[1800px] mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="col-span-1 md:col-span-6">
            <img
              src="https://res.cloudinary.com/do9ekj0zm/image/upload/v1732245936/final_ojt_images/i4rrif8g6yl6iym1avch.png"
              alt="Fashion detail top"
              className="w-full h-[200px] md:h-[300px] object-cover grayscale"
            />
          </div>
          <div className="col-span-1 md:col-span-6">
            <img
              src="https://res.cloudinary.com/do9ekj0zm/image/upload/v1732245936/final_ojt_images/i4rrif8g6yl6iym1avch.png"
              alt="Fashion model"
              className="w-full h-[250px] md:h-[400px] object-cover grayscale"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="col-span-1 md:col-span-4 order-2 md:order-1">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">ABOUT US</h2>
              <p className="text-xl md:text-3xl text-gray-600 mb-6 leading-relaxed">
                Lashes - where fashion meets
                <br className="hidden md:block" />
                dynamism. Born from a burning
                <br className="hidden md:block" />
                passion for fashion, Lashes is
                <br className="hidden md:block" />
                dedicated to bringing you the most
                <br className="hidden md:block" />
                exceptional shopping experience.
              </p>
              <button className="px-6 py-1.5 bg-black text-white text-sm rounded-full">
                Explore
              </button>
            </div>
          </div>
          <div className="col-span-1 md:col-span-8 flex justify-center md:justify-end order-1 md:order-2">
            <img
              src="https://res.cloudinary.com/do9ekj0zm/image/upload/v1732245936/final_ojt_images/i4rrif8g6yl6iym1avch.png"
              alt="Fashion detail"
              className="w-full md:w-[875px] h-[300px] md:h-[400px] object-cover grayscale"
            />
          </div>
        </div>

        {/* White Pants and Hat Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="col-span-1 md:col-span-6">
            <img
              src="https://res.cloudinary.com/do9ekj0zm/image/upload/v1732245936/final_ojt_images/i4rrif8g6yl6iym1avch.png"
              alt="White pants"
              className="w-full h-[300px] md:h-[500px] object-cover grayscale"
            />
          </div>
          <div className="col-span-1 md:col-span-6">
            <img
              src="https://res.cloudinary.com/do9ekj0zm/image/upload/v1732245936/final_ojt_images/i4rrif8g6yl6iym1avch.png"
              alt="Model with hat"
              className="w-full h-[300px] md:h-[500px] object-cover grayscale"
            />
          </div>
        </div>

        {/* Large Hat and Text Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="col-span-1 md:col-span-6 ml-0 md:-ml-24">
            <img
              src="https://res.cloudinary.com/do9ekj0zm/image/upload/v1732245936/final_ojt_images/i4rrif8g6yl6iym1avch.png"
              alt="Model with large hat"
              className="w-full h-[400px] md:h-[600px] object-cover grayscale"
            />
          </div>
          <div className="col-span-1 md:col-span-6 flex flex-col justify-center px-4 md:pl-12">
            <div className="max-w-full md:max-w-[400px] text-center md:text-left">
              <p className="text-xl md:text-3xl text-gray-600 mb-6 leading-relaxed">
                With youthful, bold designs 
                <br className="hidden md:block" />
                and premium materials, 
                <br className="hidden md:block" />
                Lashes empowers you to 
                <br className="hidden md:block" />
                confidently express your unique style.
              </p>
              <p className="text-xl md:text-3xl text-gray-600 leading-relaxed">
                Our mission is to inspire 
                <br className="hidden md:block" />
                and connect people 
                <br className="hidden md:block" />
                through fashion, ensuring 
                <br className="hidden md:block" />
                you shine in every 
                <br className="hidden md:block" />
                situation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Images Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="col-span-1 md:col-span-6">
            <img
              src="https://res.cloudinary.com/do9ekj0zm/image/upload/v1732245936/final_ojt_images/i4rrif8g6yl6iym1avch.png"
              alt="Model in dress"
              className="w-full h-[300px] md:h-[500px] pb-1 object-cover grayscale"
            />
          </div>
          <div className="col-span-1 md:col-span-6 mt-0 md:-mt-8">
            <img
              src="https://res.cloudinary.com/do9ekj0zm/image/upload/v1732245936/final_ojt_images/i4rrif8g6yl6iym1avch.png"
              alt="Model in black"
              className="w-full h-[300px] md:h-[530px] object-cover grayscale"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;