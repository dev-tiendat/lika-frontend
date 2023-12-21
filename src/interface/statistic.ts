export interface TotalAll {
	totalExamSchedule: {
		total: number;
		examScheduleCompleted: number;
		examScheduleIncomplete: number;
		examScheduleCancel: number;
	};
	totalSubject: {
		total: number;
	};
	totalQuestion: {
		total: number;
		disableQuestion: number;
		enableQuestion: number;
	};
	totalExamSet: {
		total: number;
		usedExamSet: number;
		remainingExamSet: number;
	};
	totalUser: {
		total: number;
		adminUser: number;
		teacherUser: number;
		studentUser: number;
	};
}

export interface TotalQuestionOfSubject {
	subjectName: string;
	numberOfQuestion: number;
}
