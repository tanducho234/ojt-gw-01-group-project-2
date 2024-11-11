import React from "react";
import "./Home.css";
import { products } from "../../assets/dataexample";
function Home() {
  console.log(products);
  return (
    <div className="home">
      <h1>Welcome to Our Store</h1>
      <p>Browse through our categories and products!</p>
    </div>
  );
}

export default Home;
