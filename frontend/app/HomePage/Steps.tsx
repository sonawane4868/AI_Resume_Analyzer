"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Upload,
  FileText,
  Search,
  Brain,
  BarChart3,
} from "lucide-react";

const steps = [
  {
    title: "Upload Resume",
    desc: "Upload resumes and job description",
    icon: Upload,
  },
  {
    title: "Parse Data",
    desc: "Extract text, skills, and experience",
    icon: FileText,
  },
  {
    title: "Semantic Matching",
    desc: "Match resume with job using similarity",
    icon: Search,
  },
  {
    title: "AI Insights",
    desc: "Generate reasoning and suggestions",
    icon: Brain,
  },
  {
    title: "Results",
    desc: "Get score, ranking and feedback",
    icon: BarChart3,
  },
];

export default function Steps() {
  const [active, setActive] = useState(0);
  const [start, setStart] = useState(false);

  // trigger when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
        }
      },
      { threshold: 0.4 }
    );

    const el = document.getElementById("steps-section");

    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // auto step animation
  useEffect(() => {
    if (!start) return;

    let i = 0;

    const interval = setInterval(() => {
      i++;

      if (i >= steps.length) {
        clearInterval(interval);
        return;
      }

      setActive(i);
    }, 1500);

    return () => clearInterval(interval);
  }, [start]);

  return (
    <section
      id="steps-section"
      className="px-5 sm:px-8 lg:px-20 py-20 lg:py-32 relative z-0"
    >
      <h2 className="text-2xl sm:text-3xl text-white mb-16 lg:mb-20 text-center font-semibold">
        How It Works
      </h2>

      {/* Desktop Timeline */}
      <div className="hidden lg:flex relative justify-between items-center max-w-6xl mx-auto">
        {/* base line */}
        <div className="absolute top-8 left-0 w-full h-[2px] bg-white/10" />

        {/* animated progress line */}
        <motion.div
          animate={{
            width: `${((active + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.6 }}
          className="absolute top-8 left-0 h-[2px] bg-green-400"
        />

        {steps.map((step, i) => {
          const Icon = step.icon;

          return (
            <div
              key={i}
              className="flex flex-col items-center z-10"
            >
              <motion.div
                animate={{
                  scale: active === i ? 1.2 : 1,
                  boxShadow:
                    active === i
                      ? "0px 0px 25px rgba(34,197,94,0.6)"
                      : "0px 0px 0px transparent",
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                }}
                className="relative w-16 h-16 bg-[#11161C] border border-green-400 rounded-full flex items-center justify-center"
              >
                <Icon className="text-green-400 w-6 h-6" />

                {/* pulse */}
                {active === i && (
                  <motion.div
                    animate={{
                      scale: [1, 1.6, 1],
                      opacity: [0.4, 0, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 rounded-full bg-green-400/30"
                  />
                )}
              </motion.div>

              <p className="mt-4 text-gray-300 text-center text-sm">
                {step.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile Timeline */}
      <div className="lg:hidden relative max-w-md mx-auto">
        {/* vertical line */}
        <div className="absolute left-6 top-0 w-[2px] h-full bg-white/10" />

        {/* animated line */}
        <motion.div
          animate={{
            height: `${((active + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.6 }}
          className="absolute left-6 top-0 w-[2px] bg-green-400"
        />

        <div className="space-y-10">
          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <div
                key={i}
                className="relative flex items-start gap-5"
              >
                <motion.div
                  animate={{
                    scale: active === i ? 1.15 : 1,
                    boxShadow:
                      active === i
                        ? "0px 0px 20px rgba(34,197,94,0.5)"
                        : "0px 0px 0px transparent",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="relative z-10 min-w-[50px] w-[50px] h-[50px] bg-[#11161C] border border-green-400 rounded-full flex items-center justify-center"
                >
                  <Icon className="text-green-400 w-5 h-5" />

                  {active === i && (
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 rounded-full bg-green-400/30"
                    />
                  )}
                </motion.div>

                <div className="pt-1">
                  <h3 className="text-white text-base font-medium">
                    {step.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* detail panel */}
      <div className="mt-14 lg:mt-16 max-w-xl mx-auto">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-6 bg-[#11161C] border border-gray-800 rounded-2xl text-center"
        >
          <h3 className="text-lg sm:text-xl text-white font-semibold">
            {steps[active].title}
          </h3>

          <p className="text-sm sm:text-base text-gray-400 mt-2 leading-relaxed">
            {steps[active].desc}
          </p>
        </motion.div>
      </div>
    </section>
  );
}