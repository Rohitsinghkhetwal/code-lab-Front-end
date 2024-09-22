import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
      <div className="flex h-screen w-full sticky top-0 items-center justify-end bg-sky-1 max-lg:hidden ">
        <div className="flex items-center justify-center p-[150px] w-full md:mr-[40px]">
          <Image
          src="/icons/login.png"
          alt="log-n_img"
          width={700}
          height={500}
          />

        </div>

      </div>
    </main>
   
  );
}