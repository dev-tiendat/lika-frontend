import { LayoutIndex } from "@/components/Layout";
import { RouteObject } from "../interface";
import HomeView from "@/views/home";

const homeRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		children: [
			{
				path: "/home",
				element: <HomeView />,
				meta: {
					requiresRoles: [],
					title: "Home"
				}
			}
		]
	}
];

export default homeRouter;
