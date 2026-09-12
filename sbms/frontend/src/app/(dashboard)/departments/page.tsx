"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../lib/api/departments.api";
import {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "../../../lib/types/department.types";
import DepartmentFormModal from "./components/DepartmentFormModal";

const LIMIT = 10;

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const loadDepartments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchDepartments({
        page,
        limit: LIMIT,
        search: search || undefined,
      });
      setDepartments(res.data);
      setTotal(res.total);
    } catch (err: any) {
      if (err?.isForbidden) {
        setError("You do not have permission to view this page.");
      } else {
        setError("Failed to load departments");
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDepartments();
  }, [loadDepartments]);

  async function handleCreateSubmit(values: CreateDepartmentPayload) {
    await createDepartment(values);
    setModalMode(null);
    loadDepartments();
  }

  async function handleEditSubmit(values: UpdateDepartmentPayload) {
    if (!selectedDepartment) return;
    await updateDepartment(selectedDepartment.id, values);
    setModalMode(null);
    setSelectedDepartment(null);
    loadDepartments();
  }

  async function handleDelete(department: Department) {
    if (!confirm(`Are you sure you want to delete ${department.name}?`)) return;
    setDeletingId(department.id);
    try {
      await deleteDepartment(department.id);
      loadDepartments();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Department Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setModalMode("create")}
        >
          + New Department
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="input input-bordered w-full max-w-xs"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  <span className="loading loading-spinner" />
                </td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-6 text-base-content/60"
                >
                  No departments found
                </td>
              </tr>
            ) : (
              departments.map((department) => (
                <tr key={department.id}>
                  <td>{department.name}</td>
                  <td>{department.description || "—"}</td>
                  <td>
                    <div className="flex gap-2 justify-end flex-wrap">
                      <button
                        className="btn btn-xs"
                        onClick={() => {
                          setSelectedDepartment(department);
                          setModalMode("edit");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        disabled={deletingId === department.id}
                        onClick={() => handleDelete(department)}
                      >
                         {deletingId === department.id ? (
                          <span className="loading loading-spinner loading-xs" />
                         ) : (
                           "Delete"
                         )}
                      </button>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            className="btn btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            «
          </button>
          <span className="btn btn-sm btn-ghost pointer-events-none">
            {page} / {totalPages}
          </span>
          <button
            className="btn btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            »
          </button>
        </div>
      )}

      {modalMode === "create" && (
        <DepartmentFormModal
          mode="create"
          onClose={() => setModalMode(null)}
          onSubmit={handleCreateSubmit}
        />
      )}

      {modalMode === "edit" && selectedDepartment && (
        <DepartmentFormModal
          mode="edit"
          initialData={selectedDepartment}
          onClose={() => {
            setModalMode(null);
            setSelectedDepartment(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}