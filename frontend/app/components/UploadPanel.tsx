"use client";
import { useRef, useState, useEffect } from "react";

export default function UploadPanel({
  onAnalyze,
  modal,
  defaultValues,
}: any) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [jobRole, setJobRole] = useState("");
  const [requiredExp, setRequiredExp] = useState(0);
  const [jd, setJd] = useState("");

  // 🔥 LOAD DEFAULT VALUES
  useEffect(() => {
    if (defaultValues) {
      setJobRole(defaultValues.jobRole || "");
      setRequiredExp(defaultValues.requiredExp || 0);
      setJd(defaultValues.jd || "");
    }
  }, [defaultValues]);

  // 🔥 ALWAYS USE FALLBACK (THIS FIXES YOUR BUG)
  const handleSubmit = () => {
    const payload = {
      files,
      jobRole: jobRole || defaultValues?.jobRole,
      requiredExp: requiredExp || defaultValues?.requiredExp,
      jd: jd || defaultValues?.jd,
    };

    console.log("FINAL PAYLOAD:", payload); // debug once

    onAnalyze(payload);
  };

  return (
    <div className="bg-[#111113] border border-[#1f1f23] rounded-2xl p-8 w-full max-w-4xl">

      <h2 className="text-xl font-semibold mb-6">
        {modal ? "Add More Candidates" : "Analyze Candidates"}
      </h2>

      {/* UPLOAD */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border border-dashed border-[#2a2a2e] rounded-xl p-6 text-center cursor-pointer hover:bg-[#161618]"
      >
        <p>Click to upload resumes</p>
        <p className="text-xs text-gray-500 mt-1">
          {files.length} selected
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        multiple
        required
        className="hidden"
        onChange={(e) =>
          setFiles(Array.from(e.target.files || []))
        }
      />

      {/* 🔥 SHOW CONFIG IN MODAL (READ-ONLY) */}
      {modal && (
        <div className="mt-4 text-sm text-gray-400">
          Using:{" "}
          <span className="text-white">
            {defaultValues?.jobRole}
          </span>{" "}
          ({defaultValues?.requiredExp} yrs)
        </div>
      )}

      {/* NORMAL INPUTS */}
      {!modal && (
        <>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <input
              className="input"
              placeholder="Job Role"
              value={jobRole}
              required
              onChange={(e) => setJobRole(e.target.value)}
            />

            <input
              type="number"
              className="input"
              placeholder="Experience"
              value={requiredExp}
              required
              onChange={(e) =>
                setRequiredExp(Number(e.target.value))
              }
            />
          </div>

          <textarea
            className="input mt-4 w-full"
            placeholder="Job Description"
            rows={5}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
        </>
      )}

      {/* FILE PREVIEW */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {files.map((f, i) => (
            <div
              key={i}
              className="bg-[#1a1a1c] px-3 py-1 rounded text-xs"
            >
              {f.name}
            </div>
          ))}
        </div>
      )}

      {/* ACTION */}
      <button
        onClick={handleSubmit}
        className="bg-white text-black px-6 py-3 rounded-xl font-medium mt-6 w-full"
      >
        {modal ? "Re-run Analysis" : "Analyze"}
      </button>
    </div>
  );
}