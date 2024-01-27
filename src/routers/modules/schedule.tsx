import React from "react";
import { LayoutIndex } from "@/components/Layout";
import { RouteObject } from "../interface";
import lazyLoad from "../utils/LazyLoad";
import { Role } from "@/interface/user";

export const userRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		children: [
			{
				path: "/schedule",
				element: lazyLoad(React.lazy(() => import("@/views/schedule"))),
				meta: {
					requiresRoles: [Role.ROLE_ADMIN,Role.ROLE_TEACHER],
					title: "Lịch thi"
				}
			}
		]
	},
	{
		element: <LayoutIndex />,
		children: [
			{
				path: "/schedule/me",
				element: lazyLoad(React.lazy(() => import("@/views/schedule/ScheduleForStudent"))),
				meta: {
					requiresRoles: [Role.ROLE_STUDENT],
					title: "Lịch thi của sinh viên"
				}
			}
		]
	},
	{
		path: "/schedule/add",
		element: lazyLoad(React.lazy(() => import("@/views/schedule/EditOrUpdateSchedule"))),
		meta: {
			requiresRoles: [Role.ROLE_ADMIN],
			title: "Thêm lịch thi",
			key: "Add schedule"
		}
	},
	{
		path: "/schedule/:id/edit",
		element: lazyLoad(React.lazy(() => import("@/views/schedule/EditOrUpdateSchedule"))),
		meta: {
			requiresRoles: [Role.ROLE_ADMIN],
			title: "Sửa lịch thi",
			key: "edit schedule"
		}
	}
];
