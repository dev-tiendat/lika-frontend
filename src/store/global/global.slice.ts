import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/interface/auth";

export interface Account {
	usernameOrEmail: string;
	password: string;
}

export interface GlobalState {
	account: Account | null;
	userProfile: UserProfile | null;
}

const initialState: GlobalState = {
	account: null,
	userProfile: null
};

export const globalSlice = createSlice({
	name: "global",
	initialState: initialState,
	reducers: {
		setAccount: (state, action: PayloadAction<Account>) => {
			state.account = action.payload;
		},
		removeAccount: state => {
			state.account = null;
		},
		setUserProfile: (state, action: PayloadAction<UserProfile>) => {
			state.userProfile = action.payload;
		},
		removeUserProfile: state => {
			state.userProfile = null;
		}
	}
});

export const actions = globalSlice.actions;

export const namespace = globalSlice.name;

export const reducer = globalSlice.reducer;
