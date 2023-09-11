"use client";

import React, { useState } from "react";

import { Layout, Menu } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { signOut } from "next-auth/react";

import { MenuItem } from "./menu";

const { Sider } = Layout;

const Sidebar: React.FC<{
  defaultSelectedKeys: string[];
  items: MenuItem[];
}> = ({ defaultSelectedKeys = [], items = [] }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div
        style={{
          padding: "1rem",
          fontWeight: 600,
          textAlign: "center",
          color: "white",
        }}
      >
        <h1>LOGO</h1>
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultSelectedKeys}
        mode="inline"
        items={items}
      />
      <Menu
        theme="dark"
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultSelectedKeys}
        mode="inline"
        items={[
          {
            key: "logout",
            label: <div onClick={handleLogout}>Logout</div>,
            icon: <LogoutOutlined />,
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
