import React from 'react';
import './Review.css';

function Review({ review }) {
  return (
    <div className="review">
      <div className="review-header">
        <h4>{review.username}</h4>
        <div className="review-rating">
          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
        </div>
      </div>
      <p className="review-text">{review.text}</p>
    </div>
  );
}

export default Review;
