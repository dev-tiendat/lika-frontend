import { Level, Question } from "./question";
import { Chapter, Subject } from "./subject";
import { UserInfo } from "./user";
import * as Yup from "yup";

export enum Status {
	USED = "USED",
	UNUSED = "UNUSED"
}

export interface Criteria {
	id: number;
	quantity: number;
	level: Level;
	chapter: Chapter;
	chapterId: number;
}

export interface Exam {
	id: number;
	examCode: number;
	questions: Question[];
}

export interface ExamSet {
	id: number;
	name: string;
	status: Status;
	subject: Subject;
	createdBy: UserInfo;
	criteria: Criteria[];
	exams: Exam[];
}

export const examSetSchema = Yup.object().shape({
	name: Yup.string().required("Tên bộ đề thi không được để trống"),
	quantityOfExam: Yup.number().required("Số lượng không được để trống")
})