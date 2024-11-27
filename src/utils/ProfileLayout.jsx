

import {
    UserOutlined,
    ShoppingCartOutlined,
    StarOutlined,
    LogoutOutlined,
  } from "@ant-design/icons"; // assuming these icons are imported from @ant-design/icons
  
  import {  Layout, Menu } from "antd";
import Account from "../pages/Profile/Account/Account";
import Order from "../pages/Profile/Order/Order";
import Reviews from "../pages/Profile/Reviews/Review";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
const items = [
  UserOutlined, // Account
  ShoppingCartOutlined, // Orders
  StarOutlined, // Reviews
  LogoutOutlined, // Log Out
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: ["Account", "Orders", "Reviews", "Log Out"][index], // Array for labels
}));
const { Sider, Content, Header } = Layout;

export const ProfileLayout = () => {
  const { logout } = useAuth();

  const [selectedKey, setSelectedKey] = useState("1"); // Default to "Account" page
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
      <Sider
        style={{ background: "white" }}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]} // Set selected key
          onClick={(e) => setSelectedKey(e.key)} // Update selected key
          items={items}
        />{" "}
      </Sider>
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
            {renderContent(selectedKey)}{" "}
            {/* Render content based on selected key */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
