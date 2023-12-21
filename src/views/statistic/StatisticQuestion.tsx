import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Divider } from "@mui/material";
import APIManager from "@/api/";
import { TotalQuestionOfSubject } from "@/interface/statistic";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top"
		}
	},
	scales: {
		x: {
			stacked: true
		},
		y: {
			stacked: true
		}
	}
};

export const StatisticQuestion = () => {
	const [data, setData] = useState<any>(undefined);

	const loadData = async () => {
		const { response, error } = await APIManager.GET<TotalQuestionOfSubject[]>("/v1/api/statistics/totalQuestion");
		console.log(response);
		if (APIManager.isSucceed(response)) {
			let labels = response!.data!.map(value => value.subjectName);
			let datasets = [
				{
					label: "Số câu hỏi",
					backgroundColor: "#ff7675",
					data: response!.data!.map(value => value.numberOfQuestion)
				}
			];
			setData({ labels, datasets });
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	return (
		<div className="mt-4 p-3">
			<h2 className="text-center text-primary font-semibold text-2xl mb-5">Thống kê câu hỏi</h2>
			<div className="flex flex-col col-span-full sm:col-span-6 shadow-lg rounded-md border border-slate-200 w-1/2 p-2 bg-[#ecf0f1]">
				<header className="px-5 py-4 border-b border-slate-100 flex items-center justify-center">
					<h2 className="font-semibold text-secondary text-lg">Thống kê số câu hỏi còn sử dụng theo môn học</h2>
				</header>
				{data && <Bar options={options} data={data} />}
			</div>
		</div>
	);
};

export default StatisticQuestion;
