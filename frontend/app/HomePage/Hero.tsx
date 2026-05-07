"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero(): JSX.Element {
  return (
    <section className="flex items-center flex-col justify-center w-full min-h-screen md:px-20 px-10 md:py-28 py-12 gap-16 relative z-0">
      {/* TEXT */}
      <div className="max-w-fit text-center">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-white"
        >
          Analyze Resumes with AI
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 text-gray-400"
        >
          Get ATS score, ranking, and insights instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <button className="px-6 py-3 bg-white text-black rounded-lg">
            Get Started
          </button>

          <button className="px-6 py-3 border border-gray-700 rounded-lg">
            View GitHub
          </button>
        </motion.div>
      </div>

      {/* CARD PREVIEW */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        whileHover={{ scale: 1.03 }}
        className="md:w-[75vw] w-[90vw] md:h-[35vw] h-[50vw]  bg-[#11161C] border border-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <Image
         src={'/dashImage.png'}
          alt="dashboard preview"
          width={1200}
          height={800}
          className="w-full h-full object-cover"
          priority
        />
        {/* <img
          src="/dashboard2.png"
          alt="dashboard"
          className="w-full h-full object-cover"
        /> */}
      </motion.div>
    </section>
  );
}
