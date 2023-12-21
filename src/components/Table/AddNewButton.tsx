import React, { CSSProperties } from "react";
import SvgIcon from "../SvgIcon";

interface AddNewButtonProps {
	label: string;
	onClick?: () => void;
	className?: string;
	style?: CSSProperties;
	labelStyle?: CSSProperties;
}

export const AddNewButton: React.FC<AddNewButtonProps> = ({ label, onClick, className, style, labelStyle }) => {
	const handleClickButton = () => {
		onClick?.();
	};

	return (
		<button
			className={`flex justify-center items-center px-4 py-3 bg-[#00a8ff] hover:bg-primary rounded-lg h-[41px] ${className}`}
			style={style}
			onClick={() => handleClickButton()}
		>
            <SvgIcon name="add-line" size={24} color="#ffffff"/>
			<p className="text-white font-medium ml-2" style={labelStyle}>{`Thêm ${label}`}</p>
		</button>
	);
};
