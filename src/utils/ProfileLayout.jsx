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
  {
    icon: <UserOutlined />,
    label: "Account",
    key: "account",
    to: "/account",
  },
  {
    icon: <ShoppingCartOutlined />,
    label: "Orders",
    key: "orders",
    to: "/orders",
  },
  {
    icon: <StarOutlined />,
    label: "Reviews",
    key: "reviews",
    to: "/reviews",
  },
  {
    icon: <LogoutOutlined />,
    label: "Log Out",
    key: "logout",
    onClick: () => {
      logout();
    },
  },
].map(({ icon, label, key, to, onClick }) => ({
  key,
  icon,
  label: to ? <Link to={`/profile${to}`}>{label}</Link> : label,
  onClick,
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
            defaultSelectedKeys={[
              window.location.pathname.split("/profile/")[1]?.split("/")[0],
            ]}
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
