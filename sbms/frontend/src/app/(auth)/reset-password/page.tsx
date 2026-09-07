"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api/axios";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Token not found, please check the link");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to reset password. Please try again. ");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-base-100 rounded-lg shadow">
        <div className="alert alert-error text-sm">
          Invalid link — Token not found.
        </div>
        <p className="text-sm text-center mt-4">
          <Link href="/forgot-password" className="link">
            Try again
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-base-100 rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Reset Password</h1>

      {success && (
        <div className="alert alert-success mb-4 text-sm">
          Password reset successfully! Redirecting to login page...
        </div>
      )}
      {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Changing..." : "Change Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}