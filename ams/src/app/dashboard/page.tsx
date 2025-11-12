"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux/store/hooks";
import { logoutAction } from "@/app/redux/store/slices/authSlice";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);
  const handleLogout = async () => {
    await dispatch(logoutAction());
    router.push("/auth/login");
  };

  if (!isAuthenticated) {
    return (
      <div className="dashboard-loading">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Attendance Management System</h1>
        <div className="dashboard-user">
          {user && <p>Hi, {user.firstName}</p>}
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <h2>Dashboard</h2>
        <p>
          Welcome {user?.firstName || "User"} 👋 &nbsp;Here are your management modules:
        </p>

        <div className="dashboard-grid">
          <DashboardCard
            title="Active Users"
            description="View all currently active users in the system"
            onClick={() => router.push("/dashboard/users")}
          />
          <DashboardCard
            title="Roles"
            description="Manage system roles and permissions"
            onClick={() => router.push("/dashboard/roles")}
          />
          <DashboardCard
            title="Permissions"
            description="View and update access permissions"
            onClick={() => router.push("/dashboard/permissions")}
          />
        </div>
      </main>

      <footer className="dashboard-footer">
        © {new Date().getFullYear()} Attendance Management System
      </footer>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <div onClick={onClick} className="dashboard-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="btn-view">View</button>
    </div>
  );
}
