import Navoptions from "@/components/Navoptions";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-screen w-full">
      <Navoptions />

      {children}
    </main>
  );
}
