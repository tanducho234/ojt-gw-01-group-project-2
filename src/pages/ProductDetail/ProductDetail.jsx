import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Review from "../../components/Review/Review";
import StarRating from "../../components/StarRating";
import { useAuth } from "../../hooks/useAuth";
import { Tabs } from "antd";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Account from "../Profile/Account/Account";
import { HomeOutlined, ProductOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
  </div>
);

const ProductDetail = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [salePrice, setSalePrice] = useState(0);
  const [reviews, setReview] = useState([]);

  const items = [
    {
      key: "1",
      label: "Details",
      children: <pre>{product.description}</pre>,
    },
    {
      key: "2",
      label: "Reviews",
      children: (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-semibold">
              All review ({reviews.length})
            </span>
          </div>
          <div className="flex flex-wrap justify-evenly bg-[#f9fafd]  ">
            {reviews.map((review) => (
              <Review key={review._id} review={review} />
            ))}
          </div>
        </>
      ),
    },
  ];

  const breadcrumbPaths = [
    { name: "Products", link: "/products" },
    { name: "Product Detail", link: "" },
  ];

  const onChange = (key) => {
    console.log(key);
  };

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

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

    axios
      .get(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/reviews/product/${id}`
      )
      .then((response) => {
        console.log("review", response.data);
        setReview(response.data);
      })
      .catch((err) => {
        // setLoading(false);
        console.log("Ko tim thay review");
      });
  }, [id]);

  const handleAddToCart = async (productId, color, size, quantity) => {
    try {
      const url =
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/carts/add";
      const body = {
        productId: productId,
        color: color,
        size: size,
        quantity: quantity,
      };
      console.log("body", body);

      const response = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("This is a toast notification !", { theme: "grey" });
        // alert('Product added to cart successfully!');
      } else {
        alert("Failed to add product to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("An error occurred while adding product to cart.");
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container mx-auto px-4 ">
          {/* Breadcrumb */}
          <Breadcrumb
  className="h-10 mt-5" // Set a height of 12 Tailwind spacing units (~3rem)
  items={[
    {
      title: (
        <Link to="/home">
          <HomeOutlined />
        </Link>
      ),
    },
    {
      href: "",
      title: (
        <Link to="/products">
          <span>Products</span>
        </Link>
      ),
    },
    {
      title: product.name, // Dynamically showing the current product's name
    },
  ]}
/>


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
                  {product?.soldQuantity > 0
                    ? `Sold: ${product?.soldQuantity} unit${
                        product?.soldQuantity > 1 ? "s" : ""
                      }`
                    : "Has Not Been Sold Yet"}
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
                      style={{
                        backgroundColor: item.color.toLowerCase(),
                        color:
                          item.color === "White" || item.color === "Yellow"
                            ? "black"
                            : "white", // Change text color based on background
                        border:
                          selectedColor === item.color
                            ? "2px solid black"
                            : "2px solid gray",
                      }}
                    >
                      {selectedColor === item.color && (
                        <span className="">✓</span>
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
                }`}
                          >
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
                  disabled={!selectedColor || !selectedSize}
                  onClick={() => {
                    handleAddToCart(
                      product._id,
                      selectedColor,
                      selectedSize,
                      quantity
                    );
                  }}
                  className={`w-[450px] h-12 text-white rounded-full transition-colors border-2 border-gray-300 p-2 ${
                    !selectedColor || !selectedSize
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  Add to Cart
                </button>
                <ToastContainer />
              </div>
            </div>
          </div>

          <Tabs
            centered
            className="w-full"
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            size={1000}
          />
        </div>
      )}
    </>
  );
};
export default ProductDetail;
