import { api } from "./axios";
import { DashboardStats } from "../types/dashboard.types";

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>("/dashboard/stats");
  return data;
}