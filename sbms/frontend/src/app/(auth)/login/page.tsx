"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../lib/auth/AuthContext";
import { loginSchema, LoginFormValues } from "../../../lib/validation/auth.schema";

export default function LoginPage() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await login(values);
    } catch {
      setServerError("Invalid email or password. Please verify your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-base-content px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-content flex items-center justify-center font-bold text-xl">
              S
            </div>
            <h1 className="text-2xl font-bold text-base-content">SBMS Portal</h1>
            <p className="text-sm text-base-content/60">Smart Business Management System</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
            <label className="form-control">
              <span className="label-text font-medium mb-1">Email Address</span>
              <input
                type="email"
                placeholder="admin@sbms.com"
                className="input input-bordered w-full"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-error text-sm mt-1">{errors.email.message}</span>
              )}
            </label>

            <label className="form-control">
              <span className="label-text font-medium mb-1">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </label>

            {serverError && (
              <div className="alert alert-error text-sm py-2">
                <span>{serverError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary mt-2"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="flex justify-between mt-4 text-sm">
<Link href="/forgot-password" className="link">
              Forgot Password?
            </Link>
            <span className="text-base-content/50">Contact IT Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}