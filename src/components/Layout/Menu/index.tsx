import React, { useEffect, useState, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { Role } from "@/interface/user";
import { checkRoleExist, searchRoute } from "@/utils/RouteUtils";
import { useAppSelector } from "@/store/hooks";
import global from "@/store/global";
import SvgIcon from "@/components/SvgIcon";
import Logo from "./Logo";
import "./menu.less";

type MenuItem = Required<MenuProps>["items"][number];

const navigation: Menu.MenuOptions[] = [
	{
		path: "/home",
		roles: [Role.ROLE_ADMIN, Role.ROLE_STUDENT, Role.ROLE_STUDENT],
		title: "Trang chủ",
		icon: "home"
	},
	{
		path: "/statistics",
		roles: [Role.ROLE_ADMIN],
		title: "Thống kê",
		icon: "statistics"
	},
	{
		path: "/users",
		roles: [Role.ROLE_ADMIN],
		title: "Người dùng",
		icon: "user"
	},
	{
		path: "/subjects",
		roles: [Role.ROLE_TEACHER, Role.ROLE_ADMIN],
		title: "Môn học",
		icon: "subject"
	},
	{
		path: "/questions",
		roles: [Role.ROLE_ADMIN, Role.ROLE_TEACHER],
		title: "Câu hỏi",
		icon: "question"
	},
	{
		path: "/examSets",
		roles: [Role.ROLE_ADMIN, Role.ROLE_TEACHER],
		title: "Bộ đề thi",
		icon: "exam"
	},
	{
		path: "/schedule",
		roles: [Role.ROLE_ADMIN, Role.ROLE_TEACHER],
		title: "Lịch thi",
		icon: "schedule"
	},
	{
		path: "grades",
		roles: [Role.ROLE_ADMIN, Role.ROLE_TEACHER],
		title: "Điểm thi",
		icon: "grade"
	}
];

interface LayoutMenuProps {
	isCollapse: boolean;
	setTitle: (title: string) => void;
}

const LayoutMenu: React.FC<LayoutMenuProps> = ({ isCollapse, setTitle }) => {
	const { pathname } = useLocation();
	const [menuList, setMenuList] = useState<MenuItem[]>([]);
	const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);
	const [openKeys, setOpenKeys] = useState<string[]>([]);
	const currentUser = useAppSelector(global.selectors.selectUserProfile);
	const navigate = useNavigate();

	const handleClickMenu: MenuProps["onClick"] = ({ key }: { key: string }) => {
		setSelectedKeys([key]);
		// if (route.isLink) window.open(route.isLink, "_blank");
		navigate(key);
	};

	const handleOpenChange = (openKeys: string[]) => {
		if (openKeys.length === 0 || openKeys.length === 1) return setOpenKeys(openKeys);
		const latestOpenKey = openKeys[openKeys.length - 1];
		if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys);
		setOpenKeys([latestOpenKey]);
	};

	useEffect(() => {
		setMenuList(deepLoopFloat(navigation));
		setSelectedKeys([pathname]);
	}, []);

	useLayoutEffect(() => {
		const elementIcons = document.querySelectorAll(".ant-menu-item use");
		elementIcons.forEach(element => {
			changeColorIconByElement(element, "#8395A7");
		});

		for (let i = 0; i < navigation.length; i++) {
			if (navigation[i].path === selectedKeys[0]) {
				setTitle(navigation[i].title);
				break;
			}
		}

		const elementSelected = document.querySelector(".ant-menu-item-selected use");
		changeColorIconByElement(elementSelected, "#1677FF");
	}, [selectedKeys]);

	const getItem = (
		label: React.ReactNode,
		key?: React.Key | null,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: "group"
	): MenuItem => {
		return {
			key,
			icon,
			children,
			label,
			type
		} as MenuItem;
	};

	const addIcon = (icon: string) => {
		return <SvgIcon name={icon} size={30} />;
	};

	const deepLoopFloat = (menuList: Menu.MenuOptions[], newArr: MenuItem[] = []) => {
		menuList.forEach((item: Menu.MenuOptions) => {
			if (checkRoleExist(item.roles, currentUser!.roles)) {
				if (!item?.children?.length) return newArr.push(getItem(item.title, item.path, addIcon(item.icon!)));
				newArr.push(getItem(item.title, item.path, addIcon(item.icon!), deepLoopFloat(item.children)));
			}
		});
		return newArr;
	};

	const changeColorIconByElement = (element: Element | null, color: string) => {
		if (element) element.setAttribute("fill", color);
	};

	return (
		<div className="menu">
			<Logo isCollapse={isCollapse} />
			<Menu
				theme="light"
				mode="inline"
				triggerSubMenuAction="click"
				openKeys={openKeys}
				selectedKeys={selectedKeys}
				items={menuList}
				onClick={handleClickMenu}
				onOpenChange={handleOpenChange}
			/>
		</div>
	);
};

export default LayoutMenu;
