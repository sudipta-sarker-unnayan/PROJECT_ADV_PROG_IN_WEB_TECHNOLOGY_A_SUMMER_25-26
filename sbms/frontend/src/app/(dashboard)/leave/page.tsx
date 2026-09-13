"use client";

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import {
  fetchLeaves,
  applyLeave,
  updateLeaveStatus,
  deleteLeave,
} from "../../../lib/api/leave.api";
import { Leave, LeaveStatus } from "../../../lib/types/leave.types";
import { LeaveFormValues } from "../../../lib/validation/leave.schema";
import LeaveFormModal from "./components/LeaveFormModal";

const STATUS_BADGE: Record<string, string> = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-error",
};

export default function LeavePage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadLeaves = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLeaves();
      setLeaves(data);
    } catch (err) {
      const isForbidden =
        typeof err === "object" &&
        err !== null &&
        "isForbidden" in err &&
        (err as { isForbidden?: boolean }).isForbidden;
      setError(
        isForbidden
          ? "You do not have permission to view this page."
          : "Failed to load leave requests",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLeaves();
  }, [loadLeaves]);

  async function handleCreateSubmit(values: LeaveFormValues) {
    await applyLeave(values);
    setShowCreateModal(false);
    loadLeaves();
  }

  async function handleStatusChange(leave: Leave, status: LeaveStatus) {
    setActioningId(leave.id);
    try {
      await updateLeaveStatus(leave.id, status);
      loadLeaves();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setError(message ?? "Failed to update leave status.");
    } finally {
      setActioningId(null);
    }
  }

  async function handleDelete(leave: Leave) {
    if (!confirm("Are you sure you want to delete this leave request?"))
      return;
    setActioningId(leave.id);
    try {
      await deleteLeave(leave.id);
      loadLeaves();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setError(message ?? "Failed to delete leave request.");
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leave Requests</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + Record Leave
        </button>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Reason</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <span className="loading loading-spinner" />
                </td>
              </tr>
            ) : leaves.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-base-content/60"
                >
                  No leave requests found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.employee?.user?.name ?? "—"}</td>
                  <td className="max-w-xs truncate">{leave.reason}</td>
                  <td>{leave.startDate?.slice(0, 10)}</td>
                  <td>{leave.endDate?.slice(0, 10)}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[leave.status] ?? ""}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2 justify-end flex-wrap">
                      {leave.status === LeaveStatus.PENDING && (
                        <>
                          <button
                            className="btn btn-xs btn-success"
                            disabled={actioningId === leave.id}
                            onClick={() =>
                              handleStatusChange(leave, LeaveStatus.APPROVED)
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-xs btn-warning"
                            disabled={actioningId === leave.id}
                            onClick={() =>
                              handleStatusChange(leave, LeaveStatus.REJECTED)
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn-xs btn-error"
                        disabled={actioningId === leave.id}
                        onClick={() => handleDelete(leave)}
                      >
                        {actioningId === leave.id ? (
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

      {showCreateModal && (
        <LeaveFormModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSubmit}
        />
      )}
    </div>
  );
}
