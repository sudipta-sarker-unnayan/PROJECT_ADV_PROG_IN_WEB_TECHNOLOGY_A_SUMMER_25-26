"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthContext";
import { isRouteAllowed } from "../../lib/auth/roles";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthorized = !!user && isRouteAllowed(pathname, user.role);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isRouteAllowed(pathname, user.role)) {
      router.replace("/dashboard?error=forbidden");
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
