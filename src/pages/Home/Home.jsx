import React from "react";
import "./Home.css";
import { products } from "../../assets/dataexample";

function Home() {
  console.log(products);

  const newArrivals = [
    { id: 1, name: 'T-shirt with Tape Details', price: 120, rating: 4.5, reviews: 145, image: '/public/images/Frame_32.png' },
    { id: 2, name: 'Skinny Fit Jeans', price: 240, oldPrice: 260, rating: 4.3, reviews: 130, image: '/public/images/Frame_33.png' },
    { id: 3, name: 'Checkered Shirt', price: 180, rating: 4.4, reviews: 140, image: '/public/images/Frame_34.png' },
    { id: 4, name: 'Sleeve Striped T-shirt', price: 130, oldPrice: 160, rating: 4.2, reviews: 120, image: '/public/images/Frame_38.png' }
  ];

  const topSelling = [
    { id: 1, name: 'Vertical Striped Shirt', price: 212, oldPrice: 232, rating: 4.6, reviews: 160, image: '/public/images/Frame_32_1.png' },
    { id: 2, name: 'Courage Graphic T-shirt', price: 145, rating: 4.7, reviews: 167, image: '/public/images/Frame_33_1.png' },
    { id: 3, name: 'Loose Fit Bermuda Shorts', price: 80, rating: 4.3, reviews: 120, image: '/public/images/Frame_34_1.png' },
    { id: 4, name: 'Faded Skinny Jeans', price: 210, rating: 4.4, reviews: 140, image: '/public/images/Frame_38_1.png' }
  ];

  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  return (
    <div className="home">
      

      <section className="hero">
        <div className="hero-content">
          <h1>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
          <p>Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
          <button className="shop-now">Shop Now</button>
          <div className="stats">
            <div className="stat">
              <h2>200+</h2>
              <p>International Brands</p>
            </div>
            <div className="stat">
              <h2>2,000+</h2>
              <p>High-Quality Products</p>
            </div>
            <div className="stat">
              <h2>30,000+</h2>
              <p>Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="brands">
  <div className="brand-list">
    <img src='/public/images/Versace.png'alt="Versace" />
    <img src='/public/images/Vector.png' alt="Zara" />
    <img src='/public/images/Gucci.png' alt="Gucci" />
    <img src='/public/images/Prada.png' alt="Prada" />
    <img src='/public/images/Calvin_Klein.png' alt="Calvin Klein" />
  </div>
</section>

      <section className="new-arrivals">
        <h2>NEW ARRIVALS</h2>
        <div className="product-grid">
  {newArrivals.map(product => (
    <div key={product.id} className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="reviews">({product.reviews})</span>
        </div>
        <div className="price">
          ${product.price}
          {product.oldPrice && <span className="old-price">${product.oldPrice}</span>}
        </div>
      </div>
    </div>
  ))}
</div>
        <button className="view-all">View All</button>
      </section>

      <section className="top-selling">
  <h2>TOP SELLING</h2>
  <div className="product-grid">
    {topSelling.map(product => (
      <div key={product.id} className="product-card">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <div className="rating">
            <span className="stars">{renderStars(product.rating)}</span>
            <span className="reviews">({product.reviews})</span>
          </div>
          <div className="price">
            ${product.price}
            {product.oldPrice && <span className="old-price">${product.oldPrice}</span>}
          </div>
        </div>
      </div>
    ))}
  </div>
  <button className="view-all">View All</button>
</section>

<section className="dress-style">
  <h2>BROWSE BY DRESS STYLE</h2>
  <div className="style-grid">
    <div className="style-card casual">
      <img src="/public/images/Casual.png" alt="Casual Style" />
      
    </div>
    <div className="style-card formal">
      <img src="/public/images/Formal.png" alt="Formal Style" />
      
    </div>
    <div className="style-card party">
      <img src="/public/images/Party.png" alt="Party Style" />
      
    </div>
    <div className="style-card gym">
      <img src="/public/images/GYM.png" alt="Gym Style" />
      
    </div>
  </div>
</section>

      <section className="testimonials">
        <h2>OUR HAPPY CUSTOMERS</h2>
        <div className="testimonial-slider">
          {/* Testimonial cards will be added here */}
        </div>
      </section>

      

      
    </div>
  );
}

export default Home;
