import React from "react";
import { Layout } from "antd";
import { Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./header.less";
import SvgIcon from "@/components/SvgIcon";
import Fullscreen from "./FullScreen";
import UserDropDown from "./UserDropdown";

type LayoutHeaderProps = {
	isCollapse: boolean;
	onCollapseChange: () => void;
	title: string;
};
const ICON_SIZE = 35;

const LayoutHeader: React.FC<LayoutHeaderProps> = ({ isCollapse, onCollapseChange, title }) => {
	const { Header } = Layout;

	const renderCollapseIcon = () => (
		<div className="collapsed" onClick={onCollapseChange}>
			{!isCollapse ? (
				<SvgIcon name="square-arrow-left" size={ICON_SIZE} color="#74B9FF" />
			) : (
				<SvgIcon name="square-arrow-right" size={ICON_SIZE} color="#74B9FF" />
			)}
		</div>
	);
	return (
		<Header>
			<div className="header-lf">{renderCollapseIcon()}</div>
			{isCollapse && (
				<Typography variant="h6" sx={{ fontWeight: 900, color: "#74B9FF" }}>
					{title}
				</Typography>
			)}
			<div className="header-ri">
				<Fullscreen />
				<UserDropDown />
			</div>
		</Header>
	);
};

export default LayoutHeader;
