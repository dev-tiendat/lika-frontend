import * as Yup from "yup";
import { UserInfo } from "./user";
import { Chapter, Subject } from "./subject";

export enum Level {
	EASY = "EASY",
	MEDIUM = "MEDIUM",
	HARD = "HARD"
}

export enum Type {
	SINGLE = "SINGLE",
	MULTIPLE = "MULTIPLE"
}

export enum Correct {
	TRUE = "TRUE",
	FALSE = "FALSE"
}

export interface Answer {
	id: number;
	content: string;
	isCorrect: Correct;
	optionLetter?: string;
}

export enum Status {
	ENABLE = "ENABLE",
	DISABLE = "DISABLE"
}

export interface Question {
	id: number;
	content: string;
	image: string | null;
	level: Level;
	type: Type;
	status: Status;
	chapter: Chapter;
	subject: Subject;
	teacher: UserInfo;
	answers: Answer[];
}

// chapterId: state ? state.chapter.id : "",
// 				content: state ? state.content : "",
// 				type: state ? state.type : Type.SINGLE,
// 				level: state ? state.level : Level.EASY

export const questionSchema = Yup.object().shape({
	chapterId: Yup.string().required("Chương không được để trống"),
	content: Yup.string().required("Nội dung không được để trống"),
	type: Yup.string().required("Kiểu câu hỏi không được để trống"),
	level: Yup.string().required("Độ khó không được để trống")
})