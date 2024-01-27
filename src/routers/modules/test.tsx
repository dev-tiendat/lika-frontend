import React from "react";
import { LayoutIndex } from "@/components/Layout";
import { RouteObject } from "../interface";
import lazyLoad from "../utils/LazyLoad";
import { Role } from "@/interface/user";

export const userRouter: Array<RouteObject> = [
	{
		path: "/takeTest",
		element: lazyLoad(React.lazy(() => import("@/views/test/TakeTest"))),
		meta: {
			requiresRoles: [Role.ROLE_STUDENT],
			title: "Làm bài thi"
		}
	},
	{
		path: "/test/:id",
		element: lazyLoad(React.lazy(() => import("@/views/test/Test"))),
		meta: {
			requiresRoles: [Role.ROLE_STUDENT],
			title: "Làm bài thi"
		}
	},
	{
		path: "/testResult",
		element: lazyLoad(React.lazy(() => import("@/views/test/TestResult"))),
		meta: {
			requiresRoles: [Role.ROLE_STUDENT],
			title: "Kết quả bài thi"
		}
	},
	{
		element: <LayoutIndex />,
		children: [
			{
				path: "/tests",
				element: lazyLoad(React.lazy(() => import("@/views/test/OldTestsView"))),
				meta: {
					requiresRoles: [Role.ROLE_STUDENT],
					title: "Kết quả bài thi"
				}
			}
		]
	}
];
