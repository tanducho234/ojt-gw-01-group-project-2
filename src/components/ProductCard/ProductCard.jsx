import React from 'react';
import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">{`$${product.price.toFixed(2)}`}</div>
        <button className="product-button">Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductCard;
