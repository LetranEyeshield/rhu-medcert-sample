"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import FaceScanner from "../components/FaceScanner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [captured, setCaptured] = useState(false);

  // const [fullName, setFullName] = useState("");
  const [faceDesc, setFaceDesc] = useState<number[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!faceDesc.length) {
      setError("Please capture your face first.");
      return;
    }

    setLoading(true);
    const res = await signIn("credentials", {
      // fullName,
      faceDesc: JSON.stringify(faceDesc),
      redirect: false,
      callbackUrl,
    });
    setLoading(false);

    if (res?.error) {
      setError("Login failed. Check your name or face.");
      return;
    }

    router.push(callbackUrl);
  };

  const handleCapture = (descriptor: number[]) => {
    setFaceDesc(descriptor);
    setCaptured(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 border p-6 rounded shadow bg-white"
      >
        <h1 className="text-2xl font-bold text-center">Face Login</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        /> */}

        <FaceScanner onCapture={handleCapture} />

          {captured && (
          <div className="text-green-600 text-center text-sm font-medium">
            ✅ Face captured successfully <br />
            Now click the login button to proceed.
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-sm text-center">
          Don&apos;t have an account?{" "}
          <a href="/register" className="underline text-blue-600">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}