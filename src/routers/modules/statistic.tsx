import React from "react";
import { LayoutIndex } from "@/components/Layout";
import { RouteObject } from "../interface";
import lazyLoad from "../utils/LazyLoad";
import { Role } from "@/interface/user";

const homeRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		children: [
			{
				path: "/statistics",
				element: lazyLoad(React.lazy(() => import("@/views/statistic"))),
				meta: {
					requiresRoles: [Role.ROLE_ADMIN],
					title: "Home"
				}
			}
		]
	}
];

export default homeRouter;
