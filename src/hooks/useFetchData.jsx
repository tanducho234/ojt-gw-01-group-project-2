import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "./useAuth";
import { set } from "react-hook-form";

const FetchDataContext = createContext();

// API base URL
const URL = "https://ojt-gw-01-final-project-back-end.vercel.app";

export const FetchDataProvider = ({ children }) => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [styles, setStyles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([
    "Green",
    "Red",
    "Yellow",
    "Orange",
    "Blue",
    "Purple",
    "Pink",
    "White",
    "Black",
    "Brown",
    "Gray",
    "HotPink",
  ]);
  const [sizes, setSizes] = useState(["S", "M", "L", "XL"]);
  const [error, setError] = useState(null);

  // Cart item count state
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch data (categories, styles, brands, and cart item count)
  const fetchData = async () => {
    try {
      const [categoryResponse, styleResponse, brandResponse, cartResponse] =
        await Promise.all([
          axios.get(`${URL}/api/categories`),
          axios.get(`${URL}/api/styles`),
          axios.get(`${URL}/api/brands`),
          axios.get(`${URL}/api/carts`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      setCategories(categoryResponse.data);
      setStyles(styleResponse.data);
      setBrands(brandResponse.data);
      console.log("cart data", cartResponse);
      const totalQuantity = cartResponse.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartItemCount(totalQuantity); // Set cart item count from the API response
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      console.log("Brands/Categories/Styles mounted");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run once on mount

  // Function to update cart item count on backend
  const updateCartItemCount = async () => {
    try {
      const cartResponse = await axios.get(`${URL}/api/carts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const totalQuantity = cartResponse.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartItemCount(totalQuantity);
    } catch (err) {
      console.error("Failed to update cart count:", err);
      setError("Failed to update cart count");
    }
  };

  // Memoize context value to optimize re-renders
  const value = useMemo(
    () => ({
      categories,
      styles,
      brands,
      colors,
      sizes,
      cartItemCount,
      refetchData: fetchData, // Function to refetch data
      updateCartItemCount, // Function to update cart item count
    }),
    [categories, styles, brands, cartItemCount] // Add cartItemCount to dependencies to update context value
  );

  return (
    <FetchDataContext.Provider value={value}>
      {children}
    </FetchDataContext.Provider>
  );
};

// Custom hook to access FetchData context
export const useFetchData = () => {
  return useContext(FetchDataContext);
};
