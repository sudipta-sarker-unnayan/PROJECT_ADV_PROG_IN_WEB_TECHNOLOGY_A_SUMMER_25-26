"use client";

import { useAuth } from "../../../lib/auth/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-base-content">
        স্বাগতম, {user?.name}
      </h1>
      <p className="text-base-content/60 mt-1">Role: {user?.role}</p>
      <button onClick={logout} className="btn btn-outline btn-error mt-4">
        Logout
      </button>
    </div>
  );
}