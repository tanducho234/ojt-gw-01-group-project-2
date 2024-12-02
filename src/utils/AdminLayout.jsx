import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import React from "react";

import { Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;
const siderStyle = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};
import { Link } from "react-router-dom";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
} from "@ant-design/icons"; // Đảm bảo bạn đã import đúng icons

const items = [
  { icon: UserOutlined, label: "Users", key: "users", to: "/users" },
  {
    icon: VideoCameraOutlined,
    label: "Dashboard",
    key: "dashboard",
    to: "/dashboard",
  },
  { icon: UploadOutlined, label: "Products", key: "products", to: "/products" },
  {
    icon: BarChartOutlined,
    label: "Order Details",
    key: "order-details",
    to: "/order-details",
  },
  { icon: CloudOutlined, label: "Brands", key: "brands", to: "/brands" },
  {
    icon: AppstoreOutlined,
    label: "Categories",
    key: "categories",
    to: "/categories",
  },
  { icon: TeamOutlined, label: "Styles", key: "styles", to: "/styles" },
  { icon: ShopOutlined, label: "Vouchers", key: "vouchers", to: "/vouchers" },
  { icon: ShopOutlined, label: "Shop", key: "shop", to: "/shop" }, // Nếu cần tab Shop
].map(({ icon, label, key, to }) => ({
  key,
  icon: React.createElement(icon),
  label: <Link to={`/admin${to}`}>{label}</Link>,
}));

export const AdminLayout = () => {
  const { user } = useAuth();
  const {
    token: { colorBgContainer = "white", borderRadiusLG },
  } = theme.useToken();

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return (
    <Layout hasSider>
      <Sider theme="light" style={siderStyle}>
        <div className="demo-logo-vertical">
          <img
            src="/assets/images/Logofast.png"
            alt="Shop Logo"
            className="h-15 w-auto"
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[
            window.location.pathname.split("/admin/")[1]?.split("/")[0] 
            
          ]}
          items={items}
        />
      </Sider>
      <Layout
        style={{
          marginInlineStart: 200,
        }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}>
          <div
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}>
          Admin page - Faster team
        </Footer>
      </Layout>
    </Layout>
  );
};
