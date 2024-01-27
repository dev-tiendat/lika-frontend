import { RootState } from "../store";

export const selectAnswers = (state: RootState, id: number) => {
	if (!state.test.answers[id]) state.test.answers[id] = [];
	return state.test.answers[id];
};
