import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = ({ category, filters }) => {
  const location = useLocation();

  const generateTrail = () => {
    const trail = [{ name: "Home", path: "/" }];
    if (location.pathname.includes("products")) {
      trail.push({ name: "Products", path: "/products" });
    }
    if (category) {
      trail.push({ name: category, path: `/products?category=${category}` });
    }
    if (filters) {
      trail.push({ name: filters, path: location.pathname });
    }
    return trail;
  };

  const trail = generateTrail();

  return (
    <nav className="breadcrumb">
      {trail.map((crumb, index) => (
        <span key={index}>
          <Link to={crumb.path}>{crumb.name}</Link>
          {index < trail.length - 1 && " > "}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
