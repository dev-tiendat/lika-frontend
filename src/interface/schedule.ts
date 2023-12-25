import { ExamSet } from "./examSet";
import { UserInfo } from "./user";

export enum Status {
	ENABLE = "ENABLE",
	DISABLE = "DISABLE"
}

export interface Schedule {
	id: number;
	title: string;
	summary: string;
	publishedAt: number;
	closedAt: number;
	timeAllowance: number;
	status: Status;
	examSet?: ExamSet;
	teacher?: UserInfo;
	students?: UserInfo[];
}
