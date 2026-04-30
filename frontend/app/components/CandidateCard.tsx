"use client";
import { useState } from "react";

export default function CandidateCard({ r, index }: any) {
  const [open, setOpen] = useState(false);

  const getColor = () => {
    if (r.score >= 8) return "bg-green-100 text-green-700";
    if (r.score >= 6) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm">

      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
      >
        <div>
          <p className="font-semibold">
            #{index + 1} {r.name}
          </p>

          <div className="flex gap-3 text-xs text-gray-500 mt-1">
            <span>Keyword: {r.keyword}</span>
            <span>Semantic: {r.semantic}</span>
            <span>Exp: {r.exp_years} yrs</span>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getColor()}`}>
          {r.score}/10
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="h-2 bg-gray-100 rounded">
          <div
            className="h-2 bg-black rounded"
            style={{ width: `${r.score * 10}%` }}
          />
        </div>
      </div>

      {open && (
        <div className="border-t p-4 space-y-4">

          <div>
            <h4 className="font-medium mb-2">
              AI Analysis
            </h4>
            <div className="bg-gray-50 p-3 rounded text-sm max-h-60 overflow-y-auto whitespace-pre-line">
              {r.analysis}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-gray-600">
            <div>Keyword: {r.keyword}</div>
            <div>Semantic: {r.semantic}</div>
            <div>Experience: {r.experience}</div>
          </div>
        </div>
      )}
    </div>
  );
}