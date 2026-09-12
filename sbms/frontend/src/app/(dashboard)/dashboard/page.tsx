"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../../lib/auth/AuthContext";
import { RoleName } from "../../../lib/types/auth.types";
import { fetchDashboardStats } from "../../../lib/api/dashboard.api";
import { DashboardStats } from "../../../lib/types/dashboard.types";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSuperAdmin = user?.role === RoleName.SUPER_ADMIN;
  const isLoading = isSuperAdmin && !stats && !error;
  const forbidden = searchParams.get("error") === "forbidden";
  useEffect(() => {
    if (!isSuperAdmin) return;

    let cancelled = false;
    fetchDashboardStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load dashboard stats");
      });

    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-base-content">
        Welcome, {user?.name}
      </h1>
      <p className="text-base-content/60 mt-1">Role: {user?.role}</p>
      {forbidden && (
        <div className="alert alert-warning mt-4">
You don&apos;t have permission to access that page.        </div>
     )}
      {isSuperAdmin && (
        <div className="mt-6">
          {error && <div className="alert alert-error mb-4">{error}</div>}

          {isLoading ? (
            <span className="loading loading-spinner" />
          ) : stats ? (
            <div className="stats stats-vertical sm:stats-horizontal shadow w-full">
              <div className="stat">
                <div className="stat-title">Total Users</div>
                <div className="stat-value">{stats.totalUsers}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Total Employees</div>
                <div className="stat-value">{stats.totalEmployees}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Total Departments</div>
                <div className="stat-value">{stats.totalDepartments}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Total Clients</div>
                <div className="stat-value">{stats.totalClients}</div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <button onClick={logout} className="btn btn-outline btn-error mt-4">
        Logout
      </button>
    </div>
  );
}
