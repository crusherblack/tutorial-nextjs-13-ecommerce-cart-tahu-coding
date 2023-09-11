import React from "react";
import Navbar from "./navbar";

const NonAuthLayout = ({
  children,
  withNavbar = false,
}: {
  children: React.ReactNode;
  withNavbar?: boolean;
}) => {
  return (
    <>
      {withNavbar && <Navbar />}
      <div className="mx-auto max-w-7xl px-8 min-h-screen">{children}</div>
    </>
  );
};

export default NonAuthLayout;
