"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FileText, BarChart3, Users, Sparkles } from "lucide-react";

const features = [
  {
    title: "AI Resume Parsing",
    desc: "Extract structured data instantly",
    icon: FileText,
  },
  {
    title: "ATS Score",
    desc: "Evaluate resume against job role",
    icon: BarChart3,
  },
  {
    title: "Candidate Ranking",
    desc: "Rank candidates intelligently",
    icon: Users,
  },
  {
    title: "Smart Suggestions",
    desc: "AI-powered improvement tips",
    icon: Sparkles,
  },
];

export default function Features() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="md:px-20 px-10 md:py-28 py-12  relative z-0">
      <h2 className="text-3xl text-white mb-14">Features</h2>

      <div className="grid md:grid-cols-4 grid-cols-1 gap-8">
        {features.map((f, i) => {
          const Icon = f.icon;

          return (
            <motion.div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
            >
              {/* spotlight glow */}
              <div
                className={`absolute inset-0 transition opacity-0 ${
                  hovered === i ? "opacity-100" : ""
                }`}
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(34,197,94,0.15), transparent 70%)",
                }}
              />

              <Icon className="text-green-400 mb-4 relative z-10" size={28} />

              <h3 className="text-white text-lg font-medium relative z-10">
                {f.title}
              </h3>

              <p className="text-gray-400 text-sm mt-2 relative z-10">
                {f.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}