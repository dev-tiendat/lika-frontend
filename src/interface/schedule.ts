import * as Yup from "yup";
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

export interface StudentSchedule {
	id: number;
	examScheduleName: string;
	subjectId: number;
	subjectName: string;
	publishedAt: number;
	closedAt:number;
	timeAllowance: number;
}

export const scheduleSchema = Yup.object().shape({
	title: Yup.string().required("Tiêu đề không được để trống"),
	summary: Yup.string().required("Mô tả không được để trống"),
	publishedAt: Yup.number().required("Lịch thi không được để trống"),
	timeAllowance: Yup.number().min(1,"Thời gian tối thiểu là 1 phút").required("Thời gian thi không được để trống"),
	teacherUsername: Yup.string().required("Giảng viên không được để trống")
})