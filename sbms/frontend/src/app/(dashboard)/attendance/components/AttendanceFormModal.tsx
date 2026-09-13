"use client";

import { useEffect, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  attendanceSchema,
  AttendanceFormValues,
} from "../../../../lib/validation/attendance.schema";
import { Employee } from "../../../../lib/types/employee.types";
import { fetchEmployees } from "../../../../lib/api/employees.api";

interface Props {
  onClose: () => void;
  onSubmit: (values: AttendanceFormValues) => Promise<void>;
}

export default function AttendanceFormModal({ onClose, onSubmit }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema) as Resolver<AttendanceFormValues>,
  });

  useEffect(() => {
    fetchEmployees({ page: 1, limit: 100 })
      .then((res) => setEmployees(res.data))
      .catch(() => setEmployees([]));
  }, []);

  async function handleFormSubmit(values: AttendanceFormValues) {
    await onSubmit(values);
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-lg mb-4">Record Attendance</h3>

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
            <span className="label-text font-medium mb-1">Date</span>
            <input
              type="date"
              className="input input-bordered w-full"
              {...register("date")}
            />
            {errors.date && (
              <span className="text-error text-sm mt-1">
                {errors.date.message}
              </span>
            )}
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="form-control">
              <span className="label-text font-medium mb-1">Check-in</span>
              <input
                type="time"
                className="input input-bordered w-full"
                {...register("checkIn")}
              />
              {errors.checkIn && (
                <span className="text-error text-sm mt-1">
                  {errors.checkIn.message}
                </span>
              )}
            </label>

            <label className="form-control">
              <span className="label-text font-medium mb-1">
                Check-out (optional)
              </span>
              <input
                type="time"
                className="input input-bordered w-full"
                {...register("checkOut")}
              />
            </label>
          </div>

          <label className="form-control">
            <span className="label-text font-medium mb-1">
              Status (optional)
            </span>
            <select
              className="select select-bordered w-full"
              {...register("status")}
              defaultValue=""
            >
              <option value="">— Auto —</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
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
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
