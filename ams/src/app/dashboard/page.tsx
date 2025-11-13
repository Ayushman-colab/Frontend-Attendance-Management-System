"use client";

import { useRouter } from "next/navigation";
import { useEffect , useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux/store/hooks";
import { logoutAction } from "@/app/redux/store/slices/authSlice";
import authService from "@/services/authService";


export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [countActiveUsers, setcountActiveUsers] = useState<number | null>(null);
  const [countInActiveUsers, setcountInActiveUsers] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const data = await authService.countInActiveUsers();
        setcountInActiveUsers(data.count || data); // adjust if API returns { count: number }
      } catch (err) {
        console.error("Failed to fetch user count:", err);
      }
    };
    fetchUserCount();
  }, []);


  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const data = await authService.countUsers();
        setUserCount(data.count || data); // adjust if API returns { count: number }
      } catch (err) {
        console.error("Failed to fetch user count:", err);
      }
    };
    fetchUserCount();
  }, []);

    useEffect(() => {
    const fetchcountActiveUsers = async () => {
      try {
        const data = await authService.countActiveUsers();
        setcountActiveUsers(data.count || data); // adjust if API returns { count: number }
      } catch (err) {
        console.error("Failed to fetch user count:", err);
      }
    };
    fetchcountActiveUsers();
  }, []);

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
            title="Users"
            description={
              userCount !== null
                ? `${userCount}`
                : "Loading user count..."
            }
            onClick={() => router.push("/dashboard/users/allusers")}
          />
          <DashboardCard
            title="Active Users"
            description={
              userCount !== null
                ? `${countActiveUsers}`
                : "Loading user count..."
            }
            onClick={() => router.push("/dashboard/users/activeusers")}
          />
          <DashboardCard
            title="Inactive Users"
            description={
              userCount !== null
                ? `${countInActiveUsers}`
                : "Loading user count..."
            }
            onClick={() => router.push("/dashboard/users/inactiveusers")}
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
