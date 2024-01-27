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
import { Schedule, StudentSchedule } from "@/interface/schedule";

const tableHeaderList: TableHeader[] = [
	{
		title: "STT"
	},
	{
		title: "Tên lịch thi"
	},
	{
		title: "Môn thi"
	},
	{
		title: "Giờ thi"
	},
	{
		title: "Ngày thi"
	},
	{
		title: "Thời gian làm bài"
	},
	{
		title: "Trạng thái"
	}
];

const DATE_FORMAT = "DD/MM/YYYY";

export const ScheduleView = () => {
	const [data, setData] = useState<StudentSchedule[] | undefined>(undefined);
	const navigate = useNavigate();
	const currentDate = dayjs(new Date()).valueOf();

	const loadData = useCallback(async () => {
		const { response, error } = await APIManager.GET<StudentSchedule[]>("/v1/api/examSchedule/me");

		if (APIManager.isSucceed(response)) {
			setData(response!.data);
		}

		APIManager.setShowLoading(true);
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const convertDate = (time: number, format?: string) => dayjs(time).format(format || DATE_FORMAT);

	const renderTableRowItem = (item: StudentSchedule, index: number) => {
		return (
			<TableRow key={item.id}>
				<TableCell>{index + 1}</TableCell>
				<TableCell>{item.examScheduleName}</TableCell>
				<TableCell>{item.subjectName}</TableCell>
				<TableCell>{convertDate(item.publishedAt, "hh:mm")}</TableCell>
				<TableCell>{convertDate(item.publishedAt)}</TableCell>
				<TableCell>{item.timeAllowance} phút</TableCell>
				<TableCell>
					<div
						className={`px-9 py-2 rounded-md inline-block text-white font-normal`}
						style={{
							backgroundColor: currentDate < item.publishedAt ? "#f6e58d" : currentDate > item.closedAt ? "#95afc0" : "#ff7979"
						}}
					>
						{currentDate < item.publishedAt ? "Chưa thi" : currentDate > item.closedAt ? "Đã thi" : "Đang thi"}
					</div>
				</TableCell>
			</TableRow>
		);
	};

	return (
		<div className="card min-h-full "> 
			<div className="flex flex-row justify-between items-center mb-10">
				<h3 className="text-2xl font-semibold text-center w-full text-secondary text-blackOne">Lịch thi của sinh viên</h3>
			</div>
			{data?.length !== 0 ? (
				<>
					<TableContainer component={Paper}>
						<Table aria-label="Lịch thi">
							<TableHead sx={{ backgroundColor: "#F5F5F5" }}>
								<TableRow>
									{tableHeaderList.map((item, index) => (
										<TableHeaderItem item={item} key={item.sortKey} />
									))}
								</TableRow>
							</TableHead>
							<TableBody>{data?.map((item, index) => renderTableRowItem(item, index))}</TableBody>
						</Table>
					</TableContainer>
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
