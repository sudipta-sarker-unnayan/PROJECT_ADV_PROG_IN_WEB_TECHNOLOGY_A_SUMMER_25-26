"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth/AuthContext";

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      router.replace(user ? "/dashboard" : "/login");
    }
  }, [isLoading, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );
}