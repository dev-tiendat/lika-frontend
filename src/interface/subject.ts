import * as Yup from "yup";

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

export const subjectSchema = Yup.object().shape({
	subjectId: Yup.string().max(12, "Mã môn học tối đa 12 ký tự").required("Mã môn học không được để trống"),
	subjectName: Yup.string().max(50, "Tên môn học tối đã 50 ký tự").required("Tên môn học không được để trống"),
	creditHours: Yup.number().required("Số tín chỉ không được để trống")
});
