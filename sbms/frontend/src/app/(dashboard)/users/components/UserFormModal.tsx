"use client";

import { useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  CreateUserFormValues,
  updateUserSchema,
  UpdateUserFormValues,
} from "../../../../lib/validation/user.schema";
import { User } from "../../../../lib/types/user.types";

const ROLES = ["super_admin", "manager", "employee", "client"] as const;

export type FormValues = CreateUserFormValues | UpdateUserFormValues;

interface Props {
  mode: "create" | "edit";
  initialData?: User | null;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}

export default function UserFormModal({
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const schema = mode === "create" ? createUserSchema : updateUserSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role.name,
      });
    }
  }, [mode, initialData, reset]);

  async function handleFormSubmit(values: FormValues) {
    await onSubmit(values);
  }

  const createErrors = errors as FieldErrors<CreateUserFormValues>;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {mode === "create" ? "Create User" : "Edit User"}
        </h3>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
        >
          <label className="form-control">
            <span className="label-text font-medium mb-1">Name</span>
            <input
              className="input input-bordered w-full"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-error text-sm mt-1">
                {errors.name.message}
              </span>
            )}
          </label>

          <label className="form-control">
            <span className="label-text font-medium mb-1">Email</span>
            <input
              type="email"
              className="input input-bordered w-full"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-error text-sm mt-1">
                {errors.email.message}
              </span>
            )}
          </label>

          {mode === "create" && (
            <label className="form-control">
              <span className="label-text font-medium mb-1">Password</span>
              <input
                type="password"
                className="input input-bordered w-full"
                {...register("password")}
              />
              {createErrors.password && (
                <span className="text-error text-sm mt-1">
                  {createErrors.password.message}
                </span>
              )}
            </label>
          )}

          <label className="form-control">
            <span className="label-text font-medium mb-1">Role</span>
            <select
              className="select select-bordered w-full"
              {...register("role")}
              defaultValue=""
            >
              <option value="" disabled>
                Select Role
              </option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.role && (
              <span className="text-error text-sm mt-1">
                {errors.role.message}
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
              ) : mode === "create" ? (
                "Create User"
              ) : (
                "Edit User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}