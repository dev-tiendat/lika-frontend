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
					requiresRoles: [Role.ROLE_ADMIN],
					title: "Lịch thi"
				}
			}
		]
	},
	// {
	// 	path: "/schedule/add",
	// 	element: lazyLoad(React.lazy(() => import("@/views/sche/EditOfUpdateUserProfile"))),
	// 	meta: {
	// 		requiresRoles: [Role.ROLE_ADMIN],
	// 		title: "Thêm người dùng",
	// 		key: "Add user"
	// 	}
	// }
];
