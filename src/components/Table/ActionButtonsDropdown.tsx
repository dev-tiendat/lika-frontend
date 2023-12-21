import React, { useState, SyntheticEvent } from "react";
import { Menu, MenuItem, Divider } from "@mui/material";
import SvgIcon from "@/components/SvgIcon";

const ICON_SIZE = 20;

interface ActionButtonsDropdownProps {
	labelPrimary: string;
	status?: boolean;
	renderButtonOthers?: () => React.ReactElement;
	onClickEdit?: () => void;
	onClickToggleStatus?: () => void;
	onClickRemove?: () => void;
	onClickGiveAdmin?: () => void;
	disableGiveAdminButtonText?: string;
	disableEditButtonText?: string;
	disableRemoveButtonText?: string;
	disableToggleStatusButtonText?: string;
}

export const ActionButtonsDropdown: React.FC<ActionButtonsDropdownProps> = ({
	labelPrimary,
	status,
	onClickEdit,
	onClickRemove,
	onClickToggleStatus,
	onClickGiveAdmin,
	disableGiveAdminButtonText,
	disableToggleStatusButtonText,
	disableRemoveButtonText,
	disableEditButtonText
}) => {
	const [anchorEl, setAnchorEl] = useState<Element | null>(null);

	const handleDropdownOpen = (event: SyntheticEvent) => {
		setAnchorEl(event.currentTarget);
	};

	const handleDropdownClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<button onClick={handleDropdownOpen}>
				<SvgIcon name="dots-three-horizontal" size={18} color={anchorEl ? "#feca57" : undefined} />
			</button>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => handleDropdownClose()}
				sx={{ "& .MuiMenu-paper": { marginTop: 1, paddingX: 1, maxWidth: "250px" } }}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
			>
				{onClickEdit && (
					<MenuItem sx={{ paddingY: 1 }} disabled={disableEditButtonText ? true : false} onClick={onClickEdit}>
						<SvgIcon name="edit" size={ICON_SIZE} color={disableEditButtonText ? "#bdc3c7" : "#74B9FF"} />
						<div className="ml-3">
							<span className={`text-sm`}>Sửa {labelPrimary}</span>
							<p className="text-xs text-secondary ">{disableEditButtonText}</p>
						</div>
					</MenuItem>
				)}

				{onClickToggleStatus && (
					<MenuItem sx={{ paddingY: 1 }} disabled={disableToggleStatusButtonText ? true : false} onClick={onClickToggleStatus}>
						<SvgIcon
							name={status ? "x" : "done"}
							size={ICON_SIZE}
							color={disableToggleStatusButtonText ? "#bdc3c7" : "#74B9FF"}
						/>
						<div className="ml-3">
							<span className="text-sm"> {status ? "Hủy kích hoạt" : "Kích hoạt" + " " + labelPrimary}</span>
							<p className="text-xs text-secondary">{disableToggleStatusButtonText}</p>
						</div>
					</MenuItem>
				)}
				{onClickGiveAdmin && (
					<MenuItem sx={{ paddingY: 1 }} disabled={disableGiveAdminButtonText ? true : false} onClick={onClickGiveAdmin}>
						<SvgIcon name="admin-users" size={ICON_SIZE} color={disableToggleStatusButtonText ? "#bdc3c7" : "#74B9FF"} />
						<div className="ml-3">
							<span className={`text-sm`}>Giao quyền quản trị viên</span>
							<p className="text-xs text-secondary">{disableGiveAdminButtonText}</p>
						</div>
					</MenuItem>
				)}

				<Divider />
				{onClickRemove && (
					<MenuItem sx={{ paddingY: 1 }} disabled={disableRemoveButtonText ? true : false} onClick={onClickRemove}>
						<SvgIcon name="remove" size={ICON_SIZE} color="#e74c3c" />
						<span className="ml-3 text-sm text-[#e74c3c]">Xóa {labelPrimary}</span>
					</MenuItem>
				)}
			</Menu>
		</div>
	);
};

export default ActionButtonsDropdown;
