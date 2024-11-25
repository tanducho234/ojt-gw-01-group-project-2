import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";

import AboutUs from "./pages/About/About";
import Profile from "./pages/Profile/Profile";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import { AdminRoute } from "./utils/AdminRoute";
import { Dashboard } from "./pages/Admin/Dashboard";
import { AdminLogin } from "./pages/Admin/Login";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <ScrollToTop/>
      <Routes>
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />{" "}
        {/* <Route
          path=""
          element={<ProtectedRouteHome />}
          children={[
            {
              path: "home",
              element: <Home />,
            },
          ]}
        /> */}
                <Route path="/" element={<Home />} />

        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />

        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* <Route path="/admin/login" element={<Login />} /> */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        {/* <Route path="/admin/products" element={<AdminRoute></AdminRoute>} /> */}
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
