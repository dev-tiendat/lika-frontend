import React, { useMemo } from "react";
import { Role } from "@/interface/user";
import { Typography } from "@mui/material";
import { Status } from "@/interface/schedule";

type ScheduleStatusProps = {
	status: Status | undefined;
	styles?: string;
};

export const ScheduleStatusComponent: React.FC<ScheduleStatusProps> = ({ status: status, styles }) => {
	const backgroundColor = useMemo(() => {
		switch (status) {
			case Status.ENABLE:
				return "bg-levelEasy";
			case Status.DISABLE:
				return "bg-levelMedium";
			default:
				return "bg-levelHard";
		}
	}, [status]);
	const statusName = useMemo(() => {
		switch (status) {
			case Status.ENABLE:
				return "Chưa thi";
			case Status.DISABLE:
				return "Đã hủy";
			default:
				return "Đã thi";
		}
	}, [status]);
	return (
		<div className={`rounded-md ${backgroundColor} px-1 py-1 ${styles} flex justify-center items-center`}>
			<p className="text-white py-1 text-[13px]  text-center">{statusName}</p>
		</div>
	);
};

export default ScheduleStatusComponent;
