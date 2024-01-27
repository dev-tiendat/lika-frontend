import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TestState {
	answers: Record<number, number[]>;
}

const initialState: TestState = {
	answers: {}
};

export interface TestPayload {
	id: number;
	answerId: number;
}

export const testSlice = createSlice({
	name: "test",
	initialState: initialState,
	reducers: {
		addAnswer: (state, action: PayloadAction<TestPayload>) => {
			// if (!action.payload.id) state.answers[action.payload.id] = [];
			state.answers[action.payload.id].push(action.payload.answerId);
		},
		removeAnswer: (state, action: PayloadAction<TestPayload>) => {
			state.answers[action.payload.id] = state.answers[action.payload.id].filter(value => value !== action.payload.answerId);
		},
		removeAllAnswer: state => {
			state.answers = [];
		}
	}
});

export const actions = testSlice.actions;

export const namespace = testSlice.name;

export const reducer = testSlice.reducer;
