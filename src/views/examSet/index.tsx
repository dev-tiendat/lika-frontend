import React, { useState, useEffect, useCallback } from "react";
import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableFooter,
	Collapse,
	Typography
} from "@mui/material";
import { Select, Pagination } from "antd";
import APIManager from "@/api/";
import TableSearch from "@/components/Table/TableSearch";
import TableHeaderItem from "@/components/Table/TableHeaderItem";
import { AddNewButton } from "@/components/Table/AddNewButton";
import SvgIcon from "@/components/SvgIcon";
import doneIcon from "@/assets/images/done.png";
import { IMenuItem, Order, PaginationGenericData, TableFilter, TableHeader } from "@/interface/table";
import { Gender, Role, Status, UserProfile } from "@/interface/user";
import RoleComponent from "@/components/Role";
import ActionButtonsDropdown from "@/components/Table/ActionButtonsDropdown";
import callToast, { ToastType } from "@/common/callToast";
import { Question } from "@/interface/question";
import TypeComponent from "@/components/QuestionType";
import LevelComponent from "@/components/QuestionLevel";
import { ExamSet } from "@/interface/examSet";

const tableHeaderList: TableHeader[] = [
	{
		title: ""
	},
	{
		title: "ID",
		sortKey: "id"
	},
	{
		title: "Tên đề thi",
		sortKey: "name"
	},
	{
		title: "Trạng thái"
	},
	{
		title: "Môn học"
	},
	{
		title: "Người tạo"
	},
	{
		title: "Số đề thi"
	},
	{
		title: "Thao tác"
	}
];

const helperTextList = ["ID", "Tên bộ dề thi", "Tên môn học", "Tên người tạo"];

const roleOptions: TableFilter[] = [
	{ value: 1, label: "Quản trị viên" },
	{ value: 2, label: "Giảng viên" },
	{ value: 3, label: "Sinh viên" }
];

const statusOptions: TableFilter[] = [
	{ value: 1, label: "Đã kích hoạt" },
	{ value: 0, label: "Chưa kích hoạt" }
];

interface RowItemProps {
	item: ExamSet;
	onEdit?: () => void;
	onRemove?: () => void;
	onToggleStatus: () => void;
}

const RowItem: React.FC<RowItemProps> = ({ item, onEdit, onRemove, onToggleStatus }) => {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<>
			<TableRow key={item.id}>
				<TableCell onClick={() => setOpen(!open)}>
					{open ? <SvgIcon name="down" size={20} /> : <SvgIcon name="up" size={20} />}
				</TableCell>
				<TableCell>{item.id}</TableCell>
				<TableCell>{item.name}</TableCell>
				<TableCell>{item.status}</TableCell>
				<TableCell>{item.subject.subjectName}</TableCell>
				<TableCell>{item.createdBy.firstName + " " + item.createdBy.lastName}</TableCell>
				<TableCell>{item.exams.length}</TableCell>
				<TableCell align={"right"}>
					<ActionButtonsDropdown
						labelPrimary="câu hỏi"
						// status={item.status === Status.ACTIVE}
						onClickEdit={onEdit}
						onClickToggleStatus={onToggleStatus}
						onClickRemove={onRemove}
					/>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell colSpan={8} sx={{ py: "0 !important" }}>
					<Collapse in={open} timeout={"auto"} unmountOnExit>
						<div className="my-8">
							<Typography variant="h6" gutterBottom component="div">
								Đề thi
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>ID</TableCell>
										<TableCell>Mã đề</TableCell>
										<TableCell align="right">Tổng số câu hỏi</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{item.exams.map(exam => (
										<TableRow key={exam.examCode}>
											<TableCell>{exam.id}</TableCell>
											<TableCell>{exam.examCode}</TableCell>
											<TableCell align={"right"}>{exam.questions.length}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

export const UserView = () => {
	const [data, setData] = useState<ExamSet[] | undefined>(undefined);
	const [sortBy, setSortBy] = useState<string>(tableHeaderList[0].sortKey!);
	const [order, setOrder] = useState<Order>(Order.DESC);
	const [limit, setLimit] = useState<number>(10);
	const [totalElement, setTotalElement] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [search, setSearch] = useState<string>("");
	const [selectedRole, setSelectedRole] = useState<number>();
	const [selectedStatus, setSelectedStatus] = useState<number>();

	const loadData = useCallback(async () => {
		const params = {
			page: currentPage - 1,
			size: limit,
			order: order,
			sortBy: sortBy,
			query: search,
			status: selectedStatus,
			role: selectedRole
		};

		const { response, error } = await APIManager.GET<PaginationGenericData<ExamSet>>("/v1/api/examSet", params);

		if (APIManager.isSucceed(response)) {
			setData(response!.data!.content);
			setTotalElement(response!.data!.totalElements);
		}

		APIManager.setShowLoading(true);
	}, [limit, currentPage, sortBy, order, search, selectedRole, selectedStatus]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleClickEdit = (user: UserProfile) => {};

	const handleClickToggleStatus = async (username: string, status: Status) => {};

	const handleClickGiveAdmin = (id: string | number) => {};

	const handleClickRemove = (id: string | number) => {};

	const handleChangePage = (page: number, pageSize: number) => {
		setCurrentPage(page);
	};

	const handleChangeSelectRole = (role: number) => {
		setSelectedRole(role);
		resetPage();
	};

	const handleChangeSelectStatus = (status: number) => {
		setSelectedStatus(status);
		resetPage();
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

	const resetFilter = () => {
		setSelectedRole(undefined);
		setSelectedStatus(undefined);
	};

	const resetPage = () => {
		setLimit(10);
		setCurrentPage(1);
	};

	return (
		<div className="card min-h-full">
			<div className="flex flex-row justify-between items-center mb-5">
				<h3 className="text-xl font-semibold text-blackOne">Quản lý bộ đề thi</h3>
				<AddNewButton label="bộ đề thi" />
			</div>
			<div className="mb-5 flex flex-row items-center justify-between">
				<div className="search-filter">
					<TableSearch
						titleHelper="Tìm kiếm bộ đề thi"
						helperTextList={helperTextList}
						search={search}
						onChangeText={text => handleChangeTextSearch(text)}
					/>
					<Select
						placeholder="Môn học"
						value={selectedStatus}
						style={{ width: 150, height: 41, marginLeft: 10 }}
						onChange={value => handleChangeSelectStatus(value)}
						allowClear
						options={statusOptions}
					/>
					<button
						onClick={resetFilter}
						className="h-[40px] px-10 py-2 rounded-lg text-white font-semibold ml-[10px] bg-secondary"
					>
						Xóa bộ lọc
					</button>
				</div>

				<div></div>
			</div>
			{data?.length !== 0 ? (
				<>
					<TableContainer component={Paper}>
						<Table aria-label="Danh sách">
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
							<TableBody>{data?.map((item, index) => <RowItem item={item} />)}</TableBody>
						</Table>
					</TableContainer>
					<div className="flex flex-row justify-end p-5">
						<Pagination
							current={currentPage}
							onChange={handleChangePage}
							showSizeChanger={false}
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

export default UserView;
