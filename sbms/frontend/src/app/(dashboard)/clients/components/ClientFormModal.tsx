"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createClientSchema,
  CreateClientFormValues,
  updateClientSchema,
  UpdateClientFormValues,
} from "../../../../lib/validation/client.schema";
import { Client } from "../../../../lib/types/client.types";
import { User } from "../../../../lib/types/user.types";
import { fetchEligibleUsersForClient } from "../../../../lib/api/clients.api";

type FormValues = CreateClientFormValues | UpdateClientFormValues;

interface Props {
  mode: "create" | "edit";
  initialData?: Client | null;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}

export default function ClientFormModal({
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const schema = mode === "create" ? createClientSchema : updateClientSchema;

  const [eligibleUsers, setEligibleUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(mode === "create");
  const [usersError, setUsersError] = useState<string | null>(null);

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
        companyName: initialData.companyName ?? "",
        phone: initialData.phone ?? "",
      });
    }
  }, [mode, initialData, reset]);

  useEffect(() => {
    if (mode !== "create") return;
    let cancelled = false;
    setUsersLoading(true);
    setUsersError(null);
    fetchEligibleUsersForClient()
      .then((users) => {
        if (!cancelled) setEligibleUsers(users);
      })
      .catch(() => {
        if (!cancelled)
          setUsersError("Failed to load eligible users. Try again.");
      })
      .finally(() => {
        if (!cancelled) setUsersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  async function handleFormSubmit(values: FormValues) {
    await onSubmit(values);
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {mode === "create" ? "Create Client" : "Edit Client"}
        </h3>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
        >
          {mode === "create" && (
            <label className="form-control">
              <span className="label-text font-medium mb-1">User</span>
              <select
                className="select select-bordered w-full"
                defaultValue=""
                disabled={usersLoading}
                {...register("userId" as keyof FormValues)}
              >
                <option value="" disabled>
                  {usersLoading ? "Loading users..." : "Select a user"}
                </option>
                {eligibleUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              {usersError && (
                <span className="text-error text-sm mt-1">{usersError}</span>
              )}
              {!usersError && eligibleUsers.length === 0 && !usersLoading && (
                <span className="text-base-content/60 text-sm mt-1">
                  No unlinked client-role users found. Create a user with the
                  client role first.
                </span>
              )}
              {"userId" in errors && errors.userId && (
                <span className="text-error text-sm mt-1">
                  {(errors as any).userId.message}
                </span>
              )}
            </label>
          )}

          <label className="form-control">
            <span className="label-text font-medium mb-1">
              Company Name (optional)
            </span>
            <input
              className="input input-bordered w-full"
              {...register("companyName")}
            />
            {errors.companyName && (
              <span className="text-error text-sm mt-1">
                {errors.companyName.message}
              </span>
            )}
          </label>

          <label className="form-control">
            <span className="label-text font-medium mb-1">
              Phone (optional)
            </span>
            <input
              className="input input-bordered w-full"
              {...register("phone")}
            />
            {errors.phone && (
              <span className="text-error text-sm mt-1">
                {errors.phone.message}
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
              disabled={isSubmitting || (mode === "create" && usersLoading)}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : mode === "create" ? (
                "Create Client"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
