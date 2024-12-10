import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import StarRating from "../../../components/StarRating";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch data if user exists and has an id
    if (user && user.id) {
      const fetchData = async () => {
        try {
          const reviewsResponse = await axios.get(
            `https://ojt-gw-01-final-project-back-end.vercel.app/api/reviews/user/${user.id}`
          );
          setReviews(reviewsResponse.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setReviews([]); // Set empty array on error
        }
      };
      fetchData();
    }
  }, [user]); // Add user as dependency

  return (
    <>
      <div className="account-container">
        <h1 className="text-3xl font-bold">Reviews</h1>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="reviews">
            {reviews.length > 0 ? (
              <div className="flex flex-col items-center gap-4">
                {reviews.map((review, index) => (
                  <div
                    key={review._id || index}
                    className="review-item bg-white shadow-xl h-100 rounded-lg p-6 w-full md:w-2/3 lg:w-1/2">
                    <div className="flex items-center mb-2">
                      <img
                        src={review.productId.generalImgLink}
                        alt={review.productId.name}
                        className="w-12 h-12 mr-2"
                      />
                      <strong>{review.productId.name}</strong>
                    </div>
                    <p className="mb-2">{review.feedback}</p>
                    <div className="flex items-center justify-between">
                      <StarRating
                        rating={review.rating}
                        size="text-lg"
                        className="text-yellow-500"
                      />

                      <span className="text-gray-500 text-sm">
                        Posted on
                        {new Date(review.date).toLocaleDateString("en-CA")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven't made any reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Review;
