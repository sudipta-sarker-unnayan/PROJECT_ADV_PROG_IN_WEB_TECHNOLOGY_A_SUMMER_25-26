"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchAttendance, createAttendance } from "../../../lib/api/attendance.api";
import { Attendance } from "../../../lib/types/attendance.types";
import { AttendanceFormValues } from "../../../lib/validation/attendance.schema";
import AttendanceFormModal from "./components/AttendanceFormModal";

const STATUS_BADGE: Record<string, string> = {
  present: "badge-success",
  absent: "badge-error",
  late: "badge-warning",
};

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadAttendance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAttendance();
      setRecords(data);
    } catch (err) {
      const isForbidden =
        typeof err === "object" &&
        err !== null &&
        "isForbidden" in err &&
        (err as { isForbidden?: boolean }).isForbidden;
      setError(
        isForbidden
          ? "You do not have permission to view this page."
          : "Failed to load attendance records",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAttendance();
  }, [loadAttendance]);

  async function handleCreateSubmit(values: AttendanceFormValues) {
    await createAttendance({
      ...values,
      checkOut: values.checkOut || undefined,
      status: values.status || undefined,
    });
    setShowCreateModal(false);
    loadAttendance();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + Record Attendance
        </button>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  <span className="loading loading-spinner" />
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-base-content/60"
                >
                  No attendance records found
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{record.employee?.user?.name ?? "—"}</td>
                  <td>{record.date?.slice(0, 10)}</td>
                  <td>{record.checkIn ?? "—"}</td>
                  <td>{record.checkOut ?? "—"}</td>
                  <td>
                    <span
                      className={`badge ${STATUS_BADGE[record.status] ?? ""}`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <AttendanceFormModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSubmit}
        />
      )}
    </div>
  );
}
