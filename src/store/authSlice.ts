import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../types";
import { loadFromStorage, saveToStorage } from "./localStorage";

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

const initialState: AuthState = loadFromStorage<AuthState>("auth", {
  user: null,
  token: null,
});

function generateToken(email: string): string {
  const today = new Date().toISOString().split("T")[0]; 
  return `mock-jwt.${btoa(email)}.${today}`;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // login
    login(state, action: PayloadAction<{ email: string; password: string }>) {
      const { email } = action.payload;
      state.user = { email };
      state.token = generateToken(email);
      saveToStorage("auth", state);
    },
    // logout
    logout(state) {
      state.user = null;
      state.token = null;
      saveToStorage("auth", state);
    },
    // restore auth 
    restore(state, action: PayloadAction<AuthState>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export const { login, logout, restore } = authSlice.actions;
export default authSlice.reducer;
