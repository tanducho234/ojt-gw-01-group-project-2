import React, { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import { products } from "../../assets/dataexample";
import ProductCard from "../../components/ProductCard/ProductCard";
import "../../index.css";
import "../Products/Products.css";
import "../../pages/Products/Products.css";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";

function Products() {
  // State to hold the filter values
  const [price, setPrice] = useState([0, 200]);
  const minPrice = 0;
  const maxPrice = 200;
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // New state for category
  const [selectedDressStyle, setSelectedDressStyle] = useState(""); // Add state for dress style
  const [filteredProducts, setFilteredProducts] = useState(products);

  const [tempPrice, setTempPrice] = useState([50, 200]);
  const [tempSelectedColor, setTempSelectedColor] = useState("");
  const [tempSelectedSize, setTempSelectedSize] = useState("");
  const [tempSelectedCategory, setTempSelectedCategory] = useState("");
  const [tempSelectedDressStyle, setTempSelectedDressStyle] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // Number of products per page
  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const [sortCriteria, setSortCriteria] = useState("");

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const handleSliderChange = (index, value) => {
    setTempPrice((prevPrice) => {
      const newPrice = [...prevPrice];
      newPrice[index] = Math.max(minPrice, Math.min(maxPrice, value)); // Clamp values within bounds
      if (newPrice[0] > newPrice[1]) {
        // Prevent crossing handles
        newPrice[index === 0 ? 1 : 0] = newPrice[index];
      }
      return newPrice;
    });
  };

  // Function to handle filter application
  const applyFilters = () => {
    // Update your filters
    setPrice(tempPrice);
    setSelectedColor(tempSelectedColor);
    setSelectedSize(tempSelectedSize);
    setSelectedCategory(tempSelectedCategory);
    setSelectedDressStyle(tempSelectedDressStyle);

    // Update breadcrumb based on selected filters
    // let newBreadcrumb = "Home";
    // if (tempSelectedDressStyle) newBreadcrumb += ` > ${tempSelectedDressStyle}`;
    // setBreadcrumb(newBreadcrumb);
  };

  // Function to handle filter changes
  useEffect(() => {
    let filtered = products.filter((product) => {
      const withinPriceRange =
        product.price >= price[0] && product.price <= price[1];
      const matchesColor = selectedColor
        ? product.colors.includes(selectedColor)
        : true;
      const matchesSize = selectedSize
        ? product.size.includes(selectedSize)
        : true;
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;
      const matchesDressStyle = selectedDressStyle
        ? product.dress_style === selectedDressStyle
        : true;

      return (
        withinPriceRange &&
        matchesColor &&
        matchesSize &&
        matchesCategory &&
        matchesDressStyle
      );
    });
    if (sortCriteria === "priceLowToHigh") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortCriteria === "priceHighToLow") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortCriteria === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [
    price,
    selectedColor,
    selectedSize,
    selectedCategory,
    selectedDressStyle,
    sortCriteria,
  ]);

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
    <div className="flex p-5">
      <aside className="relative top-2.5 w-[25%] left-2.5 rounded-2xl gap-3  h-[1350px] shadow-inner shadow-gray">
        <div className="mb-5">
          {/* <Breadcrumb
            className=" flex z-10"
            category={selectedCategory}
            filters={selectedDressStyle || selectedColor || selectedSize}
          /> */}
        </div>
        <div className=" p-5">
          <h3 className="font-bold text-2xl">Filters</h3>
          <hr />

          {/* _______________________________ Categories Filter _______________________________ */}
          <div className="filter-section pb-2 mb-2 border-b border-gray">
            <h4 className="my-2 text-lg font-normal">Categories</h4>
            <div className="category-options flex flex-col gap-2 rounded-xl bg-transparent shadow-md">
              {["T-Shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map(
                (category) => (
                  <button
                    key={category}
                    className={`category-btn px-5 py-2 border-none text-center rounded-md cursor-pointer hover:bg-gray ${
                      tempSelectedCategory === category
                        ? "bg-black text-[#ffffff]"
                        : ""
                    }`}
                    onClick={() =>
                      setTempSelectedCategory(
                        tempSelectedCategory === category ? "" : category
                      )
                    }
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>

          {/* _______________________________ Price Filter _______________________________ */}
          <div className="w-full my-5">
            {/* Display Current Price Range */}
            <div className="flex justify-between mb-2">
              <span className="text-lg font-medium">${tempPrice[0]}</span>
              <span className="text-lg font-medium">${tempPrice[1]}</span>
            </div>

            {/* Slider Container */}
            <div className="relative w-full h-1 bg-gray rounded-md">
              {/* Highlighted Range */}
              <div
                className="absolute h-1 bg-black rounded-md"
                style={{
                  left: `${
                    ((tempPrice[0] - minPrice) / (maxPrice - minPrice)) * 100
                  }%`,
                  width: `${
                    ((tempPrice[1] - tempPrice[0]) / (maxPrice - minPrice)) *
                    100
                  }%`,
                }}
              ></div>

              {/* Left Slider */}
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={tempPrice[0]}
                onChange={(e) =>
                  handleSliderChange(
                    0,
                    Math.min(Number(e.target.value), tempPrice[1])
                  )
                }
                className="absolute z-10 w-full h-1 appearance-none bg-transparent pointer-events-none"
              />

              {/* Right Slider */}
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={tempPrice[1]}
                onChange={(e) =>
                  handleSliderChange(
                    1,
                    Math.max(Number(e.target.value), tempPrice[0])
                  )
                }
                className="absolute  w-full h-1 appearance-none bg-transparent pointer-events-none"
              />
            </div>
          </div>

          {/* _______________________________ Colors Filter _______________________________ */}
          <div className="filter-section pb-2 mb-2 border-b border-gray-300">
            <h4 className="my-2 text-lg font-normal">Colors</h4>
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
              ].map((color) => (
                <span
                  key={color}
                  className="w-6 h-6 rounded-full cursor-pointer"
                  style={{
                    backgroundColor: color.toLowerCase(),
                    border:
                      tempSelectedColor === color ? "2px solid black" : "none",
                  }}
                  onClick={() =>
                    setTempSelectedColor(
                      tempSelectedColor === color ? "" : color
                    )
                  }
                ></span>
              ))}
            </div>
          </div>

          {/* _______________________________ Sizes Filter _______________________________ */}
          <div className="filter-section pb-2 mb-2 border-b border-gray-300">
            <h4 className="my-2 text-lg font-normal">Size</h4>
            <div className="size-options flex gap-2 flex-wrap ">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={`size-btn py-2 px-4 rounded-full cursor-pointer hover:bg-gray ${
                    tempSelectedSize === size
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                  onClick={() =>
                    setTempSelectedSize(tempSelectedSize === size ? "" : size)
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* _______________________________ Dress Style Filter _______________________________ */}
          <div className="filter-section pb-2 mb-2 border-b border-gray">
            <h4 className="my-2 text-lg font-normal">Dress Style</h4>
            <div className="dress-style-options flex flex-col gap-2 rounded-xl flex-wrap bg-transparent shadow-md">
              {["Casual", "Formal", "Party", "Gym"].map((style) => (
                <button
                  key={style}
                  className={`style-btn py-2 px-4 rounded-lg cursor-pointer hover:bg-gray ${
                    tempSelectedDressStyle === style
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                  onClick={() =>
                    setTempSelectedDressStyle(
                      tempSelectedDressStyle === style ? "" : style
                    )
                  }
                >
                  {style}
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
        <div className="sort-by flex items-center ml-[900px] space-x-2 ">
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

        <section className="product-grid grid grid-cols-3 gap-8 w-full ml-[150px]">
          {currentProducts.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              imageUrl={product.imageUrl}
              price={product.price}
              rating={product.rating}
              salePercentage={product.salePercentage}
            />
          ))}
        </section>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Products;
