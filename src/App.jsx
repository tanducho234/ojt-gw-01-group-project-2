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
import { FetchDataProvider } from "./hooks/useFetchData";
import { AdminRoute } from "./utils/AdminRoute";
import { Dashboard } from "./pages/Admin/Dashboard";
import { AdminLogin } from "./pages/Admin/Login";
import { AddProduct } from "./pages/Admin/AddProduct";

function App() {
  return (
    <AuthProvider>
      <FetchDataProvider>
        <Navbar />
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
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }>
            <Route path="dashboard" element={<Dashboard />} />
            {/* <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} /> */}
          </Route>
          {/* <Route path="/admin/products" element={<AdminRoute></AdminRoute>} /> */}
        </Routes>
        <Footer />
      </FetchDataProvider>
    </AuthProvider>
  );
}

export default App;
