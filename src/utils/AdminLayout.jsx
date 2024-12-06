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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesome Icons
import {
  faUsers,
  faChartBar,
  faShoppingCart,
  faStore,
  faTag,
  faCogs,
  faTshirt,
  faVideo,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons"; // FontAwesome icons

export const AdminLayout = () => {
  const { user } = useAuth();
  const { logout } = useAuth();

  const items = [
    {
      icon: <FontAwesomeIcon icon={faVideo} />,
      label: "Dashboard",
      key: "dashboard",
      to: "/dashboard",
    }, 
    {
      icon: <FontAwesomeIcon icon={faUsers} />,
      label: "Users",
      key: "users",
      to: "/users",
    }, // FontAwesome faUsers
    // FontAwesome faVideo for Dashboard (video-related icon)
    {
      icon: <FontAwesomeIcon icon={faShoppingCart} />,
      label: "Products",
      key: "products",
      to: "/products",
    }, // FontAwesome faShoppingCart
    {
      icon: <FontAwesomeIcon icon={faChartBar} />,
      label: "Orders",
      key: "orders",
      to: "/orders",
    }, // FontAwesome faChartBar for Order Details (graph-like)
    {
      icon: <FontAwesomeIcon icon={faStore} />,
      label: "Brands",
      key: "brands",
      to: "/brands",
    }, // FontAwesome faStore
    {
      icon: <FontAwesomeIcon icon={faCogs} />,
      label: "Categories",
      key: "categories",
      to: "/categories",
    }, // FontAwesome faCogs for Categories (settings icon for configuration)
    // {
    //   icon: <FontAwesomeIcon icon={faTshirt} />,
    //   label: "Styles",
    //   key: "styles",
    //   to: "/styles",
    // }, // FontAwesome faTshirt for Styles
    {
      icon: <FontAwesomeIcon icon={faTag} />,
      label: "Vouchers",
      key: "vouchers",
      to: "/vouchers",
    }, // FontAwesome faTag for Vouchers
    {
      icon: <FontAwesomeIcon icon={faStore} />,
      label: "Shop",
      key: "shop",
      to: "/shop",
    }, // FontAwesome faStore for Shop
    {
      icon: <FontAwesomeIcon icon={faSignOutAlt} />,
      label: "Logout",
      key: "logout",
      onClick: () => {
        logout();
      },
    },
  ].map(({ icon, label, key, to, onClick }) => ({
    key,
    icon,
    label: to ? <Link to={`/admin${to}`}>{label}</Link> : label,
    onClick,
  }));

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
            window.location.pathname.split("/admin/")[1]?.split("/")[0],
          ]}
          items={items}
        />
      </Sider>
      <Layout
        style={{
          marginInlineStart: 200,
        }}>
        {/* <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        /> */}
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
