import { TotalAll } from "@/interface/statistic";
import React, { useEffect, useState } from "react";
import APIManager from "@/api";
import SimpleStatNumber from "./SimpleStatNumber";

export const StatisticTotalAll = () => {
	const [data, setData] = useState<TotalAll | undefined>(undefined);

	const loadData = async () => {
		const { response, error } = await APIManager.GET<TotalAll>("/v1/api/statistics/totalAll");

		if (APIManager.isSucceed(response)) {
			setData(response!.data!);
		}
	};

	useEffect(() => {
		loadData();
	}, []);
	
	return (
		<div className="flex items-center justify-between w-full max-w-screen">
			{data && (
				<>
					<SimpleStatNumber
						label="Tổng số ca thi"
						backgroundColor={`#cd84f1`}
						number={data?.totalExamSchedule.total}
						additionalData={[
							["Đã thi", data?.totalExamSchedule.examScheduleCompleted],
							["Chưa thi", data?.totalExamSchedule.examScheduleIncomplete],
							["Đã hủy", data?.totalExamSchedule.examScheduleCancel],
							["", 0]
						]}
					/>
					<SimpleStatNumber
						label="Tổng số môn học"
						backgroundColor={`#3ae374`}
						number={data.totalSubject.total}
						additionalData={[
							["", ""],
							["", ""],
							["", ""],
							["", ""]
						]}
					/>
					<SimpleStatNumber
						label="Tổng số bộ đề thi"
						backgroundColor={`#ff4d4d`}
						number={data.totalExamSet.total}
						additionalData={[
							["Đã sủ dụng", data.totalExamSet.usedExamSet],
							["Chưa sử dụng", data.totalExamSet.remainingExamSet],
							["", 0],
							["", 0]
						]}
					/>
					<SimpleStatNumber
						label="Tổng số câu hỏi"
						backgroundColor={`#ffaf40`}
						number={data.totalQuestion.total}
						additionalData={[
							["Đang sử dụng", data.totalQuestion.enableQuestion],
							["Đã hủy", data.totalQuestion.disableQuestion],
							["", 0],
							["", 0]
						]}
					/>
					<SimpleStatNumber
						label="Tổng số người dùng"
						backgroundColor={`#7158e2`}
						number={data.totalUser.total}
						additionalData={[
							["QTV", data.totalUser.adminUser],
							["Giảng viên", data.totalUser.teacherUser],
							["Học sinh", data.totalUser.studentUser],
							["", 0]
						]}
					/>
				</>
			)}
		</div>
	);
};

export default StatisticTotalAll;
