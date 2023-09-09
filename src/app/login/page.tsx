import { OPTIONS } from "../api/auth/[...nextauth]/route";
import Card from "./card";
import Form from "./form";
import { getServerSession } from "next-auth/next";

export default async function Home() {
  const session = await getServerSession(OPTIONS);
  return (
    <main className="flex min-h-screen items-center justify-center">
      {session ? <Card user={session.user?.name} /> : <Form />}
    </main>
  );
}
