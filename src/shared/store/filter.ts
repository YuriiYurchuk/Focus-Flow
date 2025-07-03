import { create } from "zustand";
import type { Task } from "@/entities/task/types";

type FilterStatus = "all" | Task["status"];

interface TaskFilterState {
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
}
export const useTaskFilterStore = create<TaskFilterState>((set) => ({
  filterStatus: "all",
  setFilterStatus: (status) => set({ filterStatus: status }),
}));
