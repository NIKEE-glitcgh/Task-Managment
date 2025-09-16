import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "../types";
import { loadFromStorage, saveToStorage } from "./localStorage";

export interface ProjectsState {
  items: Project[];
}

const initialState: ProjectsState = loadFromStorage<ProjectsState>("projects", {
  items: [],
});

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {

    // add project
    addProject(state, action: PayloadAction<string>) {
      const project: Project = {
        id: nanoid(),
        name: action.payload,
        createdAt: new Date().toISOString(),
      };
      state.items.push(project);
      saveToStorage("projects", state);
    },
    // rename project name 
    renameProject(state, action: PayloadAction<{ id: string; name: string }>) {
      const project = state.items.find((p) => p.id === action.payload.id);
      if (project) {
        project.name = action.payload.name;
        saveToStorage("projects", state);
      }
    },
    // remove project 
    deleteProject(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      saveToStorage("projects", state);
    },
  },
});

export const { addProject, renameProject, deleteProject } =
  projectsSlice.actions;
export default projectsSlice.reducer;
