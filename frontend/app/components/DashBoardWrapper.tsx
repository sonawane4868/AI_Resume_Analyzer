"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import UploadPanel from "../components/UploadPanel";
import Dashboard from "../components/Dashboard";
import LoadingOverlay from "../components/LoadingOverlay";
import ReanalyzePanel from "../components/ReanalyzePanel";
import { apiFetch } from "../../app/components/lib/api";
import { useSearchParams } from "next/navigation";

export default function DashBoardWrapper() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  // 🔥 NEW: reanalyze state
  const [reanalyzeData, setReanalyzeData] = useState<any>(null);

  // const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidateId");

  // // 🔥 AUTH CHECK (UNCHANGED)
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const res = await fetch("http://localhost:8000/analyze-history", {
  //       credentials: "include",
  //     });

  //     if (res.status === 401) {
  //       router.push("/login");
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  // 🔥 FETCH CANDIDATE FOR REANALYZE
  useEffect(() => {
    if (!candidateId) return;

    const fetchCandidate = async () => {
      const res = await apiFetch(`/candidate/${candidateId}`);
      const data = await res.json();

      setReanalyzeData({
        jobRole: data.job_role,
        requiredExp: data.exp_years,
        jd: data.job_description,
        candidateId: data.candidate_id,
        fileName: data.file_name,
      });

      setData(null); // 🔥 hide dashboard
    };

    fetchCandidate();
  }, [candidateId]);

  // 🔥 ORIGINAL CONFIG (UNCHANGED)
  const [jobConfig, setJobConfig] = useState<any>({
    jobRole: "",
    requiredExp: 0,
    jd: "",
  });

  // 🔥 ANALYZE HANDLER (extended, not broken)
  const handleAnalyze = async (payload: any) => {
    setLoading(true);

    try {
      // 🔥 REANALYZE FLOW
      if (payload.reuse) {
        const res = await apiFetch(
          `/candidate/reanalyze/${payload.candidateId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              job_role: payload.jobRole,
              required_exp: payload.requiredExp,
              job_description: payload.jd,
            }),
          }
        );

        const result = await res.json();

        setData({ results: [result] });
        setReanalyzeData(null);
        setLoading(false);
        return;
      }

      // 🔥 ORIGINAL FLOW (UNCHANGED)
      if (!jobConfig.jobRole) {
        setJobConfig({
          jobRole: payload.jobRole,
          requiredExp: payload.requiredExp,
          jd: payload.jd,
        });
      }

      const formData = new FormData();

      payload.files.forEach((f: File) =>
        formData.append("files", f)
      );

      formData.append("job_role", payload.jobRole);
      formData.append("required_exp", String(payload.requiredExp));

      if (payload.jd?.trim()) {
        formData.append("job_description", payload.jd);
      }

      const res = await apiFetch("/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("Session expired. Please login again.");
          window.location.href = "/login";
          return;
        }
      }

      const result = await res.json();

      setData((prev: any) => {
        if (!prev) return result;

        return {
          ...result,
          results: [...prev.results, ...result.results].sort(
            (a, b) => b.score - a.score
          ),
        };
      });
    } catch (err) {
      console.error(err);
      alert("API error");
    }

    setShowUploader(false);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0b0b0c] text-white">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6">
        <Topbar onAddMore={() => setShowUploader(true)} />

        {/* 🔥 REANALYZE MODE */}
        {!data && reanalyzeData && (
          <ReanalyzePanel
            onAnalyze={handleAnalyze}
            defaultValues={reanalyzeData}
          />
        )}

        {/* 🔥 NORMAL MODE (UNCHANGED UI) */}
        {!data && !reanalyzeData && (
          <div className="w-full">
            <UploadPanel onAnalyze={handleAnalyze} />
          </div>
        )}

        {/* 🔥 DASHBOARD (UNCHANGED) */}
        {data && (
          <Dashboard
            data={data}
            onAddMore={() => setShowUploader(true)}
          />
        )}
      </div>

      {/* 🔥 MODAL (UNCHANGED) */}
      {showUploader && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowUploader(false)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowUploader(false)}
              className="absolute -top-3 -right-3 bg-[#1a1a1c] border border-[#2a2a2e] w-8 h-8 rounded-full text-sm flex items-center justify-center hover:bg-[#222]"
            >
              ✕
            </button>

            <UploadPanel
              modal={true}
              onAnalyze={handleAnalyze}
              defaultValues={jobConfig}
            />
          </div>
        </div>
      )}

      {loading && <LoadingOverlay />}
    </div>
  );
}