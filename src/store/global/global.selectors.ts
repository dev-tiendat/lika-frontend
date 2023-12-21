import { RootState } from "../store";

export const selectAccount = (state: RootState) => state.global.account;

export const selectUserProfile = (state: RootState) => state.global.userProfile;
