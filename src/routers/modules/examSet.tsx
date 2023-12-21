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
					requiresRoles: [Role.ROLE_ADMIN],
					title: "Người dùng"
				}
			}
		]
	}
];
