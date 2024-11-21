import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Review from "../../components/Review/Review";
import axios from "axios";
import StarRating from "../../components/StarRating";
import Breadcrumb from "../../components/BreadCrumb";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
  </div>
);

const ProductDetail = () => {
  const product2 = {
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
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [salePrice, setSalePrice] = useState(0);
  const stars = Array.from({ length: 5 }, (_, index) =>
    index < Math.floor(product2.rating) ? "★" : "☆"
  );

  const breadcrumbPaths = [
    { name: "Products", link: "/products" },
    { name: "Product Detail", link: "" },
  ];

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const sizes = product2.size;
  const colors = product2.colors;

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  useEffect(() => {
    // Fetch product data using axios
    axios
      .get(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/products/${id}`
      )
      .then((response) => {
        setProduct(response.data);
        setSalePrice(
          response.data.salePercentage > 0
            ? Number(
                response.data.price * (1 - response.data.salePercentage / 100)
              )
                .toFixed(2)
                .replace(/\.00$/, "")
            : response.data.price
        );
        setSelectedColor(response.data.colors[0].color);

        setLoading(false);

        console.log(
          "asdasdasdasd",
          response.data,
          response.data.colors[0].color
        );
      })
      .catch((err) => {
        // setLoading(false);
        console.log("aaaaa");
      });
  }, [id]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb paths={breadcrumbPaths} />

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
                    alt="Main product2"
                    className="w-[520px] h-[570px] rounded-3xl object-cover cursor-pointer hover:opacity-75"
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full lg:w-1/2 space-y-6 mr-12  ">
              {/* Show loading spinner when data is loading */}

              <h1 className="text-3xl font-bold flex items-center gap-2">
                {product?.name || "Product Name Not Available"}
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full text-[gray]">
                {product?.soldQuantity > 0 ? `Sold: ${product?.soldQuantity} unit${product?.soldQuantity > 1 ? 's' : ''}` : "Has Not Been Sold Yet"}
                </span>
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating
                  rating={product.totalRating / product.totalReview}
                  size="text-2xl"
                />
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">${salePrice}</span>
                {product.salePercentage > 0 && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      ${product.price}
                    </span>
                    <span className="px-3 py-1 text-red-600 bg-red-100 rounded-full text-sm">
                      {product.salePercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 pb-4 pl-1 border-b">
                {product.description?.split("\n")[0]}
              </p>

              {/* Color Selection */}
              <div className="space-y-4 pb-4 border-b">
                <p className="pl-1">Select Color</p>
                <div className="flex flex-wrap gap-3">
                  {product.colors?.map((item) => (
                    <button
                      key={item.color}
                      onClick={() => handleColorSelect(item.color)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform
                    ${selectedColor === item.color ? "scale-110" : ""}
                  `}
                      style={{ backgroundColor: item.color.toLowerCase() }}>
                      {selectedColor === item.color && (
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
                  {selectedColor &&
                    product.colors
                      .filter((color) => color.color === selectedColor) // Find the selected color
                      .map((color) =>
                        color.sizes.map((size) => (
                          <button
                            key={size.size}
                            onClick={() => handleSizeSelect(size.size)}
                            className={`px-6 py-2 rounded-full transition-colors w-[100px]
                ${
                  selectedSize === size.size
                    ? "bg-black text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}>
                            {size.size}
                          </button>
                        ))
                      )}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex gap-4">
                <div className="flex items-center bg-gray-100 rounded-full">
                  <button
                    onClick={decrement}
                    className="w-14 h-12 flex items-center justify-center text-2xl rounded-l-full hover:bg-gray-200">
                    -
                  </button>
                  <span className="w-14 text-center text-lg">{quantity}</span>
                  <button
                    onClick={increment}
                    className="w-14 h-12 flex items-center justify-center text-2xl rounded-r-full hover:bg-gray-200">
                    +
                  </button>
                </div>
                <button
                  disabled={!selectedColor || !selectedSize}
                  onClick={() => {
                    if (!selectedSize) {
                      alert("Please select a size");
                      return;
                    }
                    alert(
                      `Added ${quantity} ${product.name} in ${selectedColor} color, size ${selectedSize} to cart`
                    );
                  }}
                  className={`w-[450px] h-12 text-white rounded-full transition-colors border-2 border-gray-300 p-2 ${
                    !selectedColor || !selectedSize
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
