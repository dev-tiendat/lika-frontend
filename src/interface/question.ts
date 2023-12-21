import { UserInfo } from "./user";
import { Chapter } from "./subject";

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
	id?: number;
	content: string;
	isCorrect: Correct;
	optionLetter?: string;
}

export interface Question {
	id: number;
	content: string;
	image: string | null;
	level: Level;
	type: Type;
	chapter: Chapter;
	subjectName: string;
	teacher: UserInfo;
	answers: Answer[];
}
