"use client";

import React from "react";

import { Button, Skeleton } from "antd";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { status } = useSession();

  return (
    <nav className="h-16 shadow-md flex px-7 items-center justify-between">
      <p className="font-semibold">E-Commerce Tahu Coding</p>
      {status === "unauthenticated" ? (
        <div className="flex gap-2 items-center">
          <Link href="/login">
            <Button type="primary">Login</Button>
          </Link>
          <Link href="/register">
            <Button type="dashed">Register</Button>
          </Link>
        </div>
      ) : status === "authenticated" ? (
        <Link href="/dashboard">
          <Button type="primary">Dashboard</Button>
        </Link>
      ) : (
        <Skeleton.Button active={true} />
      )}
    </nav>
  );
};

export default Navbar;
