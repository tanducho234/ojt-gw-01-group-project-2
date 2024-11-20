import React, { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";

import ProductCard from "../../components/ProductCard/ProductCard";
import "../../index.css";
import "../Products/Products.css";
import "../../pages/Products/Products.css";
import axios from "axios";

import Breadcrumb from '../../components/BreadCrumb';

// import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";

const Products = () => {  // State to hold the filter values
  const breadcrumbPaths = [
    { name: 'Home', link: '/home' },
    { name: 'Products', link: '/products' },
    
  ];
  const [price, setPrice] = useState([25, 200]);
  const minPrice = 0;
  const maxPrice = 200;
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // New state for category
  const [selectedDressStyle, setSelectedDressStyle] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(""); // Add state for dress style

  const [categories, setCategories] = useState([]);
  const [styles, setStyles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // Number of products per page
  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const [sortCriteria, setSortCriteria] = useState("");

  const handleSortChange = (e) => {
    const selectedSortCriteria = e.target.value;
    setSortCriteria(selectedSortCriteria); // Update the sort criteria state

    let sortedFiltered = [...filteredProducts]; // Make a copy of the filtered array

    if (selectedSortCriteria === "priceLowToHigh") {
      sortedFiltered = sortedFiltered.sort((a, b) => a.price - b.price);
    } else if (selectedSortCriteria === "priceHighToLow") {
      sortedFiltered = sortedFiltered.sort((a, b) => b.price - a.price);
    } else if (selectedSortCriteria === "rating") {
      sortedFiltered = sortedFiltered.sort(
        (a, b) => b.totalRating - a.totalRating
      ); // Assuming totalRating is the correct field
    }

    // Update the filtered state with the sorted results
    setFilteredProducts(sortedFiltered);
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
    let filtered = products;

    // Filter by price range
    filtered = filtered.filter((product) => {
      const effectivePrice =
        product.salePercentage !== 0
          ? product.price - (product.price * product.salePercentage) / 100
          : product.price;

      return effectivePrice >= price[0] && effectivePrice <= price[1];
    });

    // Filter by selected color (if any)
    if (selectedColor) {
      filtered = filtered.filter((product) =>
        product.colors.some((colorObj) => colorObj.color === selectedColor)
      );
    }

    // Filter by selected size (if any)
    if (selectedSize) {
      filtered = filtered.filter((product) =>
        product.colors.some((color) =>
          color.sizes.some((size) => size.size === selectedSize)
        )
      );
    }

    // Filter by selected category (if any)
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.categoryId === selectedCategory
      );
    }

    // Filter by selected dress style (if any)
    if (selectedDressStyle) {
      filtered = filtered.filter(
        (product) => product.styleId === selectedDressStyle
      );
    }

    // Filter by selected brand (if any)
    if (selectedBrand) {
      filtered = filtered.filter(
        (product) => product.brandId === selectedBrand
      );
    }

    // Update filtered products with the result
    setFilteredProducts(filtered);

    // Reset to the first page after applying filters
    setCurrentPage(1);
  };

  // Function to handle filter changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(
          "https://ojt-gw-01-final-project-back-end.vercel.app/api/categories"
        );
        setCategories(categoryResponse.data);

        const styleResponse = await axios.get(
          "https://ojt-gw-01-final-project-back-end.vercel.app/api/styles"
        );
        setStyles(styleResponse.data);

        const brandResponse = await axios.get(
          "https://ojt-gw-01-final-project-back-end.vercel.app/api/brands"
        );
        setBrands(brandResponse.data);

        const productResponse = await axios.get(
          "https://ojt-gw-01-final-project-back-end.vercel.app/api/products"
        );
        setProducts(productResponse.data);
        setFilteredProducts(productResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on component mount

  // Get products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
                  <Breadcrumb paths={breadcrumbPaths} />

    <div className="flex p-5">
      
      
      <aside className="relative top-2.5 w-[20%] left-2.5 rounded-2xl gap-3  h-[1450px] shadow-inner shadow-gray">
        <div className="mb-5"></div>
        <div className=" p-5">
          <h3 className="font-bold text-2xl">Filters</h3>
          <hr className="text-gray"/>

          {/* _______________________________ Categories Filter _______________________________ */}
          <div className="filter-section pb-2 mb-2 border-b border-gray">
            <div className="category-options mt-4 rounded-xl bg-transparent shadow-md">
              <div className="flex flex-col overflow-y-auto space-y-2 max-h-[12rem] custom-scrollbar">
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
                    }
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
                }}
              ></div>

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
          {/* _______________________________ Colors Filter _______________________________ */}
          <div className="filter-section pb-2 mb-2 border-b border-gray-300">
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
                  className="w-6 h-6 rounded-full cursor-pointer"
                  style={{
                    fontWeight:1000,
                    fontSize:20,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: color.toLowerCase(),
                    color:
                      color === "White" || color === "Yellow"
                        ? "black"
                        : "white", // Change text color based on background
                    border:
                      selectedColor === color ? "4px solid black" : "2px solid gray",
                  }}
                  onClick={() =>
                    setSelectedColor(selectedColor === color ? "" : color)
                  }
                >
                  {selectedColor === color ? "✓" : ""}
                </span>
              ))}
            </div>
          </div>

          {/* _______________________________ Sizes Filter _______________________________ */}
          <div className="filter-section pb-2 mb-2 border-b border-gray-300">
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
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* _______________________________ Dress Style Filter _______________________________ */}
<div className="filter-section pb-2 mb-2 border-b border-gray">
  <h4 className="my-2 font-semibold text-xl">Dress Style</h4>
  <div className="flex flex-col overflow-y-auto space-y-2 max-h-[12rem] custom-scrollbar">
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
        }
      >
        {style.name}
      </button>
    ))}
  </div>
</div>

{/* _______________________________ Brands Filter _______________________________ */}
<div className="filter-section pb-2 mb-2 border-b border-gray">
  <h4 className="my-2 font-semibold text-xl">Brand</h4>
  <div className="flex flex-col overflow-y-auto space-y-2 max-h-[12rem] custom-scrollbar">
    {brands.map((brand) => (
      <button
        key={brand._id}
        className={`style-btn px-5 py-2 border-none text-left text-gray rounded-md cursor-pointer hover:bg-[#cfcfcf] hover:text-white ${
          selectedBrand === brand._id ? "bg-black text-white" : "bg-white"
        }`}
        onClick={() =>
          setSelectedBrand(selectedBrand === brand._id ? "" : brand._id)
        }
      >
        {brand.name}
      </button>
    ))}
  </div>
</div>


          <button
            className="apply-filter-btn w-full bg-black  text-white border-none cursor-pointer text-lg rounded-full py-2 px-1 hover:bg-gray hover:text-white font-semibold "
            onClick={applyFilters}
          >
            Apply Filter
          </button>
        </div>
      </aside>
      <div className="grid-pagination flex flex-col items-center space-y-6">
        <div className="sort-by flex items-center ml-[900px] space-x-2">
          <label htmlFor="sort" className="text-lg font-medium">
            Sort By:{" "}
          </label>
          <select
            id="sort"
            value={sortCriteria}
            onChange={handleSortChange}
            className="py-2 px-4 border border-gray rounded-md"
          >
            <option value="">Select...</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <section
          className="product-grid grid grid-cols-3 gap-8 w-full ml-[150px]"
          style={{ minHeight: "calc(3 * (300px + 32px))" }} // Adjust based on product card height and gap
        >
          {currentProducts.length > 0 ? (
            currentProducts.map((product, index) => (
              <ProductCard
                key={index}
                name={product.name}
                imageUrl={product.generalImgLink}
                price={product.price}
                rating={
                  product.totalReview === 0
                    ? 0
                    : product.totalRating / product.totalReview
                }
                salePercentage={product.salePercentage}
              />
            ))
          ) : (
            <p className="text-center col-span-3">No products found.</p>
          )}
          {/* Add placeholders to maintain the grid */}
          {Array.from({ length: 9 - currentProducts.length }, (_, i) => (
            <div
              key={`placeholder-${i}`}
              className=" rounded bg-gray-200 h-[300px]"
            ></div>
          ))}
        </section>
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
    </div>
  );
}

export default Products;
