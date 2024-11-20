import React from "react";

const AboutUs = () => {
  return (
    <div className="about-us-page bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Very Top Image */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-6">
            <img
              src="https://via.placeholder.com/400x200"
              alt="Fashion detail top"
              className="w-full h-[200px] object-cover grayscale"
            />
          </div>
          <div className="col-span-6 flex justify-center">
            <img
              src="https://via.placeholder.com/800x500"
              alt="Fashion model"
              className="w-[full] h-[250px] object-cover grayscale"
            />
          </div>
        </div>

        {/* First Row */}
        <div className="grid grid-cols-22 gap-6 mb-6">
          {/* Text Column */}
          <div className="col-span-4 flex items-center space-x-500">
            <div className="mb-200">
              <h2 className="text-xl font-bold mb-4">ABOUT US</h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Lashes - where fashion meets<br></br> dynamism. Born from a burning<br></br>
                passion for fashion, Lashes is<br></br> dedicated to bringing you the
                most<br></br> exceptional shopping experience.
              </p>
              
              <button className="px-6 py-1.5 bg-black text-white text-sm rounded-sm">
                Explore
              </button>
            </div>

            <div className="col-span-8 flex justify-center">
            <img 
              src="https://via.placeholder.com/400x300"
              alt="Fashion detail"
              className="w-400 h-[300px] object-cover grayscale"
            />
            </div>
          </div>

        </div>

        {/* Second Row - Right Side Image */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-8"></div>
          
        </div>

        {/* Third Row - Left Side Images */}
        <div className="flex justify-center  grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-6">
            <img
              src="https://via.placeholder.com/400x300"
              alt="White pants"
              className=" w-full h-[320px] object-cover grayscale mb-6"
            />
          </div>
          <div className="col-span-6">
            <img
              src="https://via.placeholder.com/400x300"
              alt="Model with hat"
              className="w-full h-[320px] object-cover grayscale"
            />
          </div>
        </div>

        {/* Fourth Row - Large Hat Image and Text */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-6">
            <img
              src="https://via.placeholder.com/600x800"
              alt="Model with large hat"
              className="w-full h-[380px] object-cover grayscale"
            />
          </div>
          <div className="col-span-6 flex flex-col justify-center pl-12">
            <div className="max-w-[400px]">
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                With youthful, bold designs <br></br> and premium materials, <br></br> Lashes
                empowers you to<br></br> confidently express your unique style.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our mission is to inspire and connect people through fashion,
                ensuring you shine in every situation.
              </p>
            </div>
          </div>
        </div>

        {/* Last Row - Two Large Images */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-6 flex flex-col justify-end h-full">
            <img
              src="https://via.placeholder.com/600x800"
              alt="Model in dress"
              className="w-full h-[350px] pb-1 object-cover grayscale"
            />
          </div>

          <div className="col-span-6">
            <img
              src="https://via.placeholder.com/600x800"
              alt="Model in black"
              className="w-full h-[380px] object-cover grayscale"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
