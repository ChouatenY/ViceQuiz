import Link from "next/link";
import React from "react";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="fixed inset-x-0 top-0 bg-white z-[10] h-fit border-b border-secondary py-2 shadow-sm">
      <div className="flex items-center justify-between h-150 gap-2 px-8 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-2">
          <div className="flex items-center transition-all hover:-translate-y-[2px]">
            <Image
              src="/logo.png"
              alt="Quizzzy Logo"
              width={140}
              height={140}
              className="mr-2"
            />
            <p className="text-xl font-bold text-primary">
              Quizzzy
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
