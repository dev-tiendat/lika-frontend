import React, { useMemo } from "react";
import { Role } from "@/interface/user";
import { Typography } from "@mui/material";
import { Level } from "@/interface/question";

type QuestionLevelProps = {
	level: Level;
	styles?: string;
};

export const LevelComponent: React.FC<QuestionLevelProps> = ({ level, styles }) => {
	const backgroundColor = useMemo(() => {
		switch (level) {
			case Level.EASY:
				return "bg-levelEasy";
			case Level.MEDIUM:
				return "bg-levelMedium";
			case Level.HARD:
				return "bg-levelHard";
		}
	}, [level]);
	const levelName = useMemo(() => {
		switch (level) {
			case Level.EASY:
				return "Dễ";
			case Level.MEDIUM:
				return "Trung bình";
			case Level.HARD:
				return "Khó";
		}
	}, [level]);
	return (
		<div className={`rounded-md ${backgroundColor} px-1 py-1 ${styles} flex justify-center items-center`}>
			<p className="text-white py-1">{levelName}</p>
		</div>
	);
};

export default LevelComponent;
