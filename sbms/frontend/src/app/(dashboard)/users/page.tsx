"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  resetUserPassword,
} from "../../../lib/api/users.api";
import {
  User,
  CreateUserPayload,
  UpdateUserPayload,
} from "../../../lib/types/user.types";
import UserFormModal, {FormValues} from "./components/UserFormModal";
import ResetPasswordModal from "./components/ResetPasswordModal";

const LIMIT = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [resetTargetUser, setResetTargetUser] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC"); 

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchUsers({
        page,
        limit: LIMIT,
        search: search || undefined,
        sortBy,
        order,
      });
      setUsers(res.data);
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
      setError("Failed to load users");
    }
} finally {
      setIsLoading(false);
    }
  }, [page, search, sortBy, order]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, [loadUsers]);

  async function handleCreateSubmit(values: FormValues) {
    await createUser(values as CreateUserPayload);
    setModalMode(null);
    loadUsers();
  }

  async function handleEditSubmit(values: FormValues) {
    if (!selectedUser) return;
    await updateUser(selectedUser.id, values as UpdateUserPayload);
    setModalMode(null);
    setSelectedUser(null);
    loadUsers();
  }

  async function handleToggleStatus(user: User) {
    if (user.status === "active") {
      await deactivateUser(user.id);
    } else {
      await activateUser(user.id);
    }
    loadUsers();
  }

  async function handleDelete(user: User) {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;
    await deleteUser(user.id);
    loadUsers();
  }

  async function handleResetPassword(newPassword: string) {
    if (!resetTargetUser) return;
    await resetUserPassword(resetTargetUser.id, newPassword);
    setResetTargetUser(null);
    alert("Password reset successfully");
  }

  function handleSortClick(column: string) {           
    if (sortBy === column) {
      setOrder((o) => (o === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(column);
      setOrder("ASC");
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setModalMode("create")}
        >
          + New User
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
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
             <th className="cursor-pointer select-none" onClick={() => handleSortClick("name")}>
                Name {sortBy === "name" && (order === "ASC" ? "▲" : "▼")}
             </th>
             <th className="cursor-pointer select-none" onClick={() => handleSortClick("email")}>
                Email {sortBy === "email" && (order === "ASC" ? "▲" : "▼")}
              </th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  <span className="loading loading-spinner" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-base-content/60">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge badge-outline">{user.role.name}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.status === "active" ? "badge-success" : "badge-error"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2 justify-end flex-wrap">
                      <button
                        className="btn btn-xs"
                        onClick={() => {
                          setSelectedUser(user);
                          setModalMode("edit");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs"
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className="btn btn-xs"
                        onClick={() => setResetTargetUser(user)}
                      >
                        Reset Password
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleDelete(user)}
                      >
                        Delete
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
        <UserFormModal
          mode="create"
          onClose={() => setModalMode(null)}
          onSubmit={handleCreateSubmit}
        />
      )}

      {modalMode === "edit" && selectedUser && (
        <UserFormModal
          mode="edit"
          initialData={selectedUser}
          onClose={() => {
            setModalMode(null);
            setSelectedUser(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}

      {resetTargetUser && (
        <ResetPasswordModal
          userName={resetTargetUser.name}
          onClose={() => setResetTargetUser(null)}
          onSubmit={handleResetPassword}
        />
      )}
    </div>
  );
}