"use client";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../../lib/api/clients.api";
import {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
} from "../../../lib/types/client.types";
import ClientFormModal, { FormValues } from "./components/ClientFormModal";
const LIMIT = 10;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const loadClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchClients({
        page,
        limit: LIMIT,
        search: search || undefined,
      });
      setClients(res.data);
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
      setError("Failed to load clients");
     }
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadClients();
  }, [loadClients]);

  async function handleCreateSubmit(values: FormValues) {
    await createClient(values as CreateClientPayload);
    setModalMode(null);
    loadClients();
  }

  async function handleEditSubmit(values: FormValues) {
    if (!selectedClient) return;
    await updateClient(selectedClient.id, values as UpdateClientPayload);
    setModalMode(null);
    setSelectedClient(null);
    loadClients();
  }

  async function handleDelete(client: Client) {
  if (!confirm(`Are you sure you want to delete ${client.user.name}'s client record?`))
    return;
  setDeletingId(client.id);
  try {
    await deleteClient(client.id);
    loadClients();
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? (err.response?.data as { message?: string } | undefined)?.message
      : undefined;
    setError(message ?? "Failed to delete client.");
  } finally {
    setDeletingId(null);
  }
}

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Client Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setModalMode("create")}
        >
          + New Client
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by company name..."
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
              <th>Company</th>
              <th>Phone</th>
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
            ) : clients.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-base-content/60"
                >
                  No clients found
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.user.name}</td>
                  <td>{client.user.email}</td>
                  <td>{client.companyName || "—"}</td>
                  <td>{client.phone || "—"}</td>
                  <td>
                    <div className="flex gap-2 justify-end flex-wrap">
                      <button
                        className="btn btn-xs"
                        onClick={() => {
                          setSelectedClient(client);
                          setModalMode("edit");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        disabled={deletingId === client.id}
                        onClick={() => handleDelete(client)}
                      >
                        {deletingId === client.id ? (
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
        <ClientFormModal
          mode="create"
          onClose={() => setModalMode(null)}
          onSubmit={handleCreateSubmit}
        />
      )}

      {modalMode === "edit" && selectedClient && (
        <ClientFormModal
          mode="edit"
          initialData={selectedClient}
          onClose={() => {
            setModalMode(null);
            setSelectedClient(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
