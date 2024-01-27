import { ExamInfo } from "@/interface/test";
import { UserInfo } from "@/interface/user";
import React from "react";
import dayjs from "dayjs";

interface TestInfoProps {
	examInfo: ExamInfo;
	student: UserInfo;
	style?: string;
}

const DATE_FORMAT = "DD/MM/YYYY";

export const TestInfo: React.FC<TestInfoProps> = ({ examInfo, student, style }) => {
	const convertDate = (time: number, format?: string) => dayjs(time).format(format || DATE_FORMAT);

	return (
		<div className={`w-[300px] p-2 ${style}`}>
            <button className="w-full py-5 px-3 bg-secondary text-white">Thông tin kỳ thi</button>
			<div className="flex w-full py-4 px-5 font-normal mt-[15px] bg-white rounded-lg flex-col  shadow-md">
				<p className="text-center mb-3 ">{examInfo.title}</p>
				<p className="text-sm text-[16px] text-textSecond">
					Thí sinh thi : {student.firstName} {student.lastName}
					<br />
					<br />
					Môn thi : {examInfo.subjectName}
					<br />
					<br />
					Thời gian làm bài : {examInfo.timeAllowance} phút
					<br />
					<br />
					Ngày thi : {convertDate(examInfo.publishedAt)}
					<br />
					<br />
					Giờ thi : {convertDate(examInfo.publishedAt, "hh:mm")}
				</p>
			</div>
		</div>
	);
};

export default TestInfo;
