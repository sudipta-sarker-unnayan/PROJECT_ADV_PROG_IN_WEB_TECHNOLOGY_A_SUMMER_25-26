"use client";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../../lib/api/employees.api";
import {
  Employee,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "../../../lib/types/employee.types";
import EmployeeFormModal, { FormValues } from "./components/EmployeeFormModal";

const LIMIT = 10;

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchEmployees({
        page,
        limit: LIMIT,
        search: search || undefined,
      });
      setEmployees(res.data);
      setTotal(res.total);
    } catch (err) {
  const isForbidden =
    typeof err === "object" &&
    err !== null &&
    "isForbidden" in err &&
    (err as { isForbidden?: boolean }).isForbidden;

  if (isForbidden) {
    setError("You do not have permission to view this page.");
  } else {
    setError("Failed to load employees");
  }
} finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmployees();
  }, [loadEmployees]);

  async function handleCreateSubmit(values: FormValues) {
    await createEmployee(values as CreateEmployeePayload);
    setModalMode(null);
    loadEmployees();
  }

  async function handleEditSubmit(values: FormValues) {
    if (!selectedEmployee) return;
    await updateEmployee(selectedEmployee.id, values as UpdateEmployeePayload);
    setModalMode(null);
    setSelectedEmployee(null);
    loadEmployees();
  }

  async function handleDelete(employee: Employee) {
  if (
    !confirm(`Are you sure you want to delete ${employee.user.name}'s employee record?`)
  )
    return;
  setDeletingId(employee.id);
  try {
    await deleteEmployee(employee.id);
    loadEmployees();
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? (err.response?.data as { message?: string } | undefined)?.message
      : undefined;
    setError(message ?? "Failed to delete employee.");
  } finally {
    setDeletingId(null);
  }
}

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setModalMode("create")}
        >
          + New Employee
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by designation..."
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
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Manager</th>
              <th>Salary</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  <span className="loading loading-spinner" />
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-base-content/60"
                >
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.user.name}</td>
                  <td>{employee.user.email}</td>
                  <td>{employee.department?.name || "—"}</td>
                  <td>{employee.designation || "—"}</td>
                  <td>{employee.manager?.user.name || "—"}</td>
                  <td>{employee.salary ?? "—"}</td>
                  <td>
                    <div className="flex gap-2 justify-end flex-wrap">
                      <button
                        className="btn btn-xs"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setModalMode("edit");
                        }}
                      >
                        Edit
                      </button>
                     <button
                       className="btn btn-xs btn-error"
                       disabled={deletingId === employee.id}
                       onClick={() => handleDelete(employee)}
                     >
                       {deletingId === employee.id ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        "Delete"
                      )}
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
        <EmployeeFormModal
          mode="create"
          onClose={() => setModalMode(null)}
          onSubmit={handleCreateSubmit}
        />
      )}

      {modalMode === "edit" && selectedEmployee && (
        <EmployeeFormModal
          mode="edit"
          initialData={selectedEmployee}
          onClose={() => {
            setModalMode(null);
            setSelectedEmployee(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
