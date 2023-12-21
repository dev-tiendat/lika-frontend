import React from "react";
import lazyLoad from "../utils/LazyLoad";
import { RouteObject } from "@/routers/interface";

const errorRouter: Array<RouteObject> = [
	{
		path: "/403",
		element: lazyLoad(React.lazy(() => import("../../components/ErrorMessage/403"))),
		meta: {
			requiresRoles: [],
			title: "403",
			key: "403"
		}
	},
	{
		path: "/404",
		element: lazyLoad(React.lazy(() => import("../../components/ErrorMessage/404"))),
		meta: {
			requiresRoles: [],
			title: "404",
			key: "404"
		}
	},
	{
		path: "/500",
		element: lazyLoad(React.lazy(() => import("../../components/ErrorMessage/500"))),
		meta: {
			requiresRoles: [],
			title: "500",
			key: "500"
		}
	}
];

export default errorRouter;
