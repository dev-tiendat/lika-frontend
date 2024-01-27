import React, { useState, useEffect, useCallback } from "react";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from "@mui/material";
import { Select, Pagination } from "antd";
import APIManager from "@/api/";
import TableSearch from "@/components/Table/TableSearch";
import TableHeaderItem from "@/components/Table/TableHeaderItem";
import { AddNewButton } from "@/components/Table/AddNewButton";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { IMenuItem, Order, PaginationGenericData, TableFilter, TableHeader } from "@/interface/table";
import { Role, UserInfo, UserProfile } from "@/interface/user";
import ActionButtonsDropdown from "@/components/Table/ActionButtonsDropdown";
import callToast, { ToastType } from "@/common/callToast";
import { Question, Status } from "@/interface/question";
import TypeComponent from "@/components/QuestionType";
import LevelComponent from "@/components/QuestionLevel";
import { Subject } from "@/interface/subject";
import { useAppSelector } from "@/store/hooks";
import global from "@/store/global";
import { pageSizeOptions } from "@/common/constants";
import { Schedule } from "@/interface/schedule";
import ScheduleStatusComponent from "@/components/ScheduleStatus";

const tableHeaderList: TableHeader[] = [
	{
		title: "ID",
		sortKey: "id"
	},
	{
		title: "Tên lịch thi",
		sortKey: "title"
	},
	{
		title: "Mã môn học"
	},
	{
		title: "Tên môn học",
		sortKey: "type"
	},
	{
		title: "Trạng thái",
		sortKey: "level"
	},
	{
		title: "Giờ thi"
	},
	{
		title: "Ngày thi"
	},
	{
		title: "Thời gian thi"
	},
	{
		title: "Giảng viên"
	},
	{
		title: "Thao tác"
	}
];

const helperTextList = ["ID", "Tên lịch thi", "Tên người tạo"];

const DATE_FORMAT = "DD/MM/YYYY";

export const ScheduleView = () => {
	const [data, setData] = useState<Schedule[] | undefined>(undefined);
	const [sortBy, setSortBy] = useState<string>(tableHeaderList[0].sortKey!);
	const [order, setOrder] = useState<Order>(Order.DESC);
	const [limit, setLimit] = useState<number>(10);
	const [totalElement, setTotalElement] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [search, setSearch] = useState<string>("");
	const [selectedTeacher, setSelectedTeacher] = useState<number | undefined>(undefined);
	const [selectedSubject, setSelectedSubject] = useState<string>();
	const [subjectOptions, setSubjectOptions] = useState<any>();
	const [teacherOptions, setTeacherOptions] = useState<any>();
	const currentDate = dayjs(new Date()).valueOf();
	const currentUser = useAppSelector(global.selectors.selectUserProfile);
	const navigate = useNavigate();

	const loadData = useCallback(async () => {
		const params = {
			page: currentPage - 1,
			size: limit,
			order: order,
			sortBy: sortBy,
			query: search,
			subjectId: selectedSubject,
			teacherId: selectedTeacher
		};

		const { response, error } = await APIManager.GET<PaginationGenericData<Schedule>>("/v1/api/examSchedule", params);

		if (APIManager.isSucceed(response)) {
			setData(response!.data!.content);
			setTotalElement(response!.data!.totalElements);
		}

		APIManager.setShowLoading(true);
	}, [limit, currentPage, sortBy, order, search, selectedTeacher, selectedSubject]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const loadTeacherOptions = async () => {
		const { response, error } = await APIManager.GET<PaginationGenericData<UserInfo>>("/v1/api/teachers");
		if (APIManager.isSucceed(response)) {
			const options = response!.data!.content.map(teacher => {
				return {
					label: teacher.username + " - " + teacher.firstName + " " + teacher.lastName,
					value: teacher.id
				};
			});

			setTeacherOptions(options);
		}
	};

	const loadSubjectOptions = async () => {
		const { response, error } = await APIManager.GET<PaginationGenericData<Subject>>("/v1/api/subjects/haveChapter");
		if (APIManager.isSucceed(response)) {
			const options = response!.data!.content.map(subject => {
				return {
					label: subject.subjectName,
					value: subject.id
				};
			});

			setSubjectOptions(options);
		}
	};

	useEffect(() => {
		loadSubjectOptions();
		loadTeacherOptions();
	}, []);

	const handleClickEdit = (schedule: Schedule) => {
		navigate(`/schedule/${schedule.id}/edit`, { state: schedule });
	};

	const handleClickRemove = async (id: number) => {
		const { response, error } = await APIManager.DELETE<UserProfile>(`/v1/api/examSchedule/${id}`);

		if (APIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, `Xóa lịch thi ${id} thành công!`);
			loadData();
		}
	};

	const handleClickToggleStatus = async (id: number, status: Status) => {
		const { response, error } = await APIManager.PATCH<Schedule>(
			`/v1/api/examSchedule/${id}/${status !== Status.ENABLE ? "enable" : "cancel"}`
		);
		if (APIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, (status === Status.ENABLE ? "Hủy lịch thi " : "Bật lịch thi ") + id + " thành công!");
			loadData();
		}
	};

	const handleChangePage = (page: number, pageSize: number) => {
		setCurrentPage(page);
		setLimit(pageSize);
	};

	const handleChangeSelectTeacher = (teacherId: number) => {
		setSelectedTeacher(teacherId);
		resetPage();
	};

	const handleChangeSelectSubject = (id: string) => {
		setSelectedSubject(id);
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
		setSelectedTeacher(undefined);
		setSelectedSubject(undefined);
	};
	console.log(selectedTeacher);

	const resetPage = () => {
		setLimit(10);
		setCurrentPage(1);
	};

	const convertDate = (time: number, format?: string) => dayjs(time).format(format || DATE_FORMAT);

	const renderTableRowItem = (item: Schedule, index: number) => {
		return (
			<TableRow key={item.id}>
				<TableCell>{item.id}</TableCell>
				<TableCell>{item.title}</TableCell>
				<TableCell>{item.examSet?.subject.id}</TableCell>
				<TableCell>{item.examSet?.subject.subjectName}</TableCell>
				<TableCell>
					<ScheduleStatusComponent
						status={item.publishedAt < currentDate && item.status === Status.ENABLE ? undefined : item.status}
					/>
				</TableCell>
				<TableCell>{convertDate(item.publishedAt, "hh:mm")}</TableCell>
				<TableCell>{convertDate(item.publishedAt)}</TableCell>
				<TableCell>{item.timeAllowance} phút</TableCell>
				<TableCell>{item.teacher?.firstName + " " + item.teacher?.lastName}</TableCell>
				<TableCell align={"right"}>
					{item.publishedAt > currentDate && (
						<ActionButtonsDropdown
							labelPrimary="lịch thi"
							status={item.status === Status.ENABLE}
							onClickToggleStatus={() => handleClickToggleStatus(item.id, item.status)}
							onClickEdit={() => handleClickEdit(item)}
							onClickRemove={() => handleClickRemove(item.id)}
						/>
					)}
				</TableCell>
			</TableRow>
		);
	};

	return (
		<div className="card min-h-full">
			<div className="flex flex-row justify-between items-center mb-5">
				<h3 className="text-xl font-semibold text-blackOne">Quản lý lịch thi</h3>
				{currentUser!.roles.indexOf(Role.ROLE_TEACHER) !== -1 && (
					<AddNewButton label="lịch thi" onClick={() => navigate("/schedule/add")} />
				)}
			</div>
			<div className="mb-5 flex flex-row items-center justify-between">
				<div className="search-filter">
					<TableSearch
						titleHelper="Tìm kiếm lịch thi"
						helperTextList={helperTextList}
						search={search}
						onChangeText={text => handleChangeTextSearch(text)}
					/>
					<Select
						placeholder="Giảng viên"
						value={selectedTeacher}
						style={{ width: 250, height: 41, marginLeft: 10 }}
						onChange={value => handleChangeSelectTeacher(value)}
						allowClear
						options={teacherOptions}
					/>
					<Select
						placeholder="Môn học"
						value={selectedSubject}
						style={{ width: 150, height: 41, marginLeft: 10 }}
						onChange={value => handleChangeSelectSubject(value)}
						allowClear
						options={subjectOptions}
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
						<Table aria-label="Danh sách lịch thi">
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
							showSizeChanger={false}
							pageSizeOptions={pageSizeOptions}
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

export default ScheduleView;
