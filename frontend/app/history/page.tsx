"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../components/lib/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function HistoryPage() {
  const [data, setData] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<string>("");
  const [search, setSearch] = useState("");

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchHistory = async () => {
      const res = await apiFetch("/analyze-history");
      const json = await res.json();
      setData(json);
    };

    fetchHistory();
  }, []);

  // 🔥 GROUP BY ROLE
  const grouped =
    data?.results?.reduce((acc: any, item: any) => {
      if (!acc[item.job_role]) acc[item.job_role] = [];
      acc[item.job_role].push(item);
      return acc;
    }, {}) || {};

  // 🔥 GLOBAL SEARCH FILTER
  const searchLower = search.toLowerCase();

  let filteredGrouped = grouped;

  if (search) {
    filteredGrouped = Object.fromEntries(
      Object.entries(grouped).map(([role, items]: any) => [
        role,
        items.filter((r: any) =>
          r.name.toLowerCase().includes(searchLower)
        ),
      ])
    );
  }

  const roles = Object.keys(filteredGrouped);

  // 🔥 DEFAULT TAB
  useEffect(() => {
    if (roles.length > 0 && !activeRole) {
      setActiveRole(roles[0]);
    }
  }, [roles, activeRole]);

  // 🔥 AUTO SWITCH TAB ON SEARCH
  useEffect(() => {
    if (!search) return;

    for (const role of Object.keys(filteredGrouped)) {
      if (filteredGrouped[role].length > 0) {
        setActiveRole(role);
        break;
      }
    }
  }, [search , filteredGrouped]);

  // 🔥 EMPTY CHECK
  const hasAnyResults = Object.values(filteredGrouped).some(
    (arr: any) => arr.length > 0
  );

  if (!data) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-[#0b0b0c] text-white">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6">
        {/* 🔥 SEARCH CONTROLLED HERE */}
        <Topbar search={search} setSearch={setSearch} />

        <h1 className="text-xl font-semibold">Candidate History</h1>

        {/* 🔥 TABS */}
        <div className="flex gap-3 flex-wrap">
          {roles.map((role: string) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1 rounded-lg border text-sm ${
                activeRole === role
                  ? "bg-white text-black"
                  : "border-[#2a2a2e] text-gray-400"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* 🔥 LIST */}
        <div className="space-y-3">
          {!hasAnyResults ? (
            <p className="text-gray-500 text-sm">
              No candidates found
            </p>
          ) : (
            filteredGrouped[activeRole]?.map((r: any, i: number) => (
              <div
                key={i}
                className="p-4 border border-[#1f1f23] rounded-xl flex justify-between items-center hover:bg-[#111113]"
              >
                <div>
                  <p className="font-medium">{r.name}</p>

                  <p className="text-sm text-gray-500">
                    Candidate Exp - {r.exp_years} yrs
                  </p>

                  {r.campared_exp && (
                    <p className="text-sm text-gray-500">
                      Compared Exp - {r.campared_exp} yrs
                    </p>
                  )}

                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <p className="text-lg font-semibold text-green-400">
                    {r.score}/10
                  </p>

                  <a
                    href={`http://localhost:8000/candidate/file/${r.candidate_id}`}
                    download
                    target="_blank"
                    className="px-3 py-1 border rounded-md text-xs hover:bg-[#1a1a1c]"
                  >
                    View / Download Resume
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}