"use client";

import { usePathname } from "next/navigation";
import { apiFetch } from "./lib/api";

export default function Topbar({ onAddMore, search, setSearch }: any) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await apiFetch("/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";
  };

  return (
    <div className="flex justify-between items-center">
      
      {/* 🔥 SHOW SEARCH ONLY ON HISTORY */}
      {pathname === "/history" ? (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search candidates..."
          className="bg-[#111113] border border-[#1f1f23] px-4 py-2 rounded-xl w-80"
        />
      ) : (
        <div /> // keeps layout alignment
      )}

      <div className="flex gap-3">
        {/* 🔥 HIDE ADD BUTTON ON HISTORY */}
        {pathname !== "/history" && (
          <button
            onClick={onAddMore}
            className="bg-white text-black px-4 py-2 rounded-xl"
          >
            + Add Candidates
          </button>
        )}

        <button
          onClick={handleLogout}
          className="border border-[#2a2a2e] px-4 py-2 rounded-xl hover:bg-[#1a1a1c]"
        >
          Logout
        </button>
      </div>
    </div>
  );
}