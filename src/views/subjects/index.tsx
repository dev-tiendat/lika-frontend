import React, { useState, useEffect, useCallback } from "react";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from "@mui/material";
import { Select, Pagination } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import APIManager from "@/api/";
import TableSearch from "@/components/Table/TableSearch";
import TableHeaderItem from "@/components/Table/TableHeaderItem";
import { AddNewButton } from "@/components/Table/AddNewButton";
import { IMenuItem, Order, PaginationGenericData, TableFilter, TableHeader } from "@/interface/table";
import { Gender, Role, Status, UserProfile } from "@/interface/user";
import RoleComponent from "@/components/Role";
import ActionButtonsDropdown from "@/components/Table/ActionButtonsDropdown";
import callToast, { ToastType } from "@/common/callToast";
import { Subject } from "@/interface/subject";
import { pageSizeOptions } from "@/common/constants";

const tableHeaderList: TableHeader[] = [
	{
		title: "Mã môn học",
		sortKey: "subjectId"
	},
	{
		title: "Tên môn học",
		sortKey: "subjectName"
	},
	{
		title: "Số tín chỉ",
		sortKey: "creditHours"
	},
	{
		title: "Tổng số chương"
	},
	{
		title: "Thao tác"
	}
];

const helperTextList = ["ID", "Tên môn học"];

const DATE_FORMAT = "DD/MM/YYYY";

export const SubjectView = () => {
	const [data, setData] = useState<Subject[] | undefined>(undefined);
	const [sortBy, setSortBy] = useState<string>(tableHeaderList[0].sortKey!);
	const [order, setOrder] = useState<Order>(Order.DESC);
	const [limit, setLimit] = useState<number>(10);
	const [totalElement, setTotalElement] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [search, setSearch] = useState<string>("");
	const navigate = useNavigate();

	const loadData = useCallback(async () => {
		const params = {
			page: currentPage - 1,
			size: limit,
			order: order,
			sortBy: sortBy,
			query: search
		};

		const { response, error } = await APIManager.GET<PaginationGenericData<Subject>>("/v1/api/subjects", params);

		if (APIManager.isSucceed(response)) {
			setData(response!.data!.content);
			setTotalElement(response!.data!.totalElements);
		}

		APIManager.setShowLoading(true);
	}, [limit, currentPage, sortBy, order, search]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleClickEdit = (subject: Subject) => {
		navigate(`/subjects/${subject.id}/edit`, { state: subject });
	};

	const handleClickRemove = async (id: string | number) => {
		const { response, error } = await APIManager.DELETE<Subject>(`/v1/api/subjects/${id}`);

		if (APIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, "Xóa môn học " + id + " thành công!");
		}
	};

	const handleChangePage = (page: number, pageSize: number) => {
		setCurrentPage(page);
		setLimit(pageSize);
	};

	const handleChangeLimit = (limit: number) => {
		setLimit(limit);
	};

	const handleChangeTextSearch = (text: string) => {
		APIManager.setShowLoading(false);
		setSearch(text);
	};

	const handleChangeOrder = (sortKey: string, order: Order) => {
		setOrder(order);
		setSortBy(sortKey);
	};

	const renderTableRowItem = (item: Subject, index: number) => {
		return (
			<TableRow key={item.id}>
				<TableCell>{item.id}</TableCell>
				<TableCell>{item.subjectName}</TableCell>
				<TableCell>{item.creditHours}</TableCell>
				<TableCell>{item.chapters.length}</TableCell>
				<TableCell align={"right"}>
					<ActionButtonsDropdown
						labelPrimary="môn học"
						onClickEdit={() => handleClickEdit(item)}
						onClickRemove={() => handleClickRemove(item.id)}
					/>
				</TableCell>
			</TableRow>
		);
	};

	return (
		<div className="card min-h-full">
			<div className="flex flex-row justify-between items-center mb-5">
				<h3 className="text-xl font-semibold text-blackOne">Quản lý môn học</h3>
				<AddNewButton label="môn học" onClick={() => navigate("/subjects/add")} />
			</div>
			<div className="mb-5 flex flex-row items-center justify-between">
				<div className="search-filter">
					<TableSearch
						titleHelper="Tìm kiếm môn học"
						helperTextList={helperTextList}
						search={search}
						onChangeText={text => handleChangeTextSearch(text)}
					/>
				</div>

				<div></div>
			</div>
			{data?.length !== 0 ? (
				<>
					<TableContainer component={Paper}>
						<Table aria-label="Danh sách môn học">
							<TableHead sx={{ backgroundColor: "#F5F5F5" }}>
								<TableRow>
									{tableHeaderList.map((item, index) => (
										<TableHeaderItem
											item={item}
											key={item.sortKey}
											onChangeOrder={(sortBy, order) => handleChangeOrder(sortBy, order)}
											isSelected={sortBy === item.sortKey}
											align={index === tableHeaderList.length - 1 ? "right" : "left"}
										/>
									))}
								</TableRow>
							</TableHead>
							<TableBody>{data?.map((item, index) => renderTableRowItem(item, index))}</TableBody>
						</Table>
					</TableContainer>
					<div className="flex flex-row justify-end p-5">
						<Pagination
							current={currentPage}
							onChange={handleChangePage}
							pageSizeOptions={pageSizeOptions}
							showSizeChanger
							defaultCurrent={1}
							total={totalElement}
						/>
					</div>
				</>
			) : (
				<div className="h-full  mt-40 flex justify-center items-center">
					<p className="py-3 px-3 rounded-lg border-admin border-solid border-[2px] text-primary text-lg">
						Danh sách hiện đang trống
					</p>
				</div>
			)}
		</div>
	);
};

export default SubjectView;
