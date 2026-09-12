"use client";

import { useEffect, useState } from "react";
import { useForm, Resolver, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEmployeeSchema,
  CreateEmployeeFormValues,
  updateEmployeeSchema,
  UpdateEmployeeFormValues,
} from "../../../../lib/validation/employee.schema";
import { Employee } from "../../../../lib/types/employee.types";
import { User } from "../../../../lib/types/user.types";
import { Department } from "../../../../lib/types/department.types";
import {
  fetchEligibleUsersForEmployee,
  fetchManagerCandidates,
} from "../../../../lib/api/employees.api";
import { fetchDepartments } from "../../../../lib/api/departments.api";

export type FormValues = CreateEmployeeFormValues | UpdateEmployeeFormValues;

interface Props {
  mode: "create" | "edit";
  initialData?: Employee | null;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}

export default function EmployeeFormModal({
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const schema =
    mode === "create" ? createEmployeeSchema : updateEmployeeSchema;

  const [eligibleUsers, setEligibleUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [managerCandidates, setManagerCandidates] = useState<Employee[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        departmentId: initialData.department?.id,
        managerId: initialData.manager?.id,
        designation: initialData.designation ?? "",
        salary: initialData.salary ?? undefined,
      });
    }
  }, [mode, initialData, reset]);

  useEffect(() => {
    let cancelled = false;

    const loaders: Promise<unknown>[] = [
      fetchDepartments({ page: 1, limit: 100 }).then((res) => {
        if (!cancelled) setDepartments(res.data);
      }),
      fetchManagerCandidates().then((data) => {
        if (!cancelled) {
          // an employee can't be their own manager
          setManagerCandidates(
            mode === "edit" && initialData
              ? data.filter((e) => e.id !== initialData.id)
              : data,
          );
        }
      }),
    ];

    if (mode === "create") {
      loaders.push(
        fetchEligibleUsersForEmployee().then((users) => {
          if (!cancelled) setEligibleUsers(users);
        }),
      );
    }

    Promise.all(loaders)
      .catch(() => {
        if (!cancelled)
          setOptionsError("Failed to load form options. Try again.");
      })
      .finally(() => {
        if (!cancelled) setOptionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mode, initialData]);

  async function handleFormSubmit(values: FormValues) {
    await onSubmit(values);
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {mode === "create" ? "Create Employee" : "Edit Employee"}
        </h3>

        {optionsError && (
          <div className="alert alert-error mb-4">{optionsError}</div>
        )}

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
                disabled={optionsLoading}
                {...register("userId" as keyof FormValues)}
              >
                <option value="" disabled>
                  {optionsLoading ? "Loading users..." : "Select a user"}
                </option>
                {eligibleUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              {!optionsLoading && eligibleUsers.length === 0 && (
                <span className="text-base-content/60 text-sm mt-1">
                  No unlinked employee-role users found. Create a user with
                  the employee role first.
                </span>
              )}
              {(errors as FieldErrors<CreateEmployeeFormValues>).userId && (
                <span className="text-error text-sm mt-1">
                  {
                    (errors as FieldErrors<CreateEmployeeFormValues>).userId
                      ?.message
                  }
                </span>
              )}
            </label>
          )}

          <label className="form-control">
            <span className="label-text font-medium mb-1">
              Department (optional)
            </span>
            <select
              className="select select-bordered w-full"
              defaultValue=""
              disabled={optionsLoading}
              {...register("departmentId")}
            >
              <option value="">No department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="label-text font-medium mb-1">
              Manager (optional)
            </span>
            <select
              className="select select-bordered w-full"
              defaultValue=""
              disabled={optionsLoading}
              {...register("managerId")}
            >
              <option value="">No manager</option>
              {managerCandidates.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.user.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="label-text font-medium mb-1">
              Designation (optional)
            </span>
            <input
              className="input input-bordered w-full"
              {...register("designation")}
            />
            {errors.designation && (
              <span className="text-error text-sm mt-1">
                {errors.designation.message}
              </span>
            )}
          </label>

          <label className="form-control">
            <span className="label-text font-medium mb-1">
              Salary (optional)
            </span>
            <input
              type="number"
              step="0.01"
              className="input input-bordered w-full"
              {...register("salary")}
            />
            {errors.salary && (
              <span className="text-error text-sm mt-1">
                {errors.salary.message}
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
              disabled={isSubmitting || (mode === "create" && optionsLoading)}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : mode === "create" ? (
                "Create Employee"
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
