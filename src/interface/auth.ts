import { Role } from "./user";

export interface UserProfile {
	id: number;
	username: string;
	fullName: string;
	roles: Role[];
}

export interface LoginResponse extends UserProfile {
	token: string;
}
