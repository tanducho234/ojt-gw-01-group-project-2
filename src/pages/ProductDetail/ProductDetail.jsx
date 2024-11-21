import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Review from "../../components/Review/Review";

const ProductDetail = () => {
  const { id } = useParams(); // Get the product id from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    // Fetch product data using axios
    axios
      .get(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/products/${id}`
      )
      .then((response) => {
        setProduct(response.data);
        console.log("asdasdasdasd", response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching product data.");
        setLoading(false);
      });
  }, [id]);
  // Handle loading state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  // Handle default product values in case product is not yet loaded
  if (!product) return <div>No product found</div>;
  // const stars = Array.from({ length: 5 }, (_, index) =>
  //   index < Math.floor(product.rating) ? "★" : "☆"
  // );
  const salePrice =
    product.salePercentage > 0
      ? Number(product.price * (1 - product.salePercentage / 100))
          .toFixed(2)
          .replace(/\.00$/, "")
      : product.price;
  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };
  const getSizeLabel = (size) => {
    if (size === "S") return "Small";
    if (size === "M") return "Medium";
    if (size === "L") return "Large";
    if (size === "XL") return "Extra Large";
  };
  return (
    <div>
      <nav className="breadcrumb">
        <a href="/">Home</a>
        <span className="separator">{">"}</span>
        <a href="/shop">Shop</a>
        <span className="separator">{">"}</span>
        <a href="/shop/men">Men</a>
        <span className="separator">{">"}</span>
        <span className="active">{product.category}</span>
      </nav>
      <div className="product-detail-container">
        <div className="product-images">
          <div className="small-images">
            <img src={product.generalImgLink} alt="Product Thumbnail" />
            {/* You can add more images if available */}
          </div>
          <div className="big-image">
            <img src={product.generalImgLink} alt="Product" />
          </div>
        </div>
        <div className="product-details">
          <h1>{product.name}</h1>
          {/* <div className="product-rating">
            {stars.join(" ")} <span>{rating}/5</span>
          </div> */}
          <div className="product-price">
            <span className="real-price">${salePrice}</span>
            {product.salePercentage > 0 && (
              <span className="original-price">${product.price}</span>
            )}
            {product.salePercentage > 0 && (
              <span className="sale-percentage">{product.salePercentage}%</span>
            )}
          </div>
          <div className="product-desc">{product.description}</div>
          <div className="color-selector">
            <p>Select Color</p>
            {product.colors.map((item) => (
              <div
                key={item}
                className={`color-option ${
                  selectedColor === item.color ? "selected" : ""
                }`}
                style={{ backgroundColor: item.color.toLowerCase() }}
                onClick={() => handleColorSelect(item.color)}
              >
                {selectedColor === item.color && "✓"}
              </div>
            ))}
          </div>
          <div className="size-selector">
            <p>Choose Size</p>
            {["S","M","L","XL"].map((sizeOption) => (
              <div
                key={sizeOption}
                className={`size-option ${
                  selectedSize === sizeOption ? "selected" : ""
                }`}
                onClick={() => handleSizeSelect(sizeOption)}
              >
                {getSizeLabel(sizeOption)}
              </div>
            ))}
          </div>
          <div className="quantity-section">
            <div className="quantity-selector">
              <button className="quantity-button-decrement" onClick={decrement}>
                -
              </button>
              <span className="quantity">{quantity}</span>
              <button className="quantity-button-increment" onClick={increment}>
                +
              </button>
            </div>
            <button
              className="add-to-cart-button"
              onClick={() => {
                if (!selectedSize) {
                  alert("Please select a size");
                  return;
                }
                // TODO: Implement add to cart functionality
                alert(
                  `Added ${quantity} ${product.name} in ${selectedColor} color, size ${selectedSize} to cart`
                );
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="product-description">
        <div className="tab-nav">
          <div className="tab-button-2">Description</div>
          <div className="tab-button">Rating & Reviews</div>
          <div className="tab-button-2">FAQs</div>
        </div>
        {/* <div className="review-container">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Review key={index} review={review} />
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div> */}
      </div>
    </div>
  );
};
export default ProductDetail;