import React from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  return (
    <div className="product-detail">
      <h2>Product Detail for ID: {id}</h2>
      <p>Product details and description go here.</p>
    </div>
  );
}

export default ProductDetail;
