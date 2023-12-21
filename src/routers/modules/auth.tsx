import React from "react";
import lazyLoad from "../utils/LazyLoad";
import { RouteObject } from "@/routers/interface";
import LoginView from "../../views/auth/login/";
import SignUpView from "../../views/auth/signUp/";

const authRouter: Array<RouteObject> = [
	{
		path: "/login",
		element: <LoginView />,
		meta: {
			requiresRoles: [],
			title: "Đăng nhập",
			key: "login"
		}
	},
	{
		path: "/signUp",
		element: <SignUpView />,
		meta: {
			requiresRoles: [],
			title: "Đăng ký",
			key: "signUp"
		}
	}
];

export default authRouter;
