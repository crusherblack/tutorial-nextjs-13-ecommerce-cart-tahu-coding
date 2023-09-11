import NonAuthLayout from "@/components/nonAuthLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NonAuthLayout withNavbar>{children}</NonAuthLayout>;
}
