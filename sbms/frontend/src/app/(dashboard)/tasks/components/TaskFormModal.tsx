"use client";

import { useEffect, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormValues } from "../../../../lib/validation/task.schema";
import { Task } from "../../../../lib/types/task.types";
import { Employee } from "../../../../lib/types/employee.types";
import { fetchEmployees } from "../../../../lib/api/employees.api";

interface Props {
  mode: "create" | "edit";
  initialData?: Task | null;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

export default function TaskFormModal({
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema) as Resolver<TaskFormValues>,
    defaultValues: {
      priority: "medium",
      status: "todo",
      progress: 0,
    },
  });

  useEffect(() => {
    fetchEmployees({ page: 1, limit: 100 })
      .then((res) => setEmployees(res.data))
      .catch(() => setEmployees([]));
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        priority: initialData.priority,
        status: initialData.status,
        progress: initialData.progress,
        startDate: initialData.startDate?.slice(0, 10),
        deadline: initialData.deadline?.slice(0, 10),
        employeeId: initialData.employee.id,
      });
    }
  }, [mode, initialData, reset]);

  async function handleFormSubmit(values: TaskFormValues) {
    await onSubmit(values);
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-lg mb-4">
          {mode === "create" ? "Create Task" : "Edit Task"}
        </h3>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
        >
          <label className="form-control">
            <span className="label-text font-medium mb-1">Title</span>
            <input
              className="input input-bordered w-full"
              {...register("title")}
            />
            {errors.title && (
              <span className="text-error text-sm mt-1">
                {errors.title.message}
              </span>
            )}
          </label>

          <label className="form-control">
            <span className="label-text font-medium mb-1">Description</span>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <span className="text-error text-sm mt-1">
                {errors.description.message}
              </span>
            )}
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="form-control">
              <span className="label-text font-medium mb-1">Priority</span>
              <select
                className="select select-bordered w-full"
                {...register("priority")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="form-control">
              <span className="label-text font-medium mb-1">Status</span>
              <select
                className="select select-bordered w-full"
                {...register("status")}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>

          <label className="form-control">
            <span className="label-text font-medium mb-1">
              Progress (%)
            </span>
            <input
              type="number"
              min={0}
              max={100}
              className="input input-bordered w-full"
              {...register("progress")}
            />
            {errors.progress && (
              <span className="text-error text-sm mt-1">
                {errors.progress.message}
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
              <span className="label-text font-medium mb-1">Deadline</span>
              <input
                type="date"
                className="input input-bordered w-full"
                {...register("deadline")}
              />
              {errors.deadline && (
                <span className="text-error text-sm mt-1">
                  {errors.deadline.message}
                </span>
              )}
            </label>
          </div>

          <label className="form-control">
            <span className="label-text font-medium mb-1">
              Assign to Employee
            </span>
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
                "Create Task"
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
