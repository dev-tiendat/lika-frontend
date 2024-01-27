import { Question } from "./question";
import { UserInfo } from "./user";

export interface ExamInfo {
	id: number;
	examCode: number;
	subjectName: string;
	title: string;
	summary: string;
	timeAllowance: number;
	closedAt: number;
	publishedAt: number;
}

export interface Test {
	examInfo: ExamInfo;
	student: UserInfo;
	questions: Question[];
}


export interface SubmitTest {
    id: number;
    examName: string;
    grade: number;
    numberOfQuestions: number;
    numberOfRightAnswer: number;
}