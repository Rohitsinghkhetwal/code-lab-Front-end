"use client";
import Link from "next/link";
import React from "react";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Footer from "./Footer";

const Navoptions = () => {
  const pathname = usePathname();
  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r border-gray-200 bg-white pt-8 text-white max-md:hidden sm:p-4 xl:p-6 2xl:w-[355px]">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
          <h1 className="text-[26px] font-bold text-black">CodeLab</h1>
          <Image src="/icons/CodeLab.svg" alt="lab" width={30} height={30} />
        </Link>

        {sidebarLinks.map((items) => {
          const isActive =
            pathname === items.route || pathname.startsWith(`${items.route}/`);
          return (
            <Link
              href={items.route}
              key={items.label}
              className={cn(
                "flex gap-3 items-center py-1 md:p-3 2xl:p-4 rounded-lg justify-center xl:justify-start",
                { "bg-slate-700": isActive }
              )}
            >
              <div className="relative size-6">
                <Image
                  src={items.imgURL}
                  alt={items.label}
                  fill
                  className={cn({
                    "brightness-0 invert": isActive,
                  })}
                />
              </div>

              <p
                className={cn(
                  "text-16 font-semibold text-black max-xl:hidden",
                  { "!text-white": isActive }
                )}
              >
                {items.label}
              </p>
            </Link>
          );
        })}
      </nav>
      <Footer />
    </section>
  );
};

export default Navoptions;
