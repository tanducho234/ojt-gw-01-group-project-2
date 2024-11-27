import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null); // To store product data
  const { id } = useParams();

  useEffect(() => {
    // Fetch product and reviews data when component mounts
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(`https://ojt-gw-01-final-project-back-end.vercel.app/api/products/${id}`);
        setProduct(productResponse.data); // Set product data
        
        const reviewsResponse = await axios.get(`https://ojt-gw-01-final-project-back-end.vercel.app/api/reviews/product/${id}`);
        setReviews(reviewsResponse.data); // Set reviews data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="account-container">
      <h1>Product Details</h1>
      <div className="product-info">
        {product ? (
          <>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
          </>
        ) : (
          <p>Loading product details...</p>
        )}
      </div>
      
      <h1>Reviews</h1>
      <div className="reviews">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <p><strong>{review.user}</strong>: {review.comment}</p>
              <p>Rating: {review.rating}</p>
            </div>
          ))
        ) : (
          <p>No reviews available for this product.</p>
        )}
      </div>
    </div>
  );
};

export default Review;
