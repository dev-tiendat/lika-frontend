import React, { useState, SyntheticEvent } from "react";
import { TextField, InputAdornment, Menu } from "@mui/material";
import { Magnify } from "mdi-material-ui";
import SvgIcon from "../SvgIcon";

interface TableSearchProps {
	search: string;
	onChangeText?: (text: string) => void;
	helperTextList?: string[];
	titleHelper?: string;
}

export const TableSearch: React.FC<TableSearchProps> = ({ search, onChangeText, helperTextList, titleHelper }) => {
	const [anchorEl, setAnchorEl] = useState<Element | null>(null);

	const handleDropdownOpen = (event: SyntheticEvent) => {
		setAnchorEl(event.currentTarget);
	};

	const handleDropdownClose = (url?: string) => {
		setAnchorEl(null);
	};

	const handleChangeSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChangeText?.(e.target.value);
	};

	const renderHelperTextItem = (text: string, key: number) => {
		return (
			<div key={key} className="mt-3 flex justify-center items-center">
				<p className="text-sm">{text}</p>
			</div>
		);
	};

	return (
		<TextField
			size="small"
			placeholder="Tìm kiếm"
			value={search}
			onChange={handleChangeSearchText}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<Magnify fontSize="medium" />{" "}
					</InputAdornment>
				),
				style: { borderRadius: 10, paddingTop: 2, paddingBottom: 2, fontSize: "14px" },
				endAdornment: (
					<>
						<button
							onClick={handleDropdownOpen}
							className="ml-3 relative before:absolute before:top-[50%] before:left-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:w-[160%] before:h-[160%] before:rounded-full before:content-[''] hover:before:bg-[#F5F5F5] before:-z-10 z-10"
						>
							<SvgIcon name="info" size={20} color="#feca57" />
						</button>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={() => handleDropdownClose()}
							sx={{ "& .MuiMenu-paper": { width: 250, marginTop: 1.5, borderRadius: 3 } }}
							anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
							transformOrigin={{ vertical: "top", horizontal: "right" }}
						>
							{titleHelper && <p className="text-center text-sm font-bold text-textSecond">{titleHelper}</p>}
							{helperTextList && helperTextList.map((text, index) => renderHelperTextItem(text, index))}
						</Menu>
					</>
				)
			}}
		/>
	);
};

export default TableSearch;
