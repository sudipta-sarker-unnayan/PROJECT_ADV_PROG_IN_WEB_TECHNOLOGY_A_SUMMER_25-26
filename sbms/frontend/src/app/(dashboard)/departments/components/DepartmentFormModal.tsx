"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createDepartmentSchema,
  CreateDepartmentFormValues,
  updateDepartmentSchema,
  UpdateDepartmentFormValues,
} from "../../../../lib/validation/department.schema";
import { Department } from "../../../../lib/types/department.types";

type FormValues = CreateDepartmentFormValues | UpdateDepartmentFormValues;

interface Props {
  mode: "create" | "edit";
  initialData?: Department | null;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}

export default function DepartmentFormModal({
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const schema =
    mode === "create" ? createDepartmentSchema : updateDepartmentSchema;

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
        description: initialData.description ?? "",
      });
    }
  }, [mode, initialData, reset]);

  async function handleFormSubmit(values: FormValues) {
    await onSubmit(values);
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {mode === "create" ? "Create Department" : "Edit Department"}
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
            <span className="label-text font-medium mb-1">
              Description (optional)
            </span>
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
                "Create Department"
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