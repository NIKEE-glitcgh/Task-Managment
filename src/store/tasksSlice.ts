import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TaskItem, TaskStatus } from "../types";
import { loadFromStorage, saveToStorage } from "./localStorage";

export interface TasksState {
  items: TaskItem[];
}

const initialState: TasksState = loadFromStorage<TasksState>("tasks", {
  items: [],
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {

    // add task 
    addTask(
      state,
      action: PayloadAction<Omit<TaskItem, "id" | "createdAt" | "updatedAt">>
    ) {
      const task: TaskItem = {
        ...action.payload,
        id: nanoid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.items.push(task);
      saveToStorage("tasks", state);
    },

    // update task
    updateTask(
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<TaskItem, "id">>;
      }>
    ) {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (task) {
        Object.assign(task, action.payload.updates);
        task.updatedAt = new Date().toISOString();
        saveToStorage("tasks", state);
      }
    },

    // delete task
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
      saveToStorage("tasks", state);
    },
    // delete tasks by project id
    deleteTasksByProject(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.projectId !== action.payload);
      saveToStorage("tasks", state);
    },
    // set status of the task
    setStatus(
      state,
      action: PayloadAction<{ id: string; status: TaskStatus }>
    ) {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        task.updatedAt = new Date().toISOString();
        saveToStorage("tasks", state);
      }
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  deleteTasksByProject,
  setStatus,
} = tasksSlice.actions;
export default tasksSlice.reducer;
