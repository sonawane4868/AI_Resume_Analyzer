"use client";
import { motion } from "framer-motion";
import ScoreChart from "../components/ScoreChart";

export default function Preview() {
  const data = [{ score: 6 }, { score: 6.5 }, { score: 6.6 }, { score: 6.4 }];

  const avg =
    data?.reduce((a: number, b: any) => a + b.score, 0) / data?.length;

  return (
    <section className="md:px-20 px-10 md:py-28 py-12  relative z-0">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-3xl text-white mb-10"
      >
        Live Resume Analysis
      </motion.h2>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-6 pb-5">
        {[
          { title: "Avg Score", value: avg },
          { title: "Candidates", value: "4" },
          { title: "Top Score", value: "6.77" },
        ]?.map((item, i) => (
          <motion.div
            key={i}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }} // ✅ important
            transition={{
              delay: i * 0.15,
              duration: 0.6,
              ease: "easeOut",
            }}
            className="p-6 bg-[#11161C] border border-gray-800 rounded-xl hover:border-green-400 transition"
          >
            <p className="text-gray-400">{item.title}</p>
            <h3 className="text-3xl text-green-400 mt-2">{item.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* ADD GRAPH HERE (IMPORTANT) */}
      <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
>
  <ScoreChart results={data} />
</motion.div>
    </section>
  );
}
