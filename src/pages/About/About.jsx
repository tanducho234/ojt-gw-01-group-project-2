import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-6">
            <img
              src="https://via.placeholder.com/400x200"
              alt="Fashion detail top"
              className="w-full h-[200px] object-cover grayscale"
            />
          </div>
          <div className="col-span-6">
            <img
              src="https://via.placeholder.com/800x500"
              alt="Fashion model"
              className="w-300 h-[300px] object-cover grayscale"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-4">
            <div>
              <h2 className="text-3xl font-bold mb-4">ABOUT US</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Lashes - where fashion meets
                <br />
                dynamism. Born from a burning
                <br />
                passion for fashion, Lashes is
                <br />
                dedicated to bringing you the most
                <br />
                exceptional shopping experience.
              </p>
              <button className="px-6 py-1.5 bg-black text-white text-sm rounded-full">
                Explore
              </button>
            </div>
          </div>
          <div className="col-span-8 flex justify-end">
            <img
              src="https://via.placeholder.com/400x300"
              alt="Fashion detail"
              className="w-[550px] h-[300px] object-cover grayscale"
            />
          </div>
        </div>

        {/* White Pants and Hat Section */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-6">
            <img
              src="https://via.placeholder.com/400x300"
              alt="White pants"
              className="w-full h-[320px] object-cover grayscale"
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

        {/* Large Hat and Text Section */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-6"style={{ marginLeft: "-95px" }}>
            <img
              src="https://via.placeholder.com/600x800"
              alt="Model with large hat"
              className="w-full h-[380px] object-cover grayscale"
            />
          </div>
          <div className="col-span-6 flex flex-col justify-center pl-12">
            <div className="max-w-[400px]">
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                With youthful, bold designs <br />
                and premium materials, <br />
                Lashes empowers you to <br />
                confidently express your unique style.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission is to inspire <br />
                and connect people <br />
                through fashion, ensuring <br />
                you shine in every <br />
                situation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Images Section */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-6">
            <img
              src="https://via.placeholder.com/600x800"
              alt="Model in dress"
              className="w-full h-[350px] pb-1 object-cover grayscale"
            />
          </div>
          <div className="col-span-6" style={{ marginTop: "-35px" }}>
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
