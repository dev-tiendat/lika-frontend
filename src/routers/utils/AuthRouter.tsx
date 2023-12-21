import { useLocation, Navigate } from "react-router-dom";
import { RouteObject } from "../interface";
import { rootRouter } from "..";
import { AxiosCanceler } from "@/api/helper/axiosCancel";
import { store } from "@/store/store";
import auth from "@/store/auth";
import global from "@/store/global";
import { checkRoleExist, searchRoute } from "@/utils/RouteUtils";

const axiosCanceler = new AxiosCanceler();

const AuthRouter = (props: { children: JSX.Element }) => {
	const { pathname } = useLocation();
	const route = searchRoute(pathname, rootRouter);
	axiosCanceler.removeAllPending();
	if (pathname === "/login" || pathname === "/signUp") {
		store.dispatch(auth.actions.removeToken());
		store.dispatch(global.actions.removeUserProfile());
	}

	if (!route.meta || route.meta.requiresRoles.length === 0) return props.children;

	const roles = store.getState().global.userProfile?.roles;
	const token = store.getState().auth.token;
	if (!token || !roles) return <Navigate to="/login" replace />;

	if (!checkRoleExist(route.meta?.requiresRoles, roles)) return <Navigate to="/403" replace />;
	
	return props.children;
};

export default AuthRouter;
