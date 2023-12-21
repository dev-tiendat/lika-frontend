import { Divider } from "@mui/material";
import React from "react";

interface SimpleStatNumberProps {
	label: string;
	number: number;
	backgroundColor: string;
	additionalData: any;
}

export const SimpleStatNumber: React.FC<SimpleStatNumberProps> = ({
	label,
	number,
	backgroundColor,
	additionalData = [
		["", 0],
		["", 0],
		["", 0],
		["", 0]
	]
}) => {
	const [[label1, data1], [label2, data2], [label3, data3], [label4, data4]] = additionalData;

	return (
		<div
			className="flex flex-col justify-between mx-1"
			style={{
				width: "300px",
				height: "155px",
				borderRadius: "8px",
				backgroundColor: backgroundColor
			}}
		>
			<div className="px-5 pt-5">
				<h2 className="text-lg font-semibold text-white mb-1">{label}</h2>
				<div className="flex items-start">
					<div className={`text-3xl font-bold text-white mr-2 text-left w-full`}>{number}</div>
				</div>
			</div>
			{additionalData && (
				<div className={`flex flex-row justify-between items-center mb-2`}>
					<div className="w-full">
						<div className="text-sm font-semibold text-white text-center">{label1}</div>
						<div className="text-sm font-semibold text-white text-center">{data1}</div>
					</div>
					<Divider orientation="vertical" style={{ backgroundColor: "white" }} />
					<div className="w-full">
						<div className="text-sm font-semibold text-white text-center">{label2}</div>
						<div className="text-sm font-semibold text-white text-center">{data2}</div>
					</div>
					{label3 && (
						<>
							<Divider orientation="vertical" style={{ backgroundColor: "white" }} />
							<div className="w-full">
								<div className="text-sm font-semibold text-white text-center">{label3}</div>
								<div className="text-sm font-semibold text-white text-center">{data3}</div>
							</div>
						</>
					)}{" "}
				</div>
			)}
		</div>
	);
};

export default SimpleStatNumber;
