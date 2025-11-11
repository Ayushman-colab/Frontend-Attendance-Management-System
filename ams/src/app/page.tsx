"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">🏠 Welcome to AMS System</h1>
      <button
        onClick={() => router.push("/auth/login")}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Go to Login
      </button>
    </div>
  );
}
