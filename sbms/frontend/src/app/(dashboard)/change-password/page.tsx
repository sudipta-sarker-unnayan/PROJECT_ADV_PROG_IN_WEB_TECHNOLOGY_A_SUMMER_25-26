"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "../../../lib/validation/change-password.schema";
import { changePasswordRequest } from "../../../lib/api/auth.api";

export default function ChangePasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(values: ChangePasswordFormValues) {
    setServerError(null);
    setSuccess(false);
    try {
      await changePasswordRequest({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setSuccess(true);
      reset();
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ?? "password change failed. Please try again.",
      );
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-100 rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Change Password</h1>

      {serverError && (
        <div className="alert alert-error mb-4 text-sm">{serverError}</div>
      )}
      {success && (
        <div className="alert alert-success mb-4 text-sm">
          Password changed successfully
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Current Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p className="text-error text-sm mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-error text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="label">Confirm New Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-error text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}