import React, { useState, useEffect } from "react";
import { TableCell, TableCellProps } from "@mui/material";
import { TableHeader, Order } from "@/interface/table";
import SvgIcon from "../SvgIcon";

interface TableHeaderItemProps {
	item: TableHeader;
	isSelected: boolean;
	onChangeOrder?: (sortKey: string, order: Order) => void;
	align?: "left" | "center" | "right" | "justify" | "inherit" | undefined;
}

const ICON_SIZE = 12;

export const TableHederItem: React.FC<TableHeaderItemProps> = ({ item, isSelected, onChangeOrder, align }) => {
	const [order, setOrder] = useState<Order | undefined>(isSelected ? Order.DESC : undefined);

	useEffect(() => {
		if (!isSelected) setOrder(undefined);
	}, [isSelected, order]);

	const handleClickSortButton = () => {
		let _order;
		if(!isSelected){
			_order = Order.DESC;
		}
		else{
			_order = order === Order.ASC ? Order.DESC : Order.ASC;
		}
		setOrder(_order);
		onChangeOrder?.(item.sortKey!, _order);
	};

	return (
		<TableCell style={{ padding: 13 }} align={align}>
			<div className={`flex flex-row items-center ${align == "right" && "justify-end"}`}>
				<p className="inline text-textSecond text-sm font-medium text-[12px] uppercase">{item.title}</p>
				{item.sortKey && (
					<button onClick={handleClickSortButton} className="relative h-3.5 ml-1">
						<SvgIcon
							name="sort-up"
							size={ICON_SIZE}
							className="absolute top-0"
							color={order === Order.ASC ? "#000000" : "#95a5a6"}
						/>
						<SvgIcon
							name="sort-down"
							size={ICON_SIZE}
							className="absolute bottom-0"
							color={order === Order.DESC ? "#000000" : "#95a5a6"}
						/>
					</button>
				)}
			</div>
		</TableCell>
	);
};

export default TableHederItem;
