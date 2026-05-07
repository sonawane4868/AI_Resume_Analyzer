"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import UploadModal from "./UploadModal";

export default function CTA(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative z-0  py-0 text-center overflow-hidden">
      
      {/* background glow */}
      {/* <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-green-400/10 blur-[120px]" />
      </div> */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-ful mx-auto bg-[#11161C]/70 backdrop-blur-xl border border-white/10  py-32 px-12"
      >
        <h2 className="text-4xl font-bold text-white">
          Start analyzing resumes in seconds
        </h2>

        <p className="text-gray-400 mt-4">
          Get ATS scores, ranking, and AI insights instantly.
        </p>

        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 py-4 bg-green-400 text-black rounded-lg font-medium shadow-lg shadow-green-400/30 hover:shadow-green-400/50 transition"
        >
          Get Started
        </motion.button>

        <p className="text-gray-500 text-sm mt-4">
         Instant results
        </p>
      </motion.div>

      {/* MODAL */}
      <UploadModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}