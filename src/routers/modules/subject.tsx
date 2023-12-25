import React from "react";
import { LayoutIndex } from "@/components/Layout";
import { RouteObject } from "../interface";
import lazyLoad from "../utils/LazyLoad";
import { Role } from "@/interface/user";

export const subjectRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		children: [
			{
				path: "/subjects",
				element: lazyLoad(React.lazy(() => import("@/views/subjects"))),
				meta: {
					requiresRoles: [Role.ROLE_ADMIN],
					title: "Người dùng"
				}
			}
		]
	},
	{
		path: "/subjects/add",
		element: lazyLoad(React.lazy(() => import("@/views/subjects/EditOrUpdateSubject"))),
		meta: {
			requiresRoles: [Role.ROLE_ADMIN],
			title: "Thêm môn học",
			key: "Add subject"
		}
	},
	{
		path: "/subjects/:id/edit",
		element: lazyLoad(React.lazy(() => import("@/views/subjects/EditOrUpdateSubject"))),
		meta: {
			requiresRoles: [Role.ROLE_ADMIN],
			title: "Thêm môn học",
			key: "Add subject"
		}
	}
];
