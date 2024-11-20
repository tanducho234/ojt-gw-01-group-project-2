import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Review from "../../components/Review/Review";
import { Tabs, Tab, Box } from '@mui/material';

const ProductDetail = () => {
  const product = {
    id: "1",
    name: "Summer Floral Dress",
    category: "Dress",
    price: 39.99,
    salePercentage: 20,
    colors: ["Red", "Blue", "Green", "Pink", "Black"],
    size: ["S", "M", "L", "XL"],
    dress_style: "Casual",
    img_url: "https://placehold.co/295x298",
    desc: "Absolutely love this dress! The fit is perfect, and the colors are so vibrant. Definitely my new go-to summer dress!",
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
        reviewer: "Rachel P.",
        date: "2024-08-20",
        star: 2,
        feedback:
          "I was really excited about this dress, butexcited about this dresexcited about this dress, butexcited about this dress, butexcited about this dress, buts, butexcited about this dress, butexcited about this dress, but it didn't fit as well as I thought. The sizing seems off, and it's a bit too short for me.",
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
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const stars = Array.from({ length: 5 }, (_, index) =>
    index < Math.floor(product.rating) ? "★" : "☆"
  );

  const salePrice =
    product.salePercentage > 0
      ? Number(product.price * (1 - product.salePercentage / 100))
          .toFixed(2)
          .replace(/\.00$/, "")
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
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Details" />
        <Tab label="Reviews" />
      </Tabs>

      <div>
        {activeTab === 0 && (
          <Box sx={{ padding: 2 }}>
            <h2>Product Details</h2>
            <p>Here are the details of the product...</p>
          </Box>
        )}
        {activeTab === 1 && (
        <div className="review-container">
        {product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <Review key={index} review={review} />
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
        )}
      </div>
      {/* Các phần khác của sản phẩm */}
      <div className="product-description">
        {/* Phần Mô tả sản phẩm */}
        
        <div className="description-section">
     
        </div>

        {/* Phần Đánh giá (Reviews) */}
       
      </div>
    </div>
  );
};

export default ProductDetail;
