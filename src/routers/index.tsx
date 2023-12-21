import { Navigate, useRoutes } from "react-router-dom";
import { RouteObject } from "./interface";

const metaRouters = import.meta.glob("./modules/*.tsx", { eager: true }) as Record<
	string,
	{
		[key: string]: any;
	}
>;

export const routerArray: RouteObject[] = [];
Object.keys(metaRouters).forEach(item => {
	Object.keys(metaRouters[item] as RouteObject[]).forEach((key: any) => {
		routerArray.push(...metaRouters[item][key]);
	});
});

export const rootRouter: RouteObject[] = [
	...routerArray,
	{
		path: "*",
		meta: {
			title: "404",
			requiresRoles: []
		},
		element: <Navigate to="/404" />
	},
	{
		path: "/",
		element: <Navigate to="/login" />
	}
];

const Router = () => {
	const routes = useRoutes(rootRouter as any);

	return routes;
};

export default Router;
