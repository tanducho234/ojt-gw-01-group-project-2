import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";

const FetchDataContext = createContext();

// API base URL
const URL = "https://ojt-gw-01-final-project-back-end.vercel.app";

export const FetchDataProvider = ({ children }) => {
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
  const [sizes, setSizes] = useState([
    "S",
    "M",
    "L",
    "XL",
  ]);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, styleResponse, brandResponse] =
          await Promise.all([
            axios.get(`${URL}/api/categories`),
            axios.get(`${URL}/api/styles`),
            axios.get(`${URL}/api/brands`),
          ]);
        setCategories(categoryResponse.data);
        setStyles(styleResponse.data);
        setBrands(brandResponse.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        console.log("Brands/Categories/Styles mounted");
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once on mount

  // Memoize context value to optimize re-renders
  const value = useMemo(
    () => ({
      categories,
      styles,
      brands,
      colors,
      sizes,
    }),
    [categories, styles, brands]
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
