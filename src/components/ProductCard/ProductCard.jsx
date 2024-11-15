import React from "react";
import "./ProductCard.css";

const ProductCard = ({
  name = "T-Shirt with Tape Details",
  imageUrl = "https://placehold.co/295x298?text=Default-Product-Image",
  price = "19.99",
  rating = 3.5,

  maxRating = 5,
  salePercentage = 20, // New prop for sale percentage
}) => {
  // Convert rating to stars
  const stars = Array.from({ length: maxRating }, (_, index) =>
    index < Math.floor(rating) ? "★" : "☆"
  );

  // Calculate the sale price if there is a sale
  const salePrice =
    salePercentage > 0
      ? Number(price * (1 - salePercentage / 100)).toFixed(2).replace(/\.00$/, '')
      : price;  

  return (
    <div className="product-card">
      <img src={imageUrl} alt={name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <div className="product-rating">
          {stars.join(" ")}{" "}
          <span>
            {rating}/{maxRating}
          </span>
        </div>
        <div className="product-price">
          <span className="real-price">${salePrice}</span>
          {salePercentage > 0 && (
            <span className="original-price">${price}</span> // Original price
          )}
          {salePercentage > 0 && (
            <span className="sale-percentage">{salePercentage}%</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
