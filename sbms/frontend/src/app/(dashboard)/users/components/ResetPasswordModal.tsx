"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "../../../../lib/validation/user.schema";

interface Props {
  userName: string;
  onClose: () => void;
  onSubmit: (newPassword: string) => Promise<void>;
}

export default function ResetPasswordModal({
  userName,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function handleFormSubmit(values: ResetPasswordFormValues) {
    await onSubmit(values.newPassword);
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          Reset Password for {userName}
        </h3>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
        >
          <label className="form-control">
            <span className="label-text font-medium mb-1">New Password</span>
            <input
              type="password"
              className="input input-bordered w-full"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <span className="text-error text-sm mt-1">
                {errors.newPassword.message}
              </span>
            )}
          </label>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Reset"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}