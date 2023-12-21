import React, { useState, useEffect, useCallback } from "react";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from "@mui/material";
import { Select, Pagination } from "antd";
import APIManager from "@/api/";
import TableSearch from "@/components/Table/TableSearch";
import TableHeaderItem from "@/components/Table/TableHeaderItem";
import { AddNewButton } from "@/components/Table/AddNewButton";
import { useNavigate } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";
import doneIcon from "@/assets/images/done.png";
import { IMenuItem, Order, PaginationGenericData, TableFilter, TableHeader } from "@/interface/table";
import { Gender, Role, Status, UserInfo, UserProfile } from "@/interface/user";
import RoleComponent from "@/components/Role";
import ActionButtonsDropdown from "@/components/Table/ActionButtonsDropdown";
import callToast, { ToastType } from "@/common/callToast";
import { Question } from "@/interface/question";
import { HoverShowAnswer } from "./HoverShowQuestion";
import TypeComponent from "@/components/QuestionType";
import LevelComponent from "@/components/QuestionLevel";
import { Subject } from "@/interface/subject";
import { useAppSelector } from "@/store/hooks";
import global from "@/store/global";

const tableHeaderList: TableHeader[] = [
	{
		title: "ID",
		sortKey: "id"
	},
	{
		title: "Nội dung câu hỏi",
		sortKey: "content"
	},
	{
		title: "Đáp án"
	},
	{
		title: "Loại câu",
		sortKey: "type"
	},
	{
		title: "Độ khó",
		sortKey: "level"
	},
	{
		title: "Chương"
	},
	{
		title: "Môn học"
	},
	{
		title: "Người tạo"
	},
	{
		title: "Thao tác"
	}
];

const helperTextList = ["ID", "Nội dung câu hỏi", "Tên chương"];

export const UserView = () => {
	const [data, setData] = useState<Question[] | undefined>(undefined);
	const [sortBy, setSortBy] = useState<string>(tableHeaderList[0].sortKey!);
	const [order, setOrder] = useState<Order>(Order.DESC);
	const [limit, setLimit] = useState<number>(10);
	const [totalElement, setTotalElement] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [search, setSearch] = useState<string>("");
	const [selectedTeacher, setSelectedTeacher] = useState<number>();
	const [selectedSubject, setSelectedSubject] = useState<string>();
	const [subjectOptions, setSubjectOptions] = useState<any>();
	const [teacherOptions, setTeacherOptions] = useState<any>();
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

		const { response, error } = await APIManager.GET<PaginationGenericData<Question>>("/v1/api/questions", params);

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

	const handleClickEdit = (user: Question) => {};

	const handleClickRemove = async (id: number) => {
		const { response, error } = await APIManager.DELETE<UserProfile>(`/v1/api/questions/${id}`);

		if (APIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, `Xóa câu hỏi ${id} thành công!`);
			loadData();
		}
	};

	// const handleClickToggleStatus = async (username: string, status: Status) => {
	// 	const { response, error } = await APIManager.PATCH<UserProfile>(
	// 		`/v1/api/users/${username}/${status !== Status.ACTIVE ? "activate" : "deactivate"}`
	// 	);
	// 	if (APIManager.isSucceed(response)) {
	// 		callToast(
	// 			ToastType.SUCCESS,
	// 			(status === Status.ACTIVE ? "Hủy kích hoạt người dùng " : "Kích hoạt người dùng ") + username + " thành công!"
	// 		);
	// 		loadData();
	// 	}
	// };

	const handleChangePage = (page: number, pageSize: number) => {
		setCurrentPage(page);
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

	const resetPage = () => {
		setLimit(10);
		setCurrentPage(1);
	};

	const renderTableRowItem = (item: Question, index: number) => {
		return (
			<TableRow key={item.id}>
				<TableCell>{item.id}</TableCell>
				<TableCell>{item.content}</TableCell>
				<TableCell>
					<HoverShowAnswer content={item.content} answers={item.answers} />
				</TableCell>
				<TableCell>
					<TypeComponent type={item.type} />
				</TableCell>
				<TableCell>
					<LevelComponent level={item.level} />
				</TableCell>
				<TableCell>{item.chapter.chapterName}</TableCell>
				<TableCell>{item.subjectName}</TableCell>
				<TableCell>{item.teacher.firstName + " " + item.teacher.lastName}</TableCell>
				<TableCell align={"right"}>
					<ActionButtonsDropdown
						labelPrimary="câu hỏi"
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
				<h3 className="text-xl font-semibold text-blackOne">Quản lý câu hỏi</h3>
				<AddNewButton label="câu hỏi" onClick={() => navigate("/questions/add")} />
			</div>
			<div className="mb-5 flex flex-row items-center justify-between">
				<div className="search-filter">
					<TableSearch
						titleHelper="Tìm kiếm câu hỏi"
						helperTextList={helperTextList}
						search={search}
						onChangeText={text => handleChangeTextSearch(text)}
					/>
					<Select
						placeholder="Giảng viên"
						value={selectedTeacher}
						style={{ width: 250, height: 41, marginLeft: 10 }}
						onChange={value => handleChangeSelectTeacher(value)}
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
						// onClick={() => selectedTeacher(currentUser!.id)}
						className="h-[40px] px-5 py-2 rounded-lg text-white font-semibold ml-[10px] bg-primary"
					>
						Giảng viên soạn
					</button>
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
						<Table aria-label="Danh sách câu hỏi">
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
