import { UserProfile } from "@/interface/auth";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
	token: string | null;
	authRouter: string[];
}

const initialState: AuthState = {
	token: null,
	authRouter: []
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},
		removeToken: state => {
			state.token = null;
		},
		setAuthRouter: (state, action: PayloadAction<string[]>) => {
			state.authRouter = action.payload;
		},
		removeAuthRouter: state => {
			state.authRouter = [];
		}
	}
});

export const actions = authSlice.actions;

export const namespace = authSlice.name;

export const reducer = authSlice.reducer;
