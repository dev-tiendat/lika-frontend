import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import dayjs from "dayjs";
ChartJS.register(ArcElement, Tooltip, Legend);

const TestResult = () => {
	const { state } = useLocation();
	const { data } = state;
	const navigate = useNavigate();
	const currentDate = dayjs(new Date()).valueOf();
	const dataChart = {
		labels: ["Câu hỏi đúng", "Câu hỏi sai"],
		datasets: [
			{
				data: [data.numberOfRightAnswer, data.numberOfQuestions - data.numberOfRightAnswer],
				backgroundColor: ["rgb(195,233,151)", "rgb(236,107,109)"],
				hoverBackgroundColor: ["#36A2EB", "#FFCE56"]
			}
		],

		plugins: {
			labels: {
				render: "percentage",
				fontColor: ["green", "white", "red"],
				precision: 2
			}
		},
		text: "23%"
	};

	console.log(data);
	return (
		<div className="relative flex justify-center items-center min-w-[550px] h-full min-h-[500px] bg-cover bg-login-bg bg-center">
			<div className="w-[50%] rounded-md shadow-md bg-white p-5">
				<h1 className="text-2xl font-bold text-center text-secondary">{data.examName}</h1>
				<p className="text-xl font-semibold ml-10 mt-5 text-textSecond">Kết quả thi của bạn là :</p>
				<p className="font-bold text-4xl mt-4 text-center text-[#badc58]">{data.grade} điểm</p>
				<div className="w-[100%] h-[1.5px] mt-4 bg-[#F3F3F3] mx-auto" />
				<div className="max-h-80 max-w-[320px] mx-auto my-6">
					<Doughnut data={dataChart} />
				</div>

				<div className="flex flex-row justify-center items-center">
					{/* {
						currentDate > data.
					}
					<button className="bg-primary px-5 py-3 text-white font-semibold rounded-md mr-5">Xem chi tiết bài thi</button> */}
					<button onClick={() => navigate("/home")} className="bg-secondary px-5 py-3 text-white font-semibold rounded-md">Trở về trang chủ</button>
				</div>
			</div>
		</div>
	);
};

export default TestResult;
