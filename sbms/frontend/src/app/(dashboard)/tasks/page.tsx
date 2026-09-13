"use client";

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../../lib/api/task.api";
import { Task } from "../../../lib/types/task.types";
import { TaskFormValues } from "../../../lib/validation/task.schema";
import TaskFormModal from "./components/TaskFormModal";

const STATUS_BADGE: Record<string, string> = {
  todo: "badge-ghost",
  in_progress: "badge-info",
  completed: "badge-success",
};

const PRIORITY_BADGE: Record<string, string> = {
  low: "badge-ghost",
  medium: "badge-warning",
  high: "badge-error",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      const isForbidden =
        typeof err === "object" &&
        err !== null &&
        "isForbidden" in err &&
        (err as { isForbidden?: boolean }).isForbidden;
      setError(
        isForbidden
          ? "You do not have permission to view this page."
          : "Failed to load tasks",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
  }, [loadTasks]);

  async function handleCreateSubmit(values: TaskFormValues) {
    await createTask(values);
    setModalMode(null);
    loadTasks();
  }

  async function handleEditSubmit(values: TaskFormValues) {
    if (!selectedTask) return;
    await updateTask(selectedTask.id, values);
    setModalMode(null);
    setSelectedTask(null);
    loadTasks();
  }

  async function handleDelete(task: Task) {
    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) return;
    setDeletingId(task.id);
    try {
      await deleteTask(task.id);
      loadTasks();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setError(message ?? "Failed to delete task.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setModalMode("create")}
        >
          + New Task
        </button>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Employee</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Deadline</th>
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
            ) : tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-base-content/60"
                >
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.employee?.user?.name ?? "—"}</td>
                  <td>
                    <span
                      className={`badge ${PRIORITY_BADGE[task.priority] ?? ""}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${STATUS_BADGE[task.status] ?? ""}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <progress
                        className="progress progress-primary w-20"
                        value={task.progress}
                        max={100}
                      />
                      <span className="text-xs">{task.progress}%</span>
                    </div>
                  </td>
                  <td>{task.deadline?.slice(0, 10)}</td>
                  <td>
                    <div className="flex gap-2 justify-end flex-wrap">
                      <button
                        className="btn btn-xs"
                        onClick={() => {
                          setSelectedTask(task);
                          setModalMode("edit");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        disabled={deletingId === task.id}
                        onClick={() => handleDelete(task)}
                      >
                        {deletingId === task.id ? (
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

      {modalMode === "create" && (
        <TaskFormModal
          mode="create"
          onClose={() => setModalMode(null)}
          onSubmit={handleCreateSubmit}
        />
      )}

      {modalMode === "edit" && selectedTask && (
        <TaskFormModal
          mode="edit"
          initialData={selectedTask}
          onClose={() => {
            setModalMode(null);
            setSelectedTask(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
