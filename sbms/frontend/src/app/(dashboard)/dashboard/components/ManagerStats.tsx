"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchEmployees } from "../../../../lib/api/employees.api";
import { fetchTasks } from "../../../../lib/api/task.api";
import {
  fetchLeaves,
  updateLeaveStatus,
} from "../../../../lib/api/leave.api";
import {
  fetchAttendance,
  createAttendance,
} from "../../../../lib/api/attendance.api";
import { Task, TaskStatus } from "../../../../lib/types/task.types";
import { Leave, LeaveStatus } from "../../../../lib/types/leave.types";
import { Attendance } from "../../../../lib/types/attendance.types";
import { AttendanceFormValues } from "../../../../lib/validation/attendance.schema";
import AttendanceFormModal from "../../attendance/components/AttendanceFormModal";

interface RawData {
  totalEmployees: number;
  tasks: Task[];
  leaves: Leave[];
  attendance: Attendance[];
}

function isActiveTask(task: Task) {
  return task.status !== TaskStatus.COMPLETED;
}

function computeHours(checkIn: string | null, checkOut: string | null) {
  if (!checkIn || !checkOut) return "—";
  const [inH, inM] = checkIn.split(":").map(Number);
  const [outH, outM] = checkOut.split(":").map(Number);
  const minutes = outH * 60 + outM - (inH * 60 + inM);
  if (Number.isNaN(minutes) || minutes < 0) return "—";
  return `${(minutes / 60).toFixed(1)} hrs`;
}

export default function ManagerStats() {
  const [raw, setRaw] = useState<RawData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actioningLeaveId, setActioningLeaveId] = useState<number | null>(
    null,
  );
  const [showLogTimeModal, setShowLogTimeModal] = useState(false);
  const [search, setSearch] = useState("");

  async function load() {
    const [employeesResult, tasksResult, leavesResult, attendanceResult] =
      await Promise.allSettled([
        fetchEmployees({ page: 1, limit: 1 }),
        fetchTasks(),
        fetchLeaves(),
        fetchAttendance(),
      ]);

    const failures: string[] = [];
    if (employeesResult.status === "rejected") {
      console.error("Failed to load employees:", employeesResult.reason);
      failures.push("employees");
    }
    if (tasksResult.status === "rejected") {
      console.error("Failed to load tasks:", tasksResult.reason);
      failures.push("tasks");
    }
    if (leavesResult.status === "rejected") {
      console.error("Failed to load leave requests:", leavesResult.reason);
      failures.push("leave requests");
    }
    if (attendanceResult.status === "rejected") {
      console.error("Failed to load attendance:", attendanceResult.reason);
      failures.push("attendance");
    }

    if (failures.length > 0) {
      setError(
        `Failed to load: ${failures.join(", ")}. Check the console for details.`,
      );
      return;
    }

    setError(null);
    setRaw({
      totalEmployees: (
        employeesResult as PromiseFulfilledResult<
          Awaited<ReturnType<typeof fetchEmployees>>
        >
      ).value.total,
      tasks: (
        tasksResult as PromiseFulfilledResult<
          Awaited<ReturnType<typeof fetchTasks>>
        >
      ).value,
      leaves: (
        leavesResult as PromiseFulfilledResult<
          Awaited<ReturnType<typeof fetchLeaves>>
        >
      ).value,
      attendance: (
        attendanceResult as PromiseFulfilledResult<
          Awaited<ReturnType<typeof fetchAttendance>>
        >
      ).value,
    });
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const workloadByDepartment = useMemo(() => {
    if (!raw) return [];
    const counts = new Map<string, number>();
    for (const task of raw.tasks) {
      if (!isActiveTask(task)) continue;
      const deptName = task.employee?.department?.name ?? "Unassigned";
      counts.set(deptName, (counts.get(deptName) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [raw]);

  const pendingLeaves = useMemo(
    () => raw?.leaves.filter((l) => l.status === LeaveStatus.PENDING) ?? [],
    [raw],
  );

  const recentAttendance = useMemo(
    () =>
      [...(raw?.attendance ?? [])]
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 8),
    [raw],
  );

  const taskSearchResults = useMemo(() => {
    if (!raw || !search.trim()) return [];
    const q = search.trim().toLowerCase();
    return raw.tasks
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.employee?.user?.name?.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [raw, search]);

  async function handleLeaveDecision(leave: Leave, status: LeaveStatus) {
    setActioningLeaveId(leave.id);
    try {
      await updateLeaveStatus(leave.id, status);
      await load();
    } catch (err) {
      console.error("Failed to update leave status:", err);
      setError("Failed to update leave status.");
    } finally {
      setActioningLeaveId(null);
    }
  }

  async function handleLogTime(values: AttendanceFormValues) {
    await createAttendance({
      ...values,
      checkOut: values.checkOut || undefined,
      status: values.status || undefined,
    });
    setShowLogTimeModal(false);
    await load();
  }

  if (error) {
    return <div className="alert alert-error mt-4">{error}</div>;
  }

  if (!raw) {
    return (
      <div className="mt-6">
        <span className="loading loading-spinner" />
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-8">
      {/* Search Team Tasks */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search team tasks..."
          className="input input-bordered w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search.trim() && (
          <div className="absolute z-10 mt-1 w-full bg-base-100 rounded-lg shadow border border-base-300 max-h-72 overflow-y-auto">
            {taskSearchResults.length === 0 ? (
              <div className="p-3 text-sm text-base-content/60">
                No matching tasks
              </div>
            ) : (
              taskSearchResults.map((task) => (
                <Link
                  key={task.id}
                  href="/tasks"
                  className="block p-3 hover:bg-base-200 border-b border-base-200 last:border-0"
                >
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-base-content/60">
                    {task.employee?.user?.name ?? "Unassigned"} ·{" "}
                    {task.status.replace("_", " ")}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Team Workload Overview */}
      <div>
        <h2 className="font-semibold mb-2">Team Workload Overview</h2>
        {workloadByDepartment.length === 0 ? (
          <p className="text-base-content/60 text-sm">
            No active tasks assigned to any department.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {workloadByDepartment.map(([deptName, count]) => (
              <div
                key={deptName}
                className="badge badge-lg badge-outline py-4 px-4"
              >
                {deptName}: {count} Active Task{count === 1 ? "" : "s"}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Leave Approvals Queue */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Pending Leave Approvals Queue</h2>
          <Link href="/leave" className="link link-primary text-sm">
            View all leave requests
          </Link>
        </div>
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Dates</th>
                <th>Reason</th>
                <th className="text-right">Decision</th>
              </tr>
            </thead>
            <tbody>
              {pendingLeaves.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-base-content/60"
                  >
                    No pending leave requests
                  </td>
                </tr>
              ) : (
                pendingLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.employee?.user?.name ?? "—"}</td>
                    <td>
                      {leave.startDate?.slice(0, 10)} –{" "}
                      {leave.endDate?.slice(0, 10)}
                    </td>
                    <td className="max-w-xs truncate">{leave.reason}</td>
                    <td>
                      <div className="flex gap-2 justify-end">
                        <button
                          className="btn btn-xs btn-success"
                          disabled={actioningLeaveId === leave.id}
                          onClick={() =>
                            handleLeaveDecision(leave, LeaveStatus.APPROVED)
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-xs btn-warning"
                          disabled={actioningLeaveId === leave.id}
                          onClick={() =>
                            handleLeaveDecision(leave, LeaveStatus.REJECTED)
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Log Overview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Attendance Log Overview</h2>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setShowLogTimeModal(true)}
          >
            + Log Time
          </button>
        </div>
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-base-content/60"
                  >
                    No attendance records yet
                  </td>
                </tr>
              ) : (
                recentAttendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.employee?.user?.name ?? "—"}</td>
                    <td>{record.date?.slice(0, 10)}</td>
                    <td>{record.checkIn ?? "--"}</td>
                    <td>{record.checkOut ?? "--"}</td>
                    <td>{computeHours(record.checkIn, record.checkOut)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showLogTimeModal && (
        <AttendanceFormModal
          onClose={() => setShowLogTimeModal(false)}
          onSubmit={handleLogTime}
        />
      )}
    </div>
  );
}
