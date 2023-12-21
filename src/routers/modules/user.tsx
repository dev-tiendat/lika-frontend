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
				path: "/users",
				element: lazyLoad(React.lazy(() => import("@/views/users"))),
				meta: {
					requiresRoles: [Role.ROLE_ADMIN],
					title: "Người dùng"
				}
			}
		]
	},
	{
		path: "/users/add",
		element: lazyLoad(React.lazy(() => import("@/views/users/EditOfUpdateUserProfile"))),
		meta: {
			requiresRoles: [Role.ROLE_ADMIN],
			title: "Thêm người dùng",
			key: "Add user"
		}
	}
];
