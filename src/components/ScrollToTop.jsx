import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Cuộn mượt khi route thay đổi
    });
  }, [location]); // Chạy khi location thay đổi (tức là khi route thay đổi)

  return null;
};

export default ScrollToTop;
