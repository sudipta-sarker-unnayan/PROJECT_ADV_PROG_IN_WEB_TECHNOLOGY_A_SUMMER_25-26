"use client";

import { useEffect, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leaveSchema, LeaveFormValues } from "../../../../lib/validation/leave.schema";
import { Employee } from "../../../../lib/types/employee.types";
import { fetchEmployees } from "../../../../lib/api/employees.api";

interface Props {
  onClose: () => void;
  onSubmit: (values: LeaveFormValues) => Promise<void>;
}

export default function LeaveFormModal({ onClose, onSubmit }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema) as Resolver<LeaveFormValues>,
  });

  useEffect(() => {
    fetchEmployees({ page: 1, limit: 100 })
      .then((res) => setEmployees(res.data))
      .catch(() => setEmployees([]));
  }, []);

  async function handleFormSubmit(values: LeaveFormValues) {
    await onSubmit(values);
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-lg mb-4">Record Leave</h3>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
        >
          <label className="form-control">
            <span className="label-text font-medium mb-1">Employee</span>
            <select
              className="select select-bordered w-full"
              {...register("employeeId")}
              defaultValue=""
            >
              <option value="" disabled>
                Select an employee
              </option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.user.name}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <span className="text-error text-sm mt-1">
                {errors.employeeId.message}
              </span>
            )}
          </label>

          <label className="form-control">
            <span className="label-text font-medium mb-1">Reason</span>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={2}
              {...register("reason")}
            />
            {errors.reason && (
              <span className="text-error text-sm mt-1">
                {errors.reason.message}
              </span>
            )}
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="form-control">
              <span className="label-text font-medium mb-1">Start Date</span>
              <input
                type="date"
                className="input input-bordered w-full"
                {...register("startDate")}
              />
              {errors.startDate && (
                <span className="text-error text-sm mt-1">
                  {errors.startDate.message}
                </span>
              )}
            </label>

            <label className="form-control">
              <span className="label-text font-medium mb-1">End Date</span>
              <input
                type="date"
                className="input input-bordered w-full"
                {...register("endDate")}
              />
              {errors.endDate && (
                <span className="text-error text-sm mt-1">
                  {errors.endDate.message}
                </span>
              )}
            </label>
          </div>

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
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
