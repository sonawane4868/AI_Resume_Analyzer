"use client";
import { useEffect, useRef, useState } from "react";

export default function ReanalyzePanel({
  onAnalyze,
  defaultValues,
}: any) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [jobRole, setJobRole] = useState("");
  const [requiredExp, setRequiredExp] = useState(0);
  const [jd, setJd] = useState("");

  useEffect(() => {
    if (defaultValues) {
      setJobRole(defaultValues.jobRole || "");
      setRequiredExp(defaultValues.requiredExp || 0);
      setJd(defaultValues.jd || "");
    }
  }, [defaultValues]);

  const handleSubmit = () => {
    // 🔥 If new files added → normal analyze
    if (files.length > 0) {
      onAnalyze({
        files,
        jobRole,
        requiredExp,
        jd,
      });
      return;
    }

    // 🔥 Otherwise reuse existing resume
    onAnalyze({
      candidateId: defaultValues?.candidateId,
      reuse: true,
      jobRole,
      requiredExp,
      jd,
    });
  };

  return (
    <div className="bg-[#111113] border border-[#1f1f23] rounded-2xl p-8 w-full max-w-4xl">

      <h2 className="text-xl font-semibold mb-6">
        Re-analyze Candidate
      </h2>

      {/* 🔥 EXISTING RESUME CHIP */}
      <div className="flex flex-wrap gap-2">
        <div className="bg-[#1a1a1c] px-3 py-1 rounded text-xs">
          {defaultValues?.fileName || "Existing Resume"}
        </div>
      </div>

      {/* 🔥 ADD MORE FILES */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border border-dashed border-[#2a2a2e] rounded-xl p-4 text-center cursor-pointer hover:bg-[#161618] mt-4"
      >
        <p className="text-sm text-gray-400">
          + Add / Replace Resume
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) =>
          setFiles(Array.from(e.target.files || []))
        }
      />

      {/* 🔥 NEW FILE PREVIEW (same UI as UploadPanel) */}
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

      {/* 🔥 INPUTS (editable) */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <input
          className="input"
          placeholder="Job Role"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        />

        <input
          type="number"
          className="input"
          placeholder="Experience"
          value={requiredExp}
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

      {/* 🔥 ACTION */}
      <button
        onClick={handleSubmit}
        className="bg-white text-black px-6 py-3 rounded-xl font-medium mt-6 w-full"
      >
        {files.length > 0 ? "Analyze New Resume" : "Re-analyze"}
      </button>
    </div>
  );
}