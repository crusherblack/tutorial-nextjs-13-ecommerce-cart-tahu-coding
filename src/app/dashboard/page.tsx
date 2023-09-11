import { getServerSession } from "next-auth";
import React from "react";
import { OPTIONS } from "../api/auth/[...nextauth]/route";

const Dashboard = async () => {
  const session = await getServerSession(OPTIONS);

  return <div>Welcome: {session?.user?.email}</div>;
};

export default Dashboard;
