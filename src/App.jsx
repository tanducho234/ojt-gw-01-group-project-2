import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
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
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { FetchDataProvider } from "./hooks/useFetchData";
import { AddProduct } from "./pages/Admin/AddProduct";
import { Dashboard } from "./pages/Admin/Dashboard";
import { AdminLogin } from "./pages/Admin/Login";
import ScrollToTop from "./components/ScrollToTop";
import { ProtectedLayout } from "./utils/ProtectedLayout";
import { HomeLayout } from "./utils/HomeLayout";
import { AdminLayout } from "./utils/AdminLayout";
import Account from "./pages/Profile/Account/Account";
import { ProfileLayout } from "./utils/ProfileLayout";



function App() {
  return (
    <FetchDataProvider>
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        <Route path="/" element={<HomeLayout />}>
          <Route path="" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="login" element={<Login />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* Authenticated user layout */}
        <Route path="/" element={<ProtectedLayout />}>
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/profile" element={<ProfileLayout />}>
            {/* Nested routes within Profile */}
            <Route path="account" element={<Account />} />
            {/* <Route path="settings" element={<AccountSettings />} /> */}
          </Route>
          <Route path="/cart" element={<Cart />} />
        </Route>
        {/* Admin layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products/add" element={<AddProduct />} />
        </Route>
      </Routes>
    </AuthProvider>
    </FetchDataProvider>
  );
}

export default App;
