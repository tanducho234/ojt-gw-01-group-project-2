import React from "react";
import "./Review.css";
const Review = ({
  review = {
    reviewer: "Anonymous",
    date: "2024-08-01",
    star: 4,
    feedback:
      "Absolutely love this dress! The fit is perfect, and the colors are so vibrant. Definitely my new go-to summer dress!",
  },
}) => {
  return (
    <div className="review-card">
              <span className="review-more-btn">...</span>

       <div className="review-rating">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`star ${i < review.star ? "filled" : ""}`}>
            ★
          </span>
        ))}
        
      </div>
      <div className="review-header">
        <span className="reviewer-name">{review.reviewer}</span>
      </div>

     

      <p className="review-feedback">"{review.feedback}"</p>
      <p className="review-date">Posted on {review.date}</p>

    </div>
  );
};
export default Review;
