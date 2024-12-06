import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

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
import OrderSuccess from "./pages/Checkout/OrderSuccess";
import OrderFailed from "./pages/Checkout/OrderFailed";
import Account from "./pages/Profile/Account/Account";
import { ProfileLayout } from "./utils/ProfileLayout";

import OrderDetailsComponent from "./components/OrderDetailsComponent";
import Order from "./pages/Profile/Order/Order";
import Review from "./pages/Profile/Reviews/Review";
import ProductTable from "./components/admin/ProductTable";
import { PageNotFound } from "./pages/PageNotFound";
import VoucherTable from "./components/admin/VouchersTable";
import BrandTable from "./components/admin/BrandTable";
import CategoryTable from "./components/admin/CategoryTable";
import OrderTable from "./components/admin/OrderTable";
import { UnderConstructionPage } from "./pages/UnderConstructionPage";
import ManageProductVariant from "./components/admin/ManageProductVariant";


function App() {
  return (
    <FetchDataProvider>
    <AuthProvider>
      <ScrollToTop />
       <Routes>
        <Route path="*" element={<PageNotFound/>} />
        <Route path="coming-soon" element={<UnderConstructionPage/>} />

        <Route path="about" element={<AboutUs />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<HomeLayout />}>
          <Route path="" element={<Home />} />
          <Route path="home" element={<Home />} />
      
        
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
         
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* Authenticated user layout */}
        <Route path="/" element={<ProtectedLayout />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success/:id" element={<OrderSuccess />} />
          
          <Route path="/checkout/failed/:id" element={<OrderFailed />} />
          <Route path="/profile" element={<ProfileLayout />}>
            {/* Nested routes within Profile */}
            <Route path="account" element={<Account />} />
            <Route path="orders" element={<Order />} />
            <Route path="orders/:orderId" element={<OrderDetailsComponent />} />
            <Route path="reviews" element={<Review />} />
            {/* <Route path="settings" element={<AccountSettings />} /> */}
          </Route>
          <Route path="/cart" element={<Cart />} />
        </Route>
        {/* Admin layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products" element={<ProductTable />} />
          <Route path="vouchers" element={<VoucherTable />} />
          <Route path="brands" element={<BrandTable />} />
          <Route path="categories" element={<CategoryTable />} />
          <Route path="orders" element={<OrderTable />} />
          <Route path="products/:productId" element={<ManageProductVariant />} />


        </Route>

      </Routes>
    </AuthProvider>
    </FetchDataProvider>
  );
}

export default App;
