import { Role } from "@/interface/user";

export interface MetaProps {
	keepAlive?: boolean;
	requiresRoles: Role[];
	title: string;
	key?: string;
}

export interface RouteObject {
	caseSensitive?: boolean;
	children?: RouteObject[];
	element?: React.ReactNode;
	index?: boolean;
	path?: string;
	meta?: MetaProps;
	isLink?: string;
}
