import React, { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";

import ProductCard from "../../components/ProductCard/ProductCard";
import "../../index.css";

import "../../pages/Products/Products.css";
import axios from "axios";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";
import { useFetchData } from "../../hooks/useFetchData";
import { useLocation, useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import style của toastify

// import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
  </div>
);

function Products() {
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // State to hold the filter values
  const [showFilters, setShowFilters] = useState(false);
  const [price, setPrice] = useState([25, 200]);
  const minPrice = 0;
  const maxPrice = 200;
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // New state for category
  const [selectedDressStyle, setSelectedDressStyle] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(""); // Add state for dress style

  const { categories, styles, brands } = useFetchData();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12); // Number of products per page
  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const [sortCriteria, setSortCriteria] = useState("");
  const [queryString, setQueryString] = useState(window.location.search);
  const handleSortChange = (e) => {
    const selectedSortCriteria = e.target.value;
    console.log(selectedSortCriteria);
    if (!selectedSortCriteria) return; // No selection (e.g., "Select...")

    const [sortBy, order] = selectedSortCriteria
      .split("&")
      .map((param) => param.split("=")[1]);

    const searchParams = new URLSearchParams(window.location.search);

    searchParams.set("sortBy", sortBy); // Set the sortby parameter
    searchParams.set("order", order);

    navigate({
      pathname: location.pathname, // Keep the same path
      search: `?${searchParams.toString()}`, // Update the query string
    });

    setSortCriteria(selectedSortCriteria); // Update the sort criteria state
  };

  const handleSliderChange = (index, value) => {
    setPrice((prevPrice) => {
      const newPrice = [...prevPrice];

      // Ensure the value is within min/max range
      const clampedValue = Math.max(minPrice, Math.min(maxPrice, value));

      // Prevent sliders from crossing each other and ensure at least a 10-gap
      if (index === 0) {
        // Left slider: Make sure the gap is at least 10
        newPrice[0] = Math.min(clampedValue, newPrice[1] - 10);
      } else {
        // Right slider: Make sure the gap is at least 10
        newPrice[1] = Math.max(clampedValue, newPrice[0] + 10);
      }

      return newPrice;
    });
  };

  // Function to handle filter application
  // Function to handle filter application
  const applyFilters = () => {
    // let filtered = products;

    // // Filter by price range
    // filtered = filtered.filter((product) => {
    //   const effectivePrice =
    //     product.salePercentage !== 0
    //       ? product.price - (product.price * product.salePercentage) / 100
    //       : product.price;

    //   return effectivePrice >= price[0] && effectivePrice <= price[1];
    // });

    // // Filter by selected color (if any)
    // if (selectedColor) {
    //   filtered = filtered.filter((product) =>
    //     product.colors.some((colorObj) => colorObj.color === selectedColor)
    //   );
    // }

    // // Filter by selected size (if any)
    // if (selectedSize) {
    //   filtered = filtered.filter((product) =>
    //     product.colors.some((color) =>
    //       color.sizes.some((size) => size.size === selectedSize)
    //     )
    //   );
    // }

    // // Filter by selected category (if any)
    // if (selectedCategory) {
    //   filtered = filtered.filter(
    //     (product) => product.categoryId === selectedCategory
    //   );
    // }

    // // Filter by selected dress style (if any)
    // if (selectedDressStyle) {
    //   filtered = filtered.filter(
    //     (product) => product.styleId === selectedDressStyle
    //   );
    // }

    // // Filter by selected brand (if any)
    // if (selectedBrand) {
    //   filtered = filtered.filter(
    //     (product) => product.brandId === selectedBrand
    //   );
    // }

    // // Update filtered products with the result
    // setFilteredProducts(filtered);

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("price", `${price[0]}-${price[1]}`);
    searchParams.set("color", selectedColor);
    searchParams.set("size", selectedSize);
    searchParams.set("category", selectedCategory);
    searchParams.set("style", selectedDressStyle);
    searchParams.set("brand", selectedBrand);
    // console.log("searchParams", searchParams);

    navigate({
      pathname: location.pathname, // Keep the same path
      search: `?${searchParams.toString()}`, // Update the query string
    });
    // Reset to the first page after applying filters
    // setQueryString(window.location.search);
    setCurrentPage(1);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 970) {
        // sm
        setProductsPerPage(12); // Show 6 products per page on small screens
      } else {
        setProductsPerPage(12); // Show 9 products per page on larger screens
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Add event listener for window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up event listener
    };
  }, []);

  // Function to handle filter changes
  useEffect(() => {
    setLoading(true);
    console.log("locationchange", location.search);
    const queryParams = new URLSearchParams(location.search);

    // const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryParams);
    const hasSortBy = searchParams.has("sortBy");
    if (hasSortBy) {
      const sortByValue = searchParams.get("sortBy");
      const orderValue = searchParams.get("order");

      setSortCriteria("sortBy=" + sortByValue + "&order=" + orderValue);
    }

    // Gọi API sản phẩm với query string đầy đủ
    // fetchProducts(queryString);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          // `https://ojt-gw-01-final-project-back-end.vercel.app/api/products?${queryParams}`
          `http://localhost:3000/api/products?${queryParams}`
        );
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, [location]); // Empty dependency array to run only once on component mount
  // Empty dependency array to run only once on component mount

  // Get products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex w-full flex-wrap p-5">
      <ToastContainer closeOnClick={true} />

      <aside
        className={`absolute z-20 mt-[60px] bg-white  border rounded-t-lg top-0 left-0 rounded-2xl shadow-2xl shadow-gray h-[1250px] 
           p-3 transition-transform duration-300 max-[540px]:h-[80rem] md:h-[1200px] 2xl:h-[1300px] ${
             showFilters ? "translate-x-0" : "-translate-x-full"
           } sm:translate-x-0 sm:block max-[375px]:w-full max-[414px]:w-full max-[430px]:w-full md:w-60 max-[820px]:w-60 2xl:w-80`}>
        {" "}
        <div className=" p-5">
          <div>
            <h3 className="font-bold text-2xl">Filters</h3>
            <button
              className="absolute top-8 right-6 text-[20px] text-gray-500 md:hidden sm:hidden "
              onClick={() => setShowFilters(false)}>
              &times; {/* Close button */}
            </button>
          </div>
          <hr className="text-gray my-3" />

          {/* _______________________________ Categories Filter _______________________________ */}
          <div className="filter-section pb-2 mb-2 ">
            <h4 className="my-2 font-semibold text-xl">Category</h4>
            <div className="category-options mt-4 rounded-xl ">
              <div className="flex flex-col overflow-y-auto space-y-2 max-h-[9rem] custom-scrollbar md:max-h-[100px] 2xl:max-h-[9rem] ">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    className={`category-btn px-5 py-2 border-none text-left text-gray rounded-md cursor-pointer hover:bg-[#cfcfcf] hover:text-white ${
                      selectedCategory === category._id
                        ? "bg-black text-white"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category._id ? "" : category._id
                      )
                    }>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <hr className="text-gray mb-8" />
          {/* _______________________________ Price Filter _______________________________ */}
          <div className="w-full my-5">
            {/* Display Current Price Range */}
            <h4 className="my-2 font-semibold text-xl">Price</h4>
            <div className="flex justify-between mb-2">
              <span className="text-lg font-medium">${price[0]}</span>
              <span className="text-lg font-medium">${price[1]}</span>
            </div>

            {/* Slider Container */}
            <div className="relative w-full h-1 bg-gray rounded-md">
              {/* Highlighted Range */}
              <div
                className="absolute h-1 bg-black rounded-md"
                style={{
                  left: `${
                    ((price[0] - minPrice) / (maxPrice - minPrice)) * 100
                  }%`,
                  width: `${
                    ((price[1] - price[0]) / (maxPrice - minPrice)) * 100
                  }%`,
                }}></div>

              {/* Left Slider */}
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={price[0]}
                onChange={(e) =>
                  handleSliderChange(
                    0,
                    Math.min(Number(e.target.value), price[1])
                  )
                }
                className="absolute z-10 w-full h-1 appearance-none bg-transparent pointer-events-none"
              />

              {/* Right Slider */}
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={price[1]}
                onChange={(e) =>
                  handleSliderChange(
                    1,
                    Math.max(Number(e.target.value), price[0])
                  )
                }
                className="absolute  w-full h-1 appearance-none bg-transparent pointer-events-none"
              />
            </div>
          </div>
          <hr className="text-gray mb-8" />
          {/* _______________________________ Colors Filter _______________________________ */}
          <div className="filter-section pb-2 mb-2">
            <h4 className="my-2 font-semibold text-xl">Colors</h4>
            <div className="color-options flex gap-2 flex-wrap">
              {[
                "Green",
                "Red",
                "Yellow",
                "Orange",
                "Blue",
                "Purple",
                "Pink",
                "White",
                "Black",
                "Brown",
                "Gray",
                "HotPink",
              ].map((color) => (
                <span
                  key={color}
                  className="w-6 h-6 rounded-full cursor-pointer lg:w-7 lg:h-7 2xl:w-8 2xl:h-8"
                  style={{
                    fontWeight: 1000,
                    fontSize: 20,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: color.toLowerCase(),
                    color:
                      color === "White" || color === "Yellow"
                        ? "black"
                        : "white", // Change text color based on background
                    border:
                      selectedColor === color
                        ? "4px solid black"
                        : "2px solid gray",
                  }}
                  onClick={() =>
                    setSelectedColor(selectedColor === color ? "" : color)
                  }>
                  {selectedColor === color ? "✓" : ""}
                </span>
              ))}
            </div>
          </div>
          <hr className="text-gray mb-8" />
          {/* _______________________________ Sizes Filter _______________________________ */}
          <div className="filter-section pb-2 mb-2">
            <h4 className="my-2 font-semibold text-xl">Size</h4>
            <div className="size-options flex gap-2 flex-wrap ">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={`size-btn py-2 px-4 rounded-full text-gray cursor-pointer hover:bg-[#cfcfcf] hover:text-white ${
                    selectedSize === size ? "bg-black text-white" : "bg-white"
                  }`}
                  onClick={() =>
                    setSelectedSize(selectedSize === size ? "" : size)
                  }>
                  {size}
                </button>
              ))}
            </div>
          </div>
          <hr className="text-gray mb-8" />
          {/* _______________________________ Dress Style Filter _______________________________ */}
          <div className="filter-section pb-2 mb-2">
            <h4 className="my-2 font-semibold text-xl">Dress Style</h4>
            <div className="flex flex-col overflow-y-auto space-y-2 max-h-[9rem] custom-scrollbar md:max-h-[100px] 2xl:max-h-[9rem]">
              {styles.map((style) => (
                <button
                  key={style._id}
                  className={`style-btn px-5 py-2 border-none text-left text-gray rounded-md cursor-pointer hover:bg-[#cfcfcf] hover:text-white ${
                    selectedDressStyle === style._id
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                  onClick={() =>
                    setSelectedDressStyle(
                      selectedDressStyle === style._id ? "" : style._id
                    )
                  }>
                  {style.name}
                </button>
              ))}
            </div>
          </div>
          <hr className="text-gray mb-8" />
          {/* _______________________________ Brands Filter _______________________________ */}
          <div className="filter-section pb-2 mb-2 ">
            <h4 className="my-2 font-semibold text-xl">Brand</h4>
            <div className="flex flex-col overflow-y-auto space-y-2 max-h-[9rem] custom-scrollbar md:max-h-[100px] 2xl:max-h-[9rem]">
              {brands.map((brand) => (
                <button
                  key={brand._id}
                  className={`style-btn px-5 py-2 border-none text-left text-gray rounded-md cursor-pointer hover:bg-[#cfcfcf] hover:text-white ${
                    selectedBrand === brand._id
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                  onClick={() =>
                    setSelectedBrand(
                      selectedBrand === brand._id ? "" : brand._id
                    )
                  }>
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          <button
            className="apply-filter-btn w-full bg-black text-white border-none cursor-pointer 
            text-lg rounded-full py-2 px-1 hover:bg-gray hover:text-white font-semibold md:mt-[20px]"
            onClick={applyFilters}>
            Apply Filter
          </button>
        </div>
      </aside>
      <div
        className="flex flex-col items-center space-y-6 w-full 
      sm:max-sm:ml-80 md:ml-[240px] ">
        <div
          className="flex justify-between w-full mt-2 sm:px-0 
        md:mt-0 max-[820px]:justify-end ">
          <div
            className="flex items-center gap-1 
          max-[820px]:ml-[20px] lg:ml-[500px] xl:ml-[760px] 2xl:ml-[68rem]">
            <label
              htmlFor="sort"
              className="text-[16px] font-medium 2xl:text-xl 2xl:font-semibold">
              Sort By:{" "}
            </label>
            <select
              id="sort"
              value={sortCriteria}
              onChange={handleSortChange}
              className="py-1 pr-8 border border-gray rounded-md 2xl:py-2 2xl:px-8">
              <option value="">Select...</option>
              <option value="sortBy=price&order=asc">Price: Low to High</option>
              <option value="sortBy=price&order=desc">
                Price: High to Low
              </option>
              <option value="sortBy=createdAt&order=desc">Newest First</option>
              <option value="sortBy=createdAt&order=asc">Oldest First</option>
              <option value="sortBy=rating&order=desc">
                Rating: High to Low
              </option>
              <option value="sortBy=rating&order=asc">
                Rating: Low to High
              </option>
              <option value="sortBy=salePercentage&order=desc">
                Sale Percentage
              </option>
              <option value="sortBy=soldQuantity&order=desc">
                Sold Quantity
              </option>
            </select>
          </div>
          <div className="">
            <button
              className="ml-[60px] w-[30px] h-[30px] bg-[#e4e4e7] border rounded-full md:hidden sm:hidden  lg:hidden"
              onClick={() => setShowFilters(!showFilters)}>
              {showFilters}
              <AdjustmentsVerticalIcon className="h-6 w-7 text-gray-600" />
            </button>
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <section
            className="product-grid w-full 2xl:w-[75%]"
            style={{ minHeight: "calc(3 * (300px + 32px))" }}>
            <div
              className="product-grid grid grid-cols-2 gap-8 w-full sm:grid-cols-2 
          md:grid-cols-2 lg:grid-cols-3 max-[820px]:grid-cols-2 lg:gap-x-0 xl:grid-cols-3">
              {currentProducts.length > 0 ? (
                currentProducts
                  .slice(0, window.innerWidth <= 970 ? 6 : 12) // Hiển thị 6 sản phẩm cho sm và md, 9 cho lg và xl
                  .map((product, index) => (
                    <ProductCard key={index} product={product} />
                  ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          </section>
        )}

        {/* Pagination Component */}
        <div className="pagination-container w-full mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Products;
