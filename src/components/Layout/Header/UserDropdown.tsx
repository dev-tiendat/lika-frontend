import React, { useState, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Avatar, Box, Typography, Divider, MenuItem, Menu } from "@mui/material";
import { Modal } from "antd";
import { AccountOutline, LogoutVariant, Svg } from "mdi-material-ui";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Role from "@/components/Role";
import avatar from "@/assets/images/avatar.jpg";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import global from "@/store/global";
import auth from "@/store/auth";
import SvgIcon from "@/components/SvgIcon";

export const UserDropDown = () => {
	const [anchorEl, setAnchorEl] = useState<Element | null>(null);
	const userProfile = useAppSelector(global.selectors.selectUserProfile);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleDropdownOpen = (event: SyntheticEvent) => {
		setAnchorEl(event.currentTarget);
	};

	const handleDropdownClose = () => {
		setAnchorEl(null);
	};

	const handleClickLogoutButton = () => {
		Modal.confirm({
			title: "Đăng xuất",
			icon: <ExclamationCircleOutlined />,
			content: "Bạn có chắc chắn muốn đăng xuất ?",
			okText: "Đăng xuất",
			cancelText: "Hủy",
			onOk: () => {
				dispatch(global.actions.removeUserProfile());
				dispatch(auth.actions.removeToken());
				navigate("/login");
			}
		});
	};

	const handleClickUserProfileButton = () => {
		navigate("/user/profile");
	};

	const styles = {
		py: 1,
		px: 2,
		width: "100%",
		display: "flex",
		alignItems: "center",
		color: "text.primary",
		textDecoration: "none",
		"& svg": {
			fontSize: "1.375rem",
			color: "text.secondary"
		}
	};

	return (
		<>
			<Badge
				overlap="circular"
				onClick={handleDropdownOpen}
				sx={{ ml: 2, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Avatar alt="avatar" onClick={handleDropdownOpen} sx={{ width: 40, height: 40, marginRight: 0.5 }} src={avatar} />
				<SvgIcon name="arrow-down" size={30} color="#feca57"/>
			</Badge>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => handleDropdownClose()}
				sx={{ "& .MuiMenu-paper": { width: userProfile!.roles.length > 1 ? 290 : 250, marginTop: 1 } }}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Box sx={{ pt: 0.5, pb: 1, px: 2 }}>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Badge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
							<Avatar alt={userProfile?.fullName} src={avatar} sx={{ width: "3.5rem", height: "3.5rem" }} />
						</Badge>
						<Box sx={{ display: "flex", marginLeft: 3, alignItems: "flex-start", flexDirection: "column" }}>
							<Typography variant="h6" sx={{ fontWeight: 400 ,color : "#74B9FF"}}>
								{userProfile?.fullName}
							</Typography>
							<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 0.5 }}>
								{userProfile?.roles.map(role => <Role key={role} role={role} styles="mr-1" />)}
							</Box>
						</Box>
					</Box>
				</Box>
				<Divider sx={{ mt: 0, mb: 1 }} />
				<MenuItem sx={{ p: 0 }} onClick={() => handleClickUserProfileButton()}>
					<Box sx={styles}>
						<AccountOutline sx={{ marginRight: 2 }} />
						Thông tin cá nhân
					</Box>
				</MenuItem>
				<MenuItem sx={{ py: 2 }} onClick={() => handleClickLogoutButton()}>
					<LogoutVariant sx={{ marginRight: 2, fontSize: "1.375rem"}} />
					Đăng xuất
				</MenuItem>
			</Menu>
		</>
	);
};

export default UserDropDown;
