import { Level, Question } from "./question";
import { Chapter, Subject } from "./subject";
import { UserInfo } from "./user";

export enum Status {
	USED = "USED",
	UNUSED = "UNUSED"
}

export interface Criteria {
	id: number;
	quantity: number;
	level: Level;
	chapter: Chapter;
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
