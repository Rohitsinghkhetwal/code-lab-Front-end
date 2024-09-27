import Navoptions from "@/components/Navoptions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const jwtToken = cookieStore.get("refreshToken");

  if (!jwtToken) {
    redirect("/sign-in");
  }
  return (
    <main className="flex h-screen w-full">
      <Navoptions />

      {children}
    </main>
  );
}
