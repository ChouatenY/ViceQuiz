import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-primary z-[10] h-fit border-b border-secondary py-2 ">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-2">
          <div className="flex items-center transition-all hover:-translate-y-[2px]">
            <Image
              src="/logo.png"
              alt="Quizzzy Logo"
              width={120}
              height={120}
              className="mr-2"
            />

          </div>
        </Link>
        <div className="flex items-center">
          <ThemeToggle className="mr-4" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
