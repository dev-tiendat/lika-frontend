import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from "@mui/material";
import { Select, Pagination } from "antd";
import dayjs from "dayjs";
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
import { pageSizeOptions } from "@/common/constants";

const tableHeaderList: TableHeader[] = [
	{
		title: "ID",
		sortKey: "id"
	},
	{
		title: "Mã người dùng",
		sortKey: "username"
	},
	{
		title: "Họ",
		sortKey: "firstName"
	},
	{
		title: "Tên",
		sortKey: "lastName"
	},
	{
		title: "Ngày sinh",
		sortKey: "birthOfDay"
	},
	{
		title: "Email",
		sortKey: "email"
	},
	{
		title: "Giới tính"
	},
	{
		title: "Địa chỉ"
	},
	{
		title: "Vai trò"
	},
	{
		title: "Thao tác"
	}
];

const helperTextList = ["Họ và tên", "Mã người dùng"];

const roleOptions: TableFilter[] = [
	{ value: 1, label: "Quản trị viên" },
	{ value: 2, label: "Giảng viên" },
	{ value: 3, label: "Sinh viên" }
];

const statusOptions: TableFilter[] = [
	{ value: 1, label: "Đã kích hoạt" },
	{ value: 0, label: "Chưa kích hoạt" }
];

const DATE_FORMAT = "DD/MM/YYYY";

export const UserView = () => {
	const [data, setData] = useState<UserProfile[] | undefined>(undefined);
	const [sortBy, setSortBy] = useState<string>(tableHeaderList[0].sortKey!);
	const [order, setOrder] = useState<Order>(Order.DESC);
	const [limit, setLimit] = useState<number>(10);
	const [totalElement, setTotalElement] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [search, setSearch] = useState<string>("");
	const [selectedRole, setSelectedRole] = useState<number>();
	const [selectedStatus, setSelectedStatus] = useState<number>();
	const navigate = useNavigate();

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

		const { response, error } = await APIManager.GET<PaginationGenericData<UserProfile>>("/v1/api/users", params);

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

	const handleClickToggleStatus = async (username: string, status: Status) => {
		const { response, error } = await APIManager.PATCH<UserProfile>(
			`/v1/api/users/${username}/${status !== Status.ACTIVE ? "activate" : "deactivate"}`
		);
		if (APIManager.isSucceed(response)) {
			callToast(
				ToastType.SUCCESS,
				(status === Status.ACTIVE ? "Hủy kích hoạt người dùng " : "Kích hoạt người dùng ") + username + " thành công!"
			);
			loadData();
		}
	};

	const handleClickGiveAdmin = async (username: string) => {
		const { response, error } = await APIManager.PATCH<UserProfile>(`/v1/api/users/${username}/giveAdmin`);
		if (APIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, `Giao quyền quản trị cho ${username} thành công!`);
			loadData();
		}
	};

	const handleClickRemove = async (username: string) => {
		const { response, error } = await APIManager.DELETE<UserProfile>(`/v1/api/users/${username}`);

		if (APIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, `Xóa người dùng ${username} thành công!`);
			loadData();
		}
	};

	const handleChangePage = (page: number, pageSize: number) => {
		setCurrentPage(page);
		setLimit(pageSize);
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

	const convertDate = (time: number) => dayjs(time).format(DATE_FORMAT);

	const renderTableRowItem = (item: UserProfile, index: number) => {
		return (
			<TableRow key={item.id}>
				<TableCell>{item.id}</TableCell>
				<TableCell>
					<div className="flex flex-row relative items-center">
						<p>{item.username} </p>
						{item.status === Status.ACTIVE && <img className="w-4 h-4 absolute -left-7" src={doneIcon} />}
					</div>
				</TableCell>
				<TableCell>{item.firstName}</TableCell>
				<TableCell>{item.lastName}</TableCell>
				<TableCell>{convertDate(item.dateOfBirth)}</TableCell>
				<TableCell>{item.email}</TableCell>
				<TableCell>{item.gender === Gender.FEMALE ? "Nữ" : "Nam"}</TableCell>
				<TableCell sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{item.address}</TableCell>
				<TableCell>
					{item.roles.map((role, index) => (
						<div key={index} className="flex items-center">
							<RoleComponent role={role} styles={`${index !== 0 && "mt-1"} px-0 py-0 rounded-[6px]`} />
						</div>
					))}
				</TableCell>
				<TableCell align={"right"}>
					{item.roles.indexOf(Role.ROLE_ADMIN) == -1 && (
						<ActionButtonsDropdown
							labelPrimary="người dùng"
							status={item.status === Status.ACTIVE}
							disableGiveAdminButtonText={
								item.roles.indexOf(Role.ROLE_STUDENT) !== -1 ? "Không thể thao tác sinh viên" : undefined
							}
							onClickEdit={() => handleClickEdit(item)}
							onClickToggleStatus={() => handleClickToggleStatus(item.username, item.status)}
							onClickGiveAdmin={() => handleClickGiveAdmin(item.username)}
							onClickRemove={() => handleClickRemove(item.username)}
						/>
					)}
				</TableCell>
			</TableRow>
		);
	};

	return (
		<div className="card min-h-full">
			<div className="flex flex-row justify-between items-center mb-5">
				<h3 className="text-xl font-semibold text-blackOne">Quản lý người dùng</h3>
				<AddNewButton label="người dùng" onClick={() => navigate("/users/add")} />
			</div>
			<div className="mb-5 flex flex-row items-center justify-between">
				<div className="search-filter">
					<TableSearch
						titleHelper="Tìm kiếm người dùng"
						helperTextList={helperTextList}
						search={search}
						onChangeText={text => handleChangeTextSearch(text)}
					/>
					<Select
						placeholder="Vai trò"
						value={selectedRole}
						style={{ width: 150, height: 41, marginLeft: 10 }}
						onChange={value => handleChangeSelectRole(value)}
						options={roleOptions}
					/>
					<Select
						placeholder="Trạng thái"
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
						<Table aria-label="Danh sách người dùng">
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
					<div className="flex flex-row justify-end py-5">
						<Pagination
							current={currentPage}
							onChange={handleChangePage}
							pageSizeOptions={pageSizeOptions}
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
