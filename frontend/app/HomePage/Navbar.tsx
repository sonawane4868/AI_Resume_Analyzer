"use client";

import Image from "next/image";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center md:px-10 px-5 py-5 border-b border-gray-800 relative z-0">
      {/* <h1 className="text-white font-semibold">Resume AI</h1> */}
      <Image
        src={'/logo2.png'}
        alt="logo"
        width={300}
        height={200}
        className="md:h-[3vw] h-[6vw] md:w-[5vw] w-[15vw] object-contain"
      />

      <div className="flex gap-4">
        <button className="px-4 py-2 border border-gray-700 rounded-lg">
          Login
        </button>
        <button className="px-4 py-2 bg-white text-black rounded-lg">
          Try Demo
        </button>
      </div>
    </div>
  );
}