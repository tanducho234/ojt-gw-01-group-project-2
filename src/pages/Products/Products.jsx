import React, { useState, useEffect } from "react";

import { products } from "../../assets/dataexample";
import ProductCard from "../../components/ProductCard/ProductCard";
import "../../index.css";

function Products() {
  // State to hold the filter values
  const [price, setPrice] = useState([50, 200]);
  const minPrice = 25;
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

  const [sortCriteria, setSortCriteria] = useState("");

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
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

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  // Get products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

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

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex p-5">
      <aside className="relative top-2.5 left-2.5 rounded-[30px] gap-6 p-5 max-h-[120vh] shadow-inner shadow-gray-400/30">
        <div className="w-48 p-5">
          <h3 className="text-lg mb-4">Filters</h3>
          <hr />

          {/* Categories Filter */}
          <div className="pb-2.5 mb-2.5 border-b border-gray-300">
            <h4 className="mb-2.5">Categories</h4>
            <div className="flex flex-col gap-2">
              {["T-Shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map(
                (category) => (
                  <button
                    key={category}
                    className={`text-left p-2.5 rounded ${
                      tempSelectedCategory === category
                        ? "bg-black text-white"
                        : "bg-gray-100"
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

          {/* Price Filter */}
          <div className="pb-2.5 mb-2.5 border-b border-gray-300">
            <h4 className="mb-2.5">Price</h4>
            <div className="relative w-full h-1.5 bg-gray-300 my-2.5 rounded">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={tempPrice[0]}
                onChange={(e) => handleSliderChange(0, Number(e.target.value))}
                className="absolute appearance-none h-1 bg-transparent w-full pointer-events-none"
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={tempPrice[1]}
                onChange={(e) => handleSliderChange(1, Number(e.target.value))}
                className="absolute appearance-none h-1 bg-transparent w-full pointer-events-none"
              />
            </div>
            <div>
              ${tempPrice[0]} - ${tempPrice[1]}
            </div>
          </div>

          {/* Colors Filter */}
          <div className="pb-2.5 mb-2.5 border-b border-gray-300">
            <h4 className="mb-2.5">Colors</h4>
            <div className="flex gap-2 flex-wrap">
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
                  className={`w-6 h-6 rounded-full cursor-pointer bg-${color.toLowerCase()}-500`}
                  onClick={() =>
                    setTempSelectedColor(
                      tempSelectedColor === color ? "" : color
                    )
                  }
                  style={{
                    border:
                      tempSelectedColor === color ? "2px solid black" : "none",
                  }}
                ></span>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="pb-2.5 mb-2.5 border-b border-gray-300">
            <h4 className="mb-2.5">Size</h4>
            <div className="flex gap-2 flex-wrap">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={`px-5 py-2 rounded-full cursor-pointer ${
                    tempSelectedSize === size
                      ? "bg-black text-white"
                      : "bg-gray-200"
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

          {/* Dress Style Filter */}
          <div className="pb-2.5 mb-2.5 border-b border-gray-300">
            <h4 className="mb-2.5">Dress Style</h4>
            <div className="flex flex-col gap-2">
              {["Casual", "Formal", "Party", "Gym"].map((style) => (
                <button
                  key={style}
                  className={`text-left p-2.5 rounded ${
                    tempSelectedDressStyle === style
                      ? "bg-black text-white"
                      : "bg-gray-100"
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

          <button className="w-full bg-black text-white rounded-full py-4 text-lg">
            Apply Filter
          </button>
        </div>
      </aside>

      <div className="ml-8 flex flex-col items-center relative">
        {/* Sort By dropdown */}
        <div className="mb-5">
          <label htmlFor="sort">Sort By: </label>
          <select
            id="sort"
            value={sortCriteria}
            onChange={handleSortChange}
            className="px-2 py-1 text-lg rounded border border-gray-300"
          >
            <option value="">Select...</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Product Grid */}
        <section className="grid grid-cols-3 gap-20 p-5">
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

        {/* Pagination buttons */}
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded border ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "border-gray-300 bg-white hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Products;
