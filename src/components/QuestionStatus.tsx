import React, { useMemo } from "react";
import { Role } from "@/interface/user";
import { Typography } from "@mui/material";
import { Level, Status } from "@/interface/question";

type QuestionStatusProps = {
	status: Status;
	styles?: string;
};

export const QuestionStatusComponent: React.FC<QuestionStatusProps> = ({ status, styles }) => {
	const backgroundColor = useMemo(() => {
		switch (status) {
			case Level.EASY:
				return "bg-levelEasy";
			case Level.MEDIUM:
				return "bg-levelMedium";
			case Level.HARD:
				return "bg-levelHard";
		}
	}, [status]);
	const levelName = useMemo(() => {
		switch (status) {
			case Level.EASY:
				return "Dễ";
			case Level.MEDIUM:
				return "Trung bình";
			case Level.HARD:
				return "Khó";
		}
	}, [status]);
	return (
		<div className={`rounded-md ${backgroundColor} px-1 py-1 ${styles} flex justify-center items-center`}>
			<p className="text-white py-1 text-center">{levelName}</p>
		</div>
	);
};

export default QuestionStatusComponent;
