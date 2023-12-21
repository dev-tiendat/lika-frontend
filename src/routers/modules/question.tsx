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
				path: "/questions",
				element: lazyLoad(React.lazy(() => import("@/views/question"))),
				meta: {
					requiresRoles: [Role.ROLE_ADMIN],
					title: "Câu hỏi"
				}
			}
		]
	},
	{
		path: "/questions/add",
		element: lazyLoad(React.lazy(() => import("@/views/question/EditOrUpdateQuestion"))),
		meta: {
			requiresRoles: [Role.ROLE_ADMIN],
			title: "Thêm câu hỏi",
			key: "Add subject"
		}
	}
];