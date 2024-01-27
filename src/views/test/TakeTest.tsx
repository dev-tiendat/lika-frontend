import global from "@/store/global";
import { useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import APIManager from "@/api";
import { StudentSchedule } from "@/interface/schedule";
import dayjs from "dayjs";
import Countdown from "react-countdown";

const currentTime = dayjs(new Date());

const DATE_FORMAT = "DD/MM/YYYY";

export const TakeTest = () => {
	const currentUser = useAppSelector(global.selectors.selectUserProfile);
	const [data, setData] = useState<StudentSchedule[] | undefined>(undefined);
	const [scheduleOptions, setScheduleOptions] = useState<any>();
	const [selectedSchedule, setSelectedSchedule] = useState<StudentSchedule>();
	const currentDate = dayjs(new Date()).valueOf();
	const navigate = useNavigate();
	const [enableTest, setEnableTest] = useState<boolean>(false);

	const loadData = useCallback(async () => {
		const { response, error } = await APIManager.GET<StudentSchedule[]>("/v1/api/examSchedule/me");

		if (APIManager.isSucceed(response)) {
			const schedule = response?.data?.filter(value => value.closedAt > currentDate);
			setData(schedule);
			const options = schedule?.map(schedule => {
				return {
					label: schedule.subjectName + " - " + schedule.examScheduleName,
					value: schedule.id
				};
			});

			setScheduleOptions(options);
		}

		APIManager.setShowLoading(true);
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const convertDate = (time: number, format?: string) => dayjs(time).format(format || DATE_FORMAT);

	return (
		<div
			style={{ backgroundImage: "radial-gradient(rgb(253, 230, 138), rgb(124, 58, 237), rgb(12, 74, 110))" }}
			className="w-full h-full flex flex-col justify-center items-center"
		>
			<div className="w-[450px] p-8">
				<div className="flex w-full py-7 px-4 bg-white rounded-lg flex-row justify-center items-center shadow-md">
					<p className="text-sm text-[16px] text-textSecond">
						Họ và tên : {currentUser?.fullName} <br /> <br /> Tên tài khoản: {currentUser?.username}
					</p>
				</div>
				{data && data.length > 0 ? (
					<>
						<div>
							<Select
								placeholder="Chọn lịch thi"
								value={selectedSchedule?.id}
								style={{ width: "100%", height: 50, marginTop: 15 }}
								onChange={value => {
									setEnableTest(false);
									const schedule = data.filter(schedule => schedule.id == value)[0];
									if (schedule.publishedAt < currentDate) setEnableTest(true);
									setSelectedSchedule(schedule);
								}}
								allowClear
								options={scheduleOptions}
							/>
						</div>

						{selectedSchedule && (
							<>
								<div className="flex w-full py-4 px-5 font-normal mt-[15px] bg-white rounded-lg flex-col  shadow-md">
									<p className="text-center mb-3 font-semibold">Thông tin môn thi</p>
									<p className="text-sm text-[16px] text-textSecond">
										Tên kỳ thi : {selectedSchedule.examScheduleName}
										<br />
										<br />
										Tên môn thi : {selectedSchedule.subjectName}
										<br />
										<br />
										Thời gian làm bài : {selectedSchedule.timeAllowance} phút
										<br />
										<br />
										Ngày thi : {convertDate(selectedSchedule.publishedAt)}
										<br />
										<br />
										Giờ thi : {convertDate(selectedSchedule.publishedAt, "hh:mm")}
									</p>
								</div>
								<Button
									fullWidth
									size="medium"
									disabled={!enableTest}
									variant="contained"
									sx={{ paddingX: 2, paddingY: 1.5, marginY: 2, borderRadius: 3, backgroundColor: "#74B9FF" }}
									onClick={() => navigate(`/test/${selectedSchedule.id}`)}
								>
									{selectedSchedule.publishedAt > currentDate ? (
										<>
											Môn thi sẽ bắt đầu sau
											<Countdown date={selectedSchedule.publishedAt} onComplete={() => setEnableTest(true)} className="ml-1" />
										</>
									) : (
										<p>Vào phòng thi</p>
									)}
								</Button>
							</>
						)}
					</>
				) : (
					<p className="mt-3 text-center text-white text-base font-medium py-3 px- 4 bg-primary rounded-lg">
						Hiện tại đang không có môn thi nào
					</p>
				)}
				<Button
					fullWidth
					size="medium"
					variant="contained"
					sx={{ paddingX: 2, paddingY: 1.5, marginY: 2, borderRadius: 3, backgroundColor: "#feca57" }}
					onClick={() => navigate("/home")}
				>
					Trở về trang chủ
				</Button>
			</div>
		</div>
	);
};

export default TakeTest;
