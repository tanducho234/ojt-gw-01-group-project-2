import {
  UserOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Drawer, Grid } from "antd";
import Account from "../pages/Profile/Account/Account";
import Order from "../pages/Profile/Order/Order";
import Reviews from "../pages/Profile/Reviews/Review";
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, Outlet } from "react-router-dom";
import ProfileAddress from "../components/AddressProfileUser";

const items = [
  UserOutlined, // Account
  ShoppingCartOutlined, // Orders
  StarOutlined, // Reviews
  LogoutOutlined, // Log Out
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: (
    <Link to={["account", "orders", "reviews", "/logout"][index]}>
      {["Account", "Orders", "Reviews", "Log Out"][index]}
    </Link>
  ),
}));

const { Content } = Layout;

export const ProfileLayout = () => {
  const { logout } = useAuth();
  const [selectedKey, setSelectedKey] = useState("1");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const screens = Grid.useBreakpoint(); // Get the current screen size

  // Close the drawer when switching to a large screen
  useEffect(() => {
    if (screens.lg) {
      setDrawerVisible(false);
    }
  }, [screens.lg]);

  const renderContent = (key) => {
    switch (key) {
      case "1":
        return <Account />;
      case "2":
        return <Order />;
      case "3":
        return <Reviews />;
      case "4":
        logout();
        return null;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <Layout>
      {/* Icon menu for small screens */}
      {!screens.lg && (
        <MenuOutlined
          onClick={() => setDrawerVisible(true)}
          style={{
            fontSize: "24px",
            margin: "16px", // Adjust position
            cursor: "pointer",
            width:"20px",
          }}
        />
      )}

      {/* Drawer for small screens */}
      <Drawer
        title="Profile Menu"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width="50%"
         // Occupy half of the screen width
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => {
            setSelectedKey(e.key);
            setDrawerVisible(false); // Close Drawer after selection
            if (e.key === "4") logout();
          }}
          items={items}
          
        />
      </Drawer>

      {/* Sidebar for large screens */}
      {screens.lg && (
        <Layout.Sider
          width={200}
          className="site-layout-background"
          style={{
            top: 0,
            background: "white",
            minHeight: "full",
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={(e) => {
              setSelectedKey(e.key);
              if (e.key === "4") logout();
            }}
            items={items}
          />
        </Layout.Sider>
      )}

      <Layout>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "white",
              borderRadius: "20px",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
