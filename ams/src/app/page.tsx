"use client";

import { useRouter } from "next/navigation";
import { CalendarCheck2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="home-container">
      {/* ======= Header ======= */}
      <header className="home-header">
        <div className="home-header-title">
          <CalendarCheck2 className="home-header-icon" />
          <h1>Attendance Management System</h1>
        </div>
        <button
          onClick={() => router.push("/auth/login")}
          className="btn-login"
        >
          Login
        </button>
      </header>

      {/* ======= Hero Section ======= */}
      <main className="home-hero">
        <h2>Track Attendance. Manage Workforce. Boost Productivity.</h2>
        <p>
          A complete attendance monitoring platform designed for modern organizations.
          Seamlessly manage attendance, track time, and analyze workforce data — securely and efficiently.
        </p>

        <button
          onClick={() => router.push("/auth/login")}
          className="btn-primary"
        >
          Go to Dashboard →
        </button>
      </main>
    </div>
  );
}
