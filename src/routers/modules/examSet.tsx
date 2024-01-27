import React from "react";
import { LayoutIndex } from "@/components/Layout";
import { RouteObject } from "../interface";
import lazyLoad from "../utils/LazyLoad";
import { Role } from "@/interface/user";

export const examSetRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		children: [
			{
				path: "/examSets",
				element: lazyLoad(React.lazy(() => import("@/views/examSet"))),
				meta: {
					requiresRoles: [Role.ROLE_ADMIN,Role.ROLE_TEACHER],
					title: "Bộ đề thi"
				}
			}
		],
	},
	{
		path: "/examSets/add",
		element: lazyLoad(React.lazy(() => import("@/views/examSet/AddOrUpdateExamSet"))),
		meta: {
			requiresRoles: [Role.ROLE_ADMIN,Role.ROLE_TEACHER],
			title: "Thêm bộ đề thi",
			key: "Add exam set"
		}
	},
	{
		path: "/examSets/:id/edit",
		element: lazyLoad(React.lazy(() => import("@/views/examSet/AddOrUpdateExamSet"))),
		meta: {
			requiresRoles: [Role.ROLE_ADMIN,Role.ROLE_TEACHER],
			title: "Thêm bộ đề thi",
			key: "Add exam set"
		}
	}
];
