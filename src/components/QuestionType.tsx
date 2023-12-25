import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { Type } from "@/interface/question";

type RoleProps = {
	type: Type;
	styles?: string;
};

export const TypeComponent: React.FC<RoleProps> = ({ type, styles }) => {
	const backgroundColor = useMemo(() => {
		switch (type) {
			case Type.SINGLE:
				return "bg-admin";
			case Type.MULTIPLE:
				return "bg-teacher";
		}
	}, [type]);
	const typeName = useMemo(() => {
		switch (type) {
			case Type.SINGLE:
				return "Một đáp án";
			case Type.MULTIPLE:
				return "Nhiều đáp án";
		}
	}, [type]);
	return (
		<div className={`rounded-md ${backgroundColor} px-1 py-1 ${styles} flex justify-center items-center`}>
			<p className="text-white py-1 text-[13px] text-center">{typeName}</p>
		</div>
	);
};

export default TypeComponent;
