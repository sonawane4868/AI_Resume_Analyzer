"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "./lib/api";

export default function CandidateRow({ r, i }: any) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSummary = async () => {
    if (summary) {
      setOpen(!open);
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch(
        `/candidate/summary/${r.candidate_id}`,
        { credentials: "include" },
      );

      const data = await res.json();

      setSummary(data.analysis);
      setOpen(true);
    } catch {
      alert("Failed to fetch summary");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 simple formatter (no heavy parsing)
  const formatText = (text: string) => {
    return text
      .replace(/\*\*/g, "") // remove **
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const formatted = summary ? formatText(summary) : [];

  const scoreColor =
    r.score >= 6.5
      ? "text-green-400"
      : r.score >= 4.5
        ? "text-yellow-400"
        : "text-red-400";

  const scoreColo1r =
    r.score >= 6.5
      ? "text-white bg-green-400 "
      : r.score >= 4.5
        ? "text-white bg-yellow-400"
        : "text-white bg-red-400 ";
  return (
    <div className="border-b border-[#1f1f23]">
      {/* MAIN ROW */}
      <div className="flex justify-between items-center p-4 hover:bg-[#111113]">
        <div>
          <p className="font-medium text-md">
            {i + 1}. {r.name}
          </p>
          <p className="text-sm text-gray-500">Exp: {r.exp_years} yrs</p>
        </div>

        <div className="flex gap-6 text-md items-center">
          <span>K: {r.keyword}</span>
          <span>S: {r.semantic}</span>
          <span>EXP: {r.experience}</span>

          <span className={`font-semibold ${scoreColor}`}>{r.score}/10</span>

          <button
            onClick={handleSummary}
            className="text-sm px-3 py-1 border border-[#2a2a2e] rounded-lg hover:bg-[#1a1a1c]"
          >
            {loading
              ? "Generating..."
              : summary
                ? open
                  ? "Hide"
                  : "Show"
                : "Explain"}
          </button>
          <span
            className={`font-semibold text-md rounded-md py-2 px-3    ${scoreColo1r}`}
          >
            {r.decision}
          </span>
        </div>
      </div>

      {/* 🔥 ANIMATED SUMMARY */}
      <AnimatePresence>
        {open && summary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 bg-[#0f0f11] border-t border-[#1f1f23]">
              <div className="mt-4 space-y-3 text-sm text-gray-300">
                {formatted.map((line, idx) => {
                  const isStrength = line.toLowerCase().includes("strength");
                  const isWeakness = line.toLowerCase().includes("weak");

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex gap-2 ${
                        isStrength
                          ? "text-green-400 font-semibold"
                          : isWeakness
                            ? "text-red-400 font-semibold"
                            : ""
                      }`}
                    >
                      {!isStrength && !isWeakness && (
                        <span className="text-gray-500">•</span>
                      )}
                      <span>{line}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
