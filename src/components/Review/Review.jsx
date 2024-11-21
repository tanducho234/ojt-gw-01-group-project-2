import React from "react";
import "./Review.css";
const Review = ({ review }) => {
  return (
    <div className="review-card">
       <div className="review-rating">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`star ${i < review.rating ? "filled" : ""}`}>
            ★
          </span>
        ))}
        
      </div>
      <div className="review-header">
        <span className="reviewer-name">{review.userId.fullName}</span>
      </div>

     

      <p className="review-feedback">"{review.feedback}"</p>
      <p className="review-date">Posted on {review.date}</p>

    </div>
  );
};
export default Review;
