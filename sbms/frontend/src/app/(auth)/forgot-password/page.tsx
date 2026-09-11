"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "../../../lib/api/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-base-100 rounded-lg shadow">
      <h1 className="text-xl font-bold mb-2">Forgot Password</h1>
      <p className="text-sm text-gray-500 mb-4">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {message && (
        <div className="alert alert-success mb-4 text-sm">{message}</div>
      )}
      {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        <Link href="/login" className="link">
          Back to Login
        </Link>
      </p>
    </div>
  );
}