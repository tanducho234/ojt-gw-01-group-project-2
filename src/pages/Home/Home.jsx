import React, { useState, useEffect, useRef } from "react";
import Review from "../../components/Review/Review";
import axios from "axios";
import ProductCard from "../../components/ProductCard/ProductCard";
import { Link } from "react-router-dom";

function Home({ customerReviews = [] }) {
  const [counts, setCounts] = useState({
    brands: 0,
    products: 0,
    customers: 0,
  });

  const [reviews, setReviews] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const brandContainerRef = useRef(null);
  const reviewContainerRef = useRef(null);
  const scrollRef = useRef(0);

  const targetCounts = {
    brands: 200,
    products: 2000,
    customers: 30000,
  };

  const brands = ["Versace", "Vector", "Gucci", "Prada", "Calvin_Klein"];

  const handleReviewScroll = (direction) => {
    const container = reviewContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const newScrollLeft = direction === 'left' 
      ? Math.max(0, container.scrollLeft - scrollAmount)
      : Math.min(maxScroll, container.scrollLeft + scrollAmount);

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth"
    });
  };

  const fetchRandomTopReviews = async () => {
    try {
      const response = await axios.get(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/reviews/random-top-reviews"
      );

      if (response.status === 200) {
        setReviews(response.data);
      } else {
        console.error("Failed to fetch reviews with status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchAndSortProducts = async () => {
    try {
      const response = await axios.get(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/products"
      );

      if (response.status === 200) {
        const products = response.data;
        
        const sortedByDate = [...products]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);

        const sortedBySales = [...products]
          .sort((a, b) => b.soldQuantity - a.soldQuantity)
          .slice(0, 4);

        setNewArrivals(sortedByDate);
        setTopSelling(sortedBySales);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    
    fetchRandomTopReviews();
    fetchAndSortProducts();

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;

    const counters = {};

    Object.entries(targetCounts).forEach(([key, target]) => {
      let current = 0;
      const step = target / steps;

      counters[key] = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(counters[key]);
        }
        setCounts((prev) => ({
          ...prev,
          [key]: Math.round(current),
        }));
      }, interval);
    });

    return () => {
      Object.values(counters).forEach(clearInterval);
    };
  }, []);
  // Auto scroll effect for brands
  useEffect(() => {
    let scrollInterval;
    const container = brandContainerRef.current;

    const updateScroll = () => {
      if (!container || isDragging) return;

      scrollRef.current += 1;
      container.scrollLeft = scrollRef.current;

      const scrollWidth = container.scrollWidth / 3;
      if (container.scrollLeft >= scrollWidth) {
        scrollRef.current = scrollRef.current - scrollWidth;
        container.scrollLeft = scrollRef.current;
      }
    };

    if (autoScrollEnabled) {
      scrollInterval = setInterval(updateScroll, 30);
    }

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [autoScrollEnabled, isDragging]);

  // Drag handlers
  const handleDragStart = (e) => {
    if (isMobile) {
      if (e.type === "touchstart") {
        setIsDragging(true);
        setAutoScrollEnabled(false);
        setStartX(e.touches[0].pageX - brandContainerRef.current.offsetLeft);
        setScrollLeft(brandContainerRef.current.scrollLeft);
        scrollRef.current = brandContainerRef.current.scrollLeft;
      }
    } else {
      setIsDragging(true);
      setAutoScrollEnabled(false);
      setStartX(e.pageX - brandContainerRef.current.offsetLeft);
      setScrollLeft(brandContainerRef.current.scrollLeft);
      scrollRef.current = brandContainerRef.current.scrollLeft;
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (brandContainerRef.current) {
      scrollRef.current = brandContainerRef.current.scrollLeft;
    }
    setTimeout(() => setAutoScrollEnabled(true), 1000);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const container = brandContainerRef.current;
    const x = isMobile
      ? (e.type === "touchmove" ? e.touches[0].pageX : e.pageX) -
        container.offsetLeft
      : e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    const newScrollLeft = scrollLeft - walk;

    const scrollWidth = container.scrollWidth / 3;
    if (newScrollLeft >= scrollWidth) {
      container.scrollLeft = newScrollLeft - scrollWidth;
      setScrollLeft(newScrollLeft - scrollWidth);
      scrollRef.current = newScrollLeft - scrollWidth;
    } else if (newScrollLeft <= 0) {
      container.scrollLeft = scrollWidth + newScrollLeft;
      setScrollLeft(scrollWidth + newScrollLeft);
      scrollRef.current = scrollWidth + newScrollLeft;
    } else {
      container.scrollLeft = newScrollLeft;
      scrollRef.current = newScrollLeft;
    }
  };

  return (
    <div className="m-0 font-sans scroll-smooth">
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-touch-scroll {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
        }
      `}</style>

      <section className="bg-[url('/images/image.png')] bg-cover bg-center bg-no-repeat p-4 md:p-28 text-left transition-all duration-500 ease-in-out hover:bg-opacity-90">
        <div className="max-w-xl transform transition-transform duration-500 hover:scale-105">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-5 animate-fade-in">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>
          <p className="text-gray-600 mb-4 md:mb-8 text-sm md:text-base animate-slide-up">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <button className="bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-full cursor-pointer transition-all duration-300 hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 text-sm md:text-base">
            Shop Now
          </button>
          <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-10 mt-6 md:mt-10">
            <div className="w-1/2 md:w-auto transform transition-all duration-300 hover:scale-110">
              <h2 className="text-2xl md:text-3xl mb-1">{counts.brands}+</h2>
              <p className="text-sm md:text-base">International Brands</p>
            </div>
            <div className="w-1/2 md:w-auto transform transition-all duration-300 hover:scale-110">
              <h2 className="text-2xl md:text-3xl mb-1">{counts.products}+</h2>
              <p className="text-sm md:text-base">High-Quality Products</p>
            </div>
            <div className="w-1/2 md:w-auto transform transition-all duration-300 hover:scale-110">
              <h2 className="text-2xl md:text-3xl mb-1">{counts.customers}+</h2>
              <p className="text-sm md:text-base">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-6 md:py-10 px-3 md:px-5">
        <div
          ref={brandContainerRef}
          className="flex overflow-x-hidden cursor-grab active:cursor-grabbing hide-scrollbar mobile-touch-scroll relative"
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onMouseMove={handleDragMove}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
          onTouchMove={handleDragMove}
        >
          <div className="flex gap-16 md:gap-36 min-w-max">
            {[...brands, ...brands, ...brands].map((brand, index) => (
              <img
                key={`${brand}-${index}`}
                src={`/images/${brand}.png`}
                alt={brand}
                className="max-w-[120px] md:max-w-[200px] h-auto transform transition-all duration-500 hover:scale-110 hover:brightness-110 hover:contrast-110 select-none"
                draggable="false"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16 px-3 md:px-5 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-black text-center leading-tight md:leading-[57.6px] transform transition-all duration-300 hover:scale-105">
          NEW ARRIVALS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 my-6 md:my-10 w-full max-w-7xl">
          {newArrivals.map((product, index) => (
            <ProductCard key={index} product={product} root="/products" />
          ))}
        </div>
        <Link to="/products?sort=createAt&order=desc" className="px-4 md:px-6 py-2 md:py-3 bg-transparent border-2 border-black rounded cursor-pointer transition-all duration-300 hover:bg-black hover:text-white hover:shadow-lg transform hover:-translate-y-1 text-sm md:text-base">
          View All
        </Link>
      </section>

      <div className="w-full md:w-[1180px] border-t border-black/10 mx-auto"></div>

      <section className="py-8 md:py-16 px-3 md:px-5 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-black text-center leading-tight md:leading-[57.6px] transform transition-all duration-300 hover:scale-105">
          TOP SELLING
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 my-6 md:my-10 w-full max-w-7xl">
          {topSelling.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        <Link
          to="/products?sort=soldQuantity&order=desc"
          className="px-4 md:px-6 py-2 md:py-3 bg-transparent border-2 border-black rounded cursor-pointer transition-all duration-300 hover:bg-black hover:text-white hover:shadow-lg transform hover:-translate-y-1 text-sm md:text-base"
        >
          View All
        </Link>
      </section>

      <section className="py-6 md:py-8 px-3 md:px-4 bg-gray-100 rounded-2xl max-w-[1200px] mx-auto text-center transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-5 transform transition-all duration-300 hover:scale-105">
          BROWSE BY DRESS STYLE
        </h2>
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-5 justify-center">
          {["Casual", "Formal", "Party", "GYM"].map((style) => (
            <div
              key={style}
              className="bg-transparent transform transition-all duration-500 hover:scale-105 hover:shadow-lg"
            >
              <img
                src={`/images/${style}.png`}
                alt={`${style} Style`}
                className="block w-full md:w-auto h-auto transition-all duration-500 hover:brightness-110"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 md:py-16 px-3 md:px-5 bg-gray-50 transition-transform duration-300">
        <h2 className="text-2xl md:text-4xl font-bold text-center transition-transform duration-300 hover:scale-105">
          OUR HAPPY CUSTOMERS
        </h2>

        <div className="relative mt-6 md:mt-10">
          <button
            onClick={() => handleReviewScroll('left')}
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-gray-300 hover:bg-gray-400 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md focus:outline-none z-10"
          >
            &lt;
          </button>

          <div
            ref={reviewContainerRef}
            className="flex gap-4 md:gap-5 overflow-x-auto hide-scrollbar px-12 scroll-smooth"
          >
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <Review key={index} review={review} />
              ))
            ) : (
              <p className="text-center text-gray-500 w-full">
                Loading reviews...
              </p>
            )}
          </div>

          <button
            onClick={() => handleReviewScroll('right')}
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-gray-300 hover:bg-gray-400 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md focus:outline-none z-10"
          >
            &gt;
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;