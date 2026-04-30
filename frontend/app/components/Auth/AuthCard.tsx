"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../lib/api";

export default function AuthCard({ mode }: { mode: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch(`/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Auth failed");
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#0f0f11] border border-[#2a2a2e] rounded-2xl p-8 shadow-lg space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-semibold">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-sm text-gray-400">
          {mode === "login"
            ? "Login to continue"
            : "Start your journey with us"}
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          className="w-full p-3 bg-[#111] border border-[#2a2a2e] rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-[#111] border border-[#2a2a2e] rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition disabled:opacity-50"
      >
        {loading
          ? "Please wait..."
          : mode === "login"
          ? "Login"
          : "Create Account"}
      </button>

      {/* Footer Links */}
      <div className="text-center text-sm text-gray-400">
        {mode === "login" ? (
          <>
            Don’t have an account?{" "}
            <Link href="/register" className="text-white hover:underline">
              Register
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}