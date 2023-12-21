export interface Chapter {
	id: number;
	chapterNumber: number;
	chapterName: string;
}

export interface Subject {
	id: string;
	subjectName: string;
	creditHours: string;
	chapters: Chapter[];
}
