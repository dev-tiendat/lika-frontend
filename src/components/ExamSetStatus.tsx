import React, { useMemo } from "react";
import { Role } from "@/interface/user";
import { Typography } from "@mui/material";
import { Status } from "@/interface/examSet";


type ExamSetStatusProps = {
	status: Status;
	styles?: string;
};

export const ExamSetStatusComponent: React.FC<ExamSetStatusProps> = ({ status, styles }) => {
	const backgroundColor = useMemo(() => {
		switch (status) {
			case Status.USED:
				return "bg-levelEasy";
			case Status.UNUSED:
				return "bg-levelHard";
		}
	}, [status]);
	const statusName = useMemo(() => {
		switch (status) {
			case Status.USED:
				return "Đã sử dụng";
			case Status.UNUSED:
				return "Chưa sử dụng";
		}
	}, [status]);
	return (
		<div className={`rounded-md ${backgroundColor} px-1 py-1 ${styles} flex justify-center items-center`}>
			<p className="text-white py-1 text-[13px] text-center">{statusName}</p>
		</div>
	);
};

export default ExamSetStatusComponent;
