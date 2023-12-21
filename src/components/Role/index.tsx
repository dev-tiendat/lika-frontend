import React, { useMemo } from "react";
import { Role } from "@/interface/user";
import { Typography } from "@mui/material";

type RoleProps = {
	role: Role;
	styles?: string;
};

export const RoleComponent: React.FC<RoleProps> = ({ role, styles }) => {
	const backgroundColor = useMemo(() => {
		switch (role) {
			case Role.ROLE_ADMIN:
				return "bg-admin";
			case Role.ROLE_TEACHER:
				return "bg-teacher";
			case Role.ROLE_STUDENT:
				return "bg-student";
		}
	}, [role]);
	const roleName = useMemo(() => {
		switch (role) {
			case Role.ROLE_ADMIN:
				return "Quản trị viên";
			case Role.ROLE_TEACHER:
				return "Giảng viên";
			case Role.ROLE_STUDENT:
				return "Sinh viên";
		}
	}, [role]);
	return (
		<div className={`rounded-xl ${backgroundColor} px-2 py-1 ${styles}`}>
			<Typography variant="body2" sx={{ fontSize: "0.8rem", color: "white", textAlign: "center" }}>
				{roleName}
			</Typography>
		</div>
	);
};

export default RoleComponent;
