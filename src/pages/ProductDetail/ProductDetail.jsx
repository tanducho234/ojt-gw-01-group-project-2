import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Review from "../../components/Review/Review";

const ProductDetail = () => {
  const product = {
    id: "1",
    name: "Summer Floral Dress",
    category: "Dress",
    price: 39.99,
    salePercentage: 20,
    colors: ["Red", "Blue", "Green", "Pink", "Black"],
    size: ["S", "M", "L", "XL"],
    dress_style: "Casual",
    img_url: "https://placehold.co/295x298",
    desc: "Absolutely love this dress! The fit is perfect, and the colors are so vibrant. Definitely my new go-to summer dress!",
    rating: 3,
    reviews: [
      {
        reviewer: "Alice W.",
        date: "2024-08-01",
        star: 5,
        feedback:
          "Absolutely love this dress! The fit is perfect, and the colors are so vibrant. Definitely my new go-to summer dress!",
      },
      {
        reviewer: "John D.",
        date: "2024-08-10",
        star: 4,
        feedback:
          "Great dress! The fabric feels nice, but I wish it came in more sizes. I had to go a size up, but still happy with the purchase.",
      },
      {
        reviewer: "Samantha R.",
        date: "2024-08-15",
        star: 3,
        feedback:
          "The dress is cute, but I found the material a bit thinner than I expected. It's still comfortable, just not as high quality as I hoped.",
      },
      {
        reviewer: "Rachel P.",
        date: "2024-08-20",
        star: 2,
        feedback:
          "I was really excited about this dress, but it didn't fit as well as I thought. The sizing seems off, and it's a bit too short for me.",
      },
      {
        reviewer: "Megan S.",
        date: "2024-09-01",
        star: 4,
        feedback:
          "Really happy with my purchase. The dress is comfy and looks great for casual outings.",
      },
    ],
  };

  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const stars = Array.from({ length: 5 }, (_, index) =>
    index < Math.floor(product.rating) ? "★" : "☆"
  );

  const salePrice = product.salePercentage > 0
    ? Number(product.price * (1 - product.salePercentage / 100))
      .toFixed(2)
      .replace(/\.00$/, '')
    : product.price;

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const sizes = product.size;
  const colors = product.colors;
  
  const handleColorSelect = (color) => setSelectedColor(color);
  const handleSizeSelect = (size) => setSelectedSize(size);
  
  const getSizeLabel = (size) => {
    if (size === "S") return "Small";
    if (size === "M") return "Medium";
    if (size === "L") return "Large";
    if (size === "XL") return "Extra Large";
  };

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 py-4">
        <a href="/" className="hover:underline">Home</a>
        <span className="mx-2">{">"}</span>
        <a href="/shop" className="hover:underline">Shop</a>
        <span className="mx-2">{">"}</span>
        <a href="/shop/products" className="hover:underline"></a>
        <span className="mx-2">{">"}</span>
        <span className="text-black font-semibold">T-shirts</span>
      </nav>

      {/* Product Container */}
      <div className="flex flex-wrap lg:flex-nowrap gap-8">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnail Images */}
            <div className="flex flex-wrap gap-2 md:flex-col md:gap-4">
              {[1, 2, 3].map((_, index) => (
                <img
                  key={index}
                  src="https://placehold.co/150x180"
                  alt={`Thumbnail ${index + 1}`}
                  className="w-[calc(33%-0.3rem)] md:w-[150px] h-auto rounded-3xl object-cover cursor-pointer hover:opacity-75"
                />
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1">
              <img
                src="https://placehold.co/400x500"
                alt="Main product"
                className="w-[520px] h-[570px] rounded-3xl object-cover cursor-pointer hover:opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 space-y-6 mr-12  ">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="text-2xl text-yellow-400">{stars.join(" ")}</div>
            <span className="text-xl text-gray-700">
              {product.rating}/5
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">${salePrice}</span>
            {product.salePercentage > 0 && (
              <>
                <span className="text-2xl text-gray-500 line-through">${product.price}</span>
                <span className="px-3 py-1 text-red-600 bg-red-100 rounded-full text-sm">
                  {product.salePercentage}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 pb-4 pl-1 border-b">{product.desc}</p>

          {/* Color Selection */}
          <div className="space-y-4 pb-4 border-b">
            <p className="pl-1">Select Color</p>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform
                    ${selectedColor === color ? 'scale-110' : ''}
                  `}
                  style={{ backgroundColor: color.toLowerCase() }}
                >
                  {selectedColor === color && (
                    <span className="text-white">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-4 pb-4 border-b">
            <p className="pl-1">Choose Size</p>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-6 py-2 rounded-full transition-colors
                    ${selectedSize === size 
                      ? 'bg-black text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                  {getSizeLabel(size)}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex gap-4">
            <div className="flex items-center bg-gray-100 rounded-full">
              <button
                onClick={decrement}
                className="w-14 h-12 flex items-center justify-center text-2xl rounded-l-full hover:bg-gray-200"
              >
                -
              </button>
              <span className="w-14 text-center text-lg">{quantity}</span>
              <button
                onClick={increment}
                className="w-14 h-12 flex items-center justify-center text-2xl rounded-r-full hover:bg-gray-200"
              >
                +
              </button>
            </div>
            <button
  onClick={() => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    alert(
      `Added ${quantity} ${product.name} in ${selectedColor} color, size ${selectedSize} to cart` 
    );
  }}
  className="w-[450px] h-12 bg-black text-white rounded-full hover:bg-gray-800 transition-colors border-2 border-gray-300 p-2"
>
  Add to Cart
</button>

          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ProductDetail;