import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";
import Review from "../../components/Review/Review";

const ProductDetail = () => {
  const product = {
    id: "1",
    name: "Summer Floral Dress",
    category: "Dress",
    price: 39.99,
    salePercentage: 20,
    colors: ["Red", "Blue", "Green", "Pink","Black"],
    size: ["S", "M", "L","XL"],
    dress_style: "Casual",
    img_url: "https://placehold.co/295x298",
    desc:           "Absolutely love this dress! The fit is perfect, and the colors are so vibrant. Definitely my new go-to summer dress!",

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

  const salePrice =
    product.salePercentage > 0
      ? Number(product.price * (1 - product.salePercentage / 100)).toFixed(2).replace(/\.00$/, '')
      : product.price;  

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const sizes = product.size;
  const colors = product.colors;
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
        <span className="active">T-shirts</span>
      </nav>
      <div className="product-detail-container">
        <div className="product-images">
          <div className="small-images">
            <img src="https://placehold.co/150x160"></img>
            <img src="https://placehold.co/150x160"></img>
            <img src="https://placehold.co/150x160"></img>
          </div>
          <div className="big-image">
            <img src="https://placehold.co/400x500"></img>
          </div>
        </div>
        <div className="product-details">
          <h1>{product.name}</h1>
          <div className="product-rating">
            {stars.join(" ")}{" "}
            <span>
              {product.rating}/{5}
            </span>
          </div>
          <div className="product-price">
            <span className="real-price">${salePrice}</span>
            {product.salePercentage > 0 && (
              <span className="original-price">${product.price}</span> // Original price
            )}
            {product.salePercentage > 0 && (
              <span className="sale-percentage">{product.salePercentage}%</span>
            )}
          </div>

          <div className="product-desc">{product.desc}</div>
          <div className="color-selector">
            <p>Select Color</p>
            {colors.map((color) => (
              <div
                key={color}
                className={`color-option ${
                  selectedColor === color ? "selected" : ""
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                onClick={() => handleColorSelect(color)}>
                {selectedColor === color && "✓"}
              </div>
            ))}
          </div>
          <div className="size-selector">
            <p>Choose Size</p>
            {sizes.map((size) => (
              <div
                key={size}
                className={`size-option ${
                  selectedSize === size ? "selected" : ""
                }`}
                onClick={() => handleSizeSelect(size)}>
                {getSizeLabel(size)}
              </div>
            ))}
          </div>{" "}
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
              }}>
              Add to Cart{" "}
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
        <div className="review-container">
          {product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <Review key={index} review={review} />
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
