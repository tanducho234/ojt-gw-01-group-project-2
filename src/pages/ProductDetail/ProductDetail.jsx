import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Review from "../../components/Review/Review";
import StarRating from "../../components/StarRating";
import { useAuth } from "../../hooks/useAuth";
import { Tabs, ConfigProvider } from "antd";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { useFetchData } from "../../hooks/useFetchData";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
  </div>
);

const ProductDetail = () => {
  const { token } = useAuth();
  const { updateCartItemCount } = useFetchData();
  const [loading, setLoading] = useState(true);
  //product quantaty

  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState(null);
  const [images, setImages] = useState([]);
  const [bigImage, setBigImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productQuantity, setProductQuantaty] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [product, setProduct] = useState({});
  const [salePrice, setSalePrice] = useState(0);
  const [reviews, setReview] = useState([]);

  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 6);

  const items = [
    {
      key: "2",
      label: "Details",
      children: (
        <div>
          {product.description?.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      ),
    },
    {
      key: "1",
      label: "Reviews",
      children: (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-semibold">
              All review ({reviews.length})
            </span>
          </div>
          <div className="flex flex-wrap justify-evenly bg-[#f9fafd]">
            {displayedReviews.map((review) => (
              <Review key={review._id} review={review} />
            ))}
          </div>
          {reviews.length > 6 && (
            <div className="mt-4 text-center">
              <button
                className="px-4 py-2 text-white bg-black rounded hover:bg-gray-600"
                onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show Less" : "Show All"}
              </button>
            </div>
          )}
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

  const increment = () =>
    setQuantity((prev) => (prev == productQuantity ? prev : prev + 1));
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const calculateSalePrice = (price, salePercentage) => {
    if (salePercentage > 0) {
      return Number(price * (1 - salePercentage / 100))
        .toFixed(2)
        .replace(/\.00$/, "");
    }
    return price;
  };

  const handleColorSelect = (item) => {
    setSelectedColor(item.color);
    setImages(item.imgLinks);
    setBigImage(item.imgLinks[0]);
    setSelectedSize(null);
    setProductQuantaty(null);
    setQuantity(1);
    setSalePrice(calculateSalePrice(product.price, product.salePercentage));
  };
  const handleSizeSelect = (size) => {
    setSelectedSize(size.size);
    setProductQuantaty(size.quantity);
    setCurrentPrice(size.price);
    setSalePrice(calculateSalePrice(size.price, product.salePercentage));

    setQuantity(1);
  };

  useEffect(() => {
    // Fetch product data using axios
    axios
      .get(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/products/${id}`
      )
      .then((response) => {
        setProduct(response.data);
        setCurrentPrice(response.data.price);

        setSalePrice(
          calculateSalePrice(response.data.price, response.data.salePercentage)
        );

        setSelectedColor(response.data.colors[0].color);
        setImages(response.data.colors[0].imgLinks);
        setBigImage(response.data.colors[0].imgLinks[0]);
        setLoading(false);

        console.log(
          "asdasdasdasd",
          response.data,
          response.data.colors[0].color
        );
      })
      .catch((err) => {
        setLoading(false);
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
        const totalQuantity = response.data.products.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        updateCartItemCount(totalQuantity);
        toast.success("Product added to cart successfully!");
        // alert('Product added to cart successfully!');
      } else {
        alert("Failed to add product to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Please login first to add products to cart");
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
                <div className="flex flex-wrap gap-2 md:flex-col md:gap-4 justify-center">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-[calc(33%-0.5rem)] md:w-[150px] h-auto rounded-3xl object-cover cursor-pointer hover:opacity-75 transition-all duration-200 ease-in-out ${
                        bigImage === image ? "border-4 border-black" : ""
                      }`}
                      onClick={() => setBigImage(image)}
                    />
                  ))}
                </div>

                {/* Main Image */}
                <div className=" flex flex-1">
                  <img
                    src={bigImage}
                    alt="Main product"
                    className="w-full h-auto rounded-3xl object-cover cursor-pointer hover:opacity-75 transition-all duration-200 ease-in-out"
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
                    ? `Sold: ${product?.soldQuantity} item${
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
                      ${currentPrice}
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
                      onClick={() => handleColorSelect(item)}
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
                      }}>
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
                            onClick={() => handleSizeSelect(size)}
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
                {/* productQuantity */}
                <div className="text-sm text-black pl-1 min-h-[20px]">
                  {selectedSize && `Available: ${productQuantity} items`}
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
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      if (val >= 0 && val <= productQuantity) {
                        setQuantity(val);
                      }
                    }}
                    className="w-20 text-center border-0 bg-gray-100 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={increment}
                    className="w-14 h-12 flex items-center justify-center text-2xl rounded-r-full hover:bg-gray-200">
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
                  }`}>
                  Add to Cart
                </button>
                <ToastContainer closeOnClick={true} />
              </div>
            </div>
          </div>
          <ConfigProvider
            theme={{
              components: {
                Tabs: {
                  colorText: "#8c8c8c",
                  colorTextActive: "#000000",
                  colorPrimary: "#000000",
                },
              },
            }}>
            <Tabs
              tabBarStyle={{
                color: "#000000",
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
                WebkitOverflowScrolling: "touch",
              }}
              tabBarGutter={{
                xs: 100,
                sm: 200,
                md: 300,
                lg: 500,
              }}
              centered={true}
              className="w-full"
              defaultActiveKey="1"
              items={items}
              onChange={onChange}
              size={{
                xs: "small",
                sm: "middle",
                md: "large",
              }}
            />
          </ConfigProvider>
        </div>
      )}
    </>
  );
};
export default ProductDetail;
