import React, { useState, useEffect, useCallback } from "react";
import { Formik } from "formik";
import TextFieldInput from "@/components/TextFieldInput";
import { UserInfo, UserProfile, userSchema } from "@/interface/user";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { EyeOutline, EyeOffOutline } from "mdi-material-ui";
import { Select, DatePicker, Pagination } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";
import TableHeaderItem from "@/components/Table/TableHeaderItem";
import TextFieldCustom from "@/components/TextFieldCustom";
import { Answer, Correct, Level, Question, Type, questionSchema } from "@/interface/question";
import { LIST_CHAR } from "@/utils/textUtils";
import APIManager from "@/api/";
import { Order, PaginationGenericData, TableHeader } from "@/interface/table";
import { Chapter, Subject } from "@/interface/subject";
import callToast, { ToastType } from "@/common/callToast";
import { Criteria, ExamSet, examSetSchema } from "@/interface/examSet";
import dayjs from "dayjs";
import TableSearch from "@/components/Table/TableSearch";
import { scheduleSchema } from "@/interface/schedule";

const levelOptions = [
	{
		value: Level.EASY,
		label: "Dễ"
	},
	{
		value: Level.MEDIUM,
		label: "Trung bình"
	},
	{
		value: Level.HARD,
		label: "Khó"
	}
];

const numberOfExamOptions = [
	{
		value: 1,
		label: 1
	},
	{
		value: 2,
		label: 2
	},
	{
		value: 3,
		label: 3
	},
	{
		value: 4,
		label: 4
	},
	{
		value: 5,
		label: 5
	}
];

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
	}
];

const helperTextList = ["Họ và tên", "Mã người dùng"];

export const AddOrUpdateExamSet = () => {
	const { state } = useLocation();
	const [data, setData] = useState<UserProfile[] | undefined>(undefined);
	const [sortBy, setSortBy] = useState<string>(tableHeaderList[0].sortKey!);
	const [order, setOrder] = useState<Order>(Order.DESC);
	const [limit, setLimit] = useState<number>(10);
	const [totalElement, setTotalElement] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [search, setSearch] = useState<string>("");
	const [examSetOptions, setExamSetOptions] = useState<any>([]);
	const [teacherOptions, setTeacherOptions] = useState<any>();
	const [selectedStudentList, setSelectedStudentList] = useState<UserProfile[]>( state ? state.students : []);

	const navigate = useNavigate();

	const handleSubmit = async (data: any) => {
		data = {
			...data,
			studentsUsernames: selectedStudentList.map(student => student.username)
		};
		const { response, error } = !state
			? await APIManager.POST<ExamSet>(`/v1/api/examSchedule`, data)
			: await APIManager.PUT<Question>(`/v1/api/examSchedule/${state.id}`, data);
		if (APIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, state ? "Cập nhật lịch thi thành công!" : "Tạo lịch thi thành công!");
			navigate("/schedule");
		}
	};

	const loadData = useCallback(async () => {
		const params = {
			page: currentPage - 1,
			size: 7,
			order: order,
			sortBy: sortBy,
			query: search,
			status: 1,
			role: 3
		};

		const { response, error } = await APIManager.GET<PaginationGenericData<UserProfile>>("/v1/api/users", params);

		if (APIManager.isSucceed(response)) {
			setData(response!.data!.content);
			setTotalElement(response!.data!.totalElements);
		}

		APIManager.setShowLoading(true);
	}, [limit, currentPage, sortBy, order, search]);

	const loadExamSetData = useCallback(async () => {
		const params = {
			status: 1
		};

		const { response, error } = await APIManager.GET<PaginationGenericData<ExamSet>>("/v1/api/examSet", params);

		if (APIManager.isSucceed(response)) {
			const options = response!.data!.content.map(examSet => {
				return {
					label: examSet.name,
					value: examSet.id
				};
			});

			setExamSetOptions(options);
		}
	}, []);

	const loadTeacherOptions = async () => {
		const { response, error } = await APIManager.GET<PaginationGenericData<UserInfo>>("/v1/api/teachers");
		if (APIManager.isSucceed(response)) {
			const options = response!.data!.content.map(teacher => {
				return {
					label: teacher.username + " - " + teacher.firstName + " " + teacher.lastName,
					value: teacher.username
				};
			});

			setTeacherOptions(options);
		}
	};

	const handleChangePage = (page: number, pageSize: number) => {
		setCurrentPage(page);
		setLimit(pageSize);
		APIManager.setShowLoading(false);
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

	useEffect(() => {
		loadExamSetData();
		loadTeacherOptions();
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const checkStudentExists = (item: UserProfile) => {
		for (let i = 0; i < selectedStudentList.length; i++) {
			if (selectedStudentList[i].id == item.id) return true;
		}
		
		return false;
	};

	const renderTableRowItem = (item: UserProfile, index: number) => {
		return (
			<TableRow
				key={item.id}
				style={{ backgroundColor: checkStudentExists(item) ? "#b8e994" : "white", cursor: "pointer" }}
				onClick={() => {
					if (!checkStudentExists(item)) {
						selectedStudentList.push(item);
						setSelectedStudentList(selectedStudentList.slice());
					} else {
						setSelectedStudentList(selectedStudentList.filter(value => value.id != item.id));
					}
				}}
			>
				<TableCell style={{ color: checkStudentExists(item) ? "white" : "black" }}>{item.id}</TableCell>
				<TableCell style={{ color: checkStudentExists(item) ? "white" : "black" }}>
					<div className="flex flex-row relative items-center">
						<p>{item.username} </p>
					</div>
				</TableCell>
				<TableCell style={{ color: checkStudentExists(item) ? "white" : "black" }}>{item.firstName}</TableCell>
				<TableCell style={{ color: checkStudentExists(item) ? "white" : "black" }}>{item.lastName}</TableCell>
			</TableRow>
		);
	};

	return (
		<Formik
			initialValues={{
				title: state ? state.title : "",
				summary: state ? state.summary : "",
				examSetId: state ? state.examSet?.id : undefined,
				publishedAt: state ?  state.publishedAt/1000 : undefined,
				timeAllowance: state ? state.timeAllowance : 1,
				teacherUsername: state ? state.teacher?.username : undefined
			}}
			validationSchema={scheduleSchema}
			onSubmit={values => {}}
		>
			{({ errors, values, setFieldValue }) => (
				<div className="flex flex-col items-center min-w-[550px] h-full bg-cover shadow-2xl bg-login-bg bg-center max-h-full overflow-auto pb-10">
					<div className="mt-7 mb-10 flex flex-row w-[800px] justify-center items-center relative">
						<button
							className="p-3 hover:bg-[#0097e6] bg-primary rounded-md absolute left-0"
							onClick={() => navigate("/examSets")}
						>
							<SvgIcon name="arrow-left-bold" size={17} color="#ffffff" />
						</button>
						<h2 className="font-bold text-2xl">{state ? "Cập nhật lịch thi" : "Tạo lịch thi"}</h2>

						<Button
							size="large"
							variant="contained"
							onClick={() => handleSubmit(values)}
							sx={{
								position: "absolute",
								right: 0,
								bottom: 0,
								paddingX: 3,
								paddingY: 1,
								marginX: "auto",
								borderRadius: 2,
								backgroundColor: "rgb(116, 185, 255)"
							}}
						>
							{state ? "Cập nhật lịch thi" : "Tạo lịch thi"}
						</Button>
					</div>
					<>
						<div className="grid grid-cols-2 gap-8 gap-y-3 w-[800px]">
							<TextFieldCustom
								label="Tiêu đề lịch thi *"
								text={values.title}
								onChange={text => setFieldValue("title", text)}
								errorMessage={errors.title as string}
							/>
							<TextFieldCustom
								label="Mô tả *"
								text={values.summary}
								onChange={text => setFieldValue("summary", text)}
								errorMessage={errors.summary as string}
							/>
							<div>
								<label htmlFor="lastName" className="block text-sm font-medium text-[#111827] mb-2">
									Bộ đề thi *
								</label>
								<Select
									value={values.examSetId}
									style={{ width: 364, height: 41.5, backgroundColor: "#F9FAFB" }}
									onChange={value => setFieldValue("examSetId", value)}
									options={examSetOptions}
								/>
							</div>
							<div>
								<label htmlFor="lastName" className="block text-sm font-medium text-[#111827] mb-2">
									Giảng viên *
								</label>
								<Select
									value={values.teacherUsername}
									style={{ width: 364, height: 41.5, backgroundColor: "#F9FAFB" }}
									onChange={value => setFieldValue("teacherUsername", value)}
									options={teacherOptions}
								/>
							</div>
							<div>
								<label htmlFor="lastName" className="block text-sm font-medium text-[#111827] mb-2">
									Lịch thi *
								</label>
								<DatePicker
									format="DD//MM/YYYY - HH:mm"
									disabledDate={current => current < dayjs().startOf("day")}
									placeholder=""
									showTime
									showSecond={false}
									className="w-[364px] h-[41.5px]"
									value={values.publishedAt && dayjs.unix(values.publishedAt)}
									onChange={value => setFieldValue("publishedAt", dayjs(value).unix())}
								/>
							</div>
							<TextFieldCustom
								label="Thời gian thi *"
								text={values.timeAllowance.toString()}
								onChange={text => setFieldValue("timeAllowance", text)}
								errorMessage={errors.timeAllowance as string}
							/>
						</div>
						<h4 className="text-secondary font-medium text-xl text-[20px] mt-10">Danh sách sinh viên dự thi</h4>
						<div className="w-[800px] mt-10 flex flex-row justify-between">
							<div className="w-[260px]">
								<h3 className="text-textSecond text-center font-semibold text-lg mb-3">
									Danh sách đã chọn ({selectedStudentList.length})
								</h3>
								<div
									className={`w-full max-h-[450px] overflow-y-scroll no-scrollbar rounded-xl border-solid ${
										selectedStudentList.length !== 0 ? "border-[2px]" : undefined
									} border-primary bg-white`}
								>
									{selectedStudentList.length != 0 &&
										selectedStudentList.map((value, index) => (
											<div>
												<div className="p-2 text-sm text-textSecond flex flex-row items-center justify-between">
													<div className="flex flex-row items-center mr-1">
														<div className="mr-3 text-[#b8e994] bg-white border-solid border-[2px] border-teacher rounded-lg w-8 h-8 flex justify-center items-center">
															<p>{index + 1}</p>
														</div>
														<p className="inline">
															({value.username}) {value.firstName} {value.lastName}
														</p>
													</div>
													<button
														className="p-1 bg-levelEasy rounded-full"
														onClick={() => setSelectedStudentList(selectedStudentList.filter(item => value.id != item.id))}
													>
														<SvgIcon name="x" size={15} color="#ffffff" />
													</button>
												</div>
												<div className="w-[90%] h-[1.5px] bg-[#F3F3F3] mx-auto" />
											</div>
										))}
									{selectedStudentList.length == 0 && (
										<p className="py-3 px-3 rounded-lg border-secondary border-solid border-[2px] text-primary text-base text-center">
											Danh sách hiện đang trống
										</p>
									)}
								</div>
							</div>
							<div className="w-[3px] h-[100%] mt-4 bg-[#F3F3F3]" />
							<div className="w-[500px]">
								<TableSearch
									style={{ marginBottom: 20 }}
									titleHelper="Tìm kiếm người dùng"
									helperTextList={helperTextList}
									search={search}
									onChangeText={text => handleChangeTextSearch(text)}
								/>
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
																align={"left"}
															/>
														))}
													</TableRow>
												</TableHead>
												<TableBody>{data?.map((item, index) => renderTableRowItem(item, index))}</TableBody>
											</Table>
										</TableContainer>
										<div className="flex flex-row justify-end pt-5">
											<Pagination current={currentPage} onChange={handleChangePage} defaultCurrent={1} total={totalElement} />
										</div>
									</>
								) : (
									<div className="h-full flex justify-center items-center">
										<p className="py-3 px-3 rounded-lg border-admin border-solid border-[2px] text-primary text-base">
											Không tìm thấy sinh viên
										</p>
									</div>
								)}
							</div>
						</div>
					</>
				</div>
			)}
		</Formik>
	);
};

export default AddOrUpdateExamSet;
