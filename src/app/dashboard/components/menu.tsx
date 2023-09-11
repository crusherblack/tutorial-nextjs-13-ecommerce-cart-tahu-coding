import {
  TransactionOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  ProfileOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import Link from "next/link";

export type MenuItem = Required<MenuProps>["items"][number];

const getItem = (
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem => {
  const labelLink = <Link href={key}>{label}</Link>;

  return {
    key,
    icon,
    children,
    label: labelLink,
  };
};

export const items: MenuItem[] = [
  //for admin
  getItem("Dashboard", "/dashboard", <DashboardOutlined />),
  getItem("Transactions", "/dashboard/transactions", <TransactionOutlined />),
  getItem("Products", "/dashboard/products", <ContainerOutlined />),
  getItem("Categories", "/dashboard/categories", <AppstoreOutlined />),
  getItem("Profile", "/dashboard/profile", <ProfileOutlined />),
];

export const userItems: MenuItem[] = [
  //for normal user
  getItem("Dashboard", "/dashboard", <DashboardOutlined />),
  getItem("Transactions", "/dashboard/transactions", <TransactionOutlined />),
  getItem("Profile", "/dashboard/profile", <ProfileOutlined />),
];
