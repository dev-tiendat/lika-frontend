import React, { useState, useEffect, useCallback, useRef } from "react";
import APIManager from "@/api";
import { useParams } from "react-router-dom";
import { Test as ITest, SubmitTest } from "@/interface/test";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import "./style.css";
import TestInfo from "./TestInfo";
import type { RadioChangeEvent } from "antd";
import { Checkbox, Radio } from "antd";
import { Answer, Question, Type } from "@/interface/question";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import test from "@/store/test";
import { LIST_CHAR } from "@/utils/textUtils";
import Countdown from "react-countdown";

const DATE_FORMAT = "DD/MM/YYYY";

interface AnswerItemProps {
	answer: Answer;
	id: number;
	index: number;
}

const MultiAnswerItem: React.FC<AnswerItemProps> = ({ answer, id, index }) => {
	const selectedAnswers = useAppSelector(state => test.selectors.selectAnswers(state, id));
	const checked = selectedAnswers.includes(answer.id);
	const dispatch = useAppDispatch();

	const handleChangeAnswer = (answerId: number) => {
		if (!id) return;

		if (selectedAnswers.includes(answerId)) {
			dispatch(test.actions.removeAnswer({ id: Number(id), answerId: answerId }));
		} else {
			dispatch(test.actions.addAnswer({ id: Number(id), answerId: answerId }));
		}
	};

	return (
		<div className="flex flex-row items-start my-3 hover:font-medium hover:text-secondary cursor-pointer">
			<Checkbox value={answer.id} checked={checked} className="mt-[1.5px]" onChange={e => handleChangeAnswer(e.target.value)} />
			<p className="w-full text-base text-[15px] ml-3" onClick={() => handleChangeAnswer(answer.id)}>
				{LIST_CHAR[index]}. {answer.content}
			</p>
		</div>
	);
};

interface QuestionItemProps {
	question: Question;
	index: number;
	id: number;
	onLayout: (questionIndex: number, y: number) => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ question, index, id, onLayout }) => {
	const selectedAnswers = useAppSelector(state => test.selectors.selectAnswers(state, id));
	const dispatch = useAppDispatch();
	const ref = useRef<any>();

	const handleChangeAnswer = (answerId: number) => {
		if (!id) return;

		question.answers.forEach(answer => {
			if (selectedAnswers.includes(answer.id)) {
				dispatch(test.actions.removeAnswer({ id: id, answerId: answer.id }));
			}
		});

		dispatch(test.actions.addAnswer({ id: id, answerId: answerId }));
	};

	useEffect(() => {
		onLayout(index, ref.current.getBoundingClientRect().y);
	}, []);

	return (
		<div className="w-full mt-5" ref={ref}>
			<h6 className="font-semibold text-xl text-title">Câu {index} </h6>
			<p className="pt-3 text-questionText font-medium">{question.content}</p>
			{question.type == Type.MULTIPLE ? (
				<>
					{question.answers.map((answer, index) => (
						<MultiAnswerItem answer={answer} id={id} key={answer.id} index={index} />
					))}
				</>
			) : (
				<Radio.Group
					onChange={e => handleChangeAnswer(e.target.value)}
					value={question.answers.filter(answer => selectedAnswers.includes(answer.id)).pop()?.id}
					style={{ fontFamily: "roboto", color: "#000000", width: "100%" }}
				>
					{question.answers.map((answer, index) => (
						<div className="flex flex-row items-start my-3 hover:font-medium hover:text-secondary cursor-pointer">
							<Radio value={answer.id} className="mt-[1.5px] mr-0" />
							<p className="w-full text-base text-[15px] ml-3" onClick={() => handleChangeAnswer(answer.id)}>
								{LIST_CHAR[index]}. {answer.content}
							</p>
						</div>
					))}
				</Radio.Group>
			)}
			<div className="w-full h-[1.5px] mt-4 bg-[#F3F3F3] mx-auto" />
		</div>
	);
};

export const Test = () => {
	const [data, setData] = useState<ITest | undefined>(undefined);
	const { id } = useParams();
	const selectedAnswers = useAppSelector(state => test.selectors.selectAnswers(state, Number(id)));
	const positionYQuestions = useRef<Record<number, number>>({});
	const navigate = useNavigate();

	const loadData = useCallback(async () => {
		const { response, error } = await APIManager.GET<ITest>(`/v1/api/tests/examSchedule/${id}/takeExam`);

		if (APIManager.isSucceed(response)) {
			setData(response!.data);
		}
		//handle error response
	}, [id]);

	const handleLayoutQuestionItem = (questionIndex: number, y: number) => {
		positionYQuestions.current[questionIndex] = y;
	};

	useEffect(() => {
		loadData();
	}, []);

	const convertDate = (time: number, format?: string) => dayjs(time).format(format || DATE_FORMAT);

	const checkQuestionAnswered = (index: number) => {
		const questions = data?.questions;

		if (!questions) return;

		for (let i = 0; i < questions[index].answers.length; i++) {
			if (selectedAnswers.includes(questions[index].answers[i].id)) {
				return true;
			}
		}

		return false;
	};

	const handleSubmit = async () => {
		const { response, error } = await APIManager.POST<SubmitTest>(`/v1/api/tests/examSchedule/${id}/submitExam`, {
			answers: selectedAnswers
		});

		if (APIManager.isSucceed(response)) {
			navigate("/testResult", { state: { data: response?.data } });
		}
	};

	return (
		<div className="w-full min-h-full bg-[#F7F8F9] flex flex-row justify-center p-4">
			{data && (
				<div className="w-[80%] flex flex-row relative">
					<div className="w-[30%] h-fit bg-white rounded-md mr-4 sticky top-4 left-3 shadow-sm py-4">
						<div className="px-4">
							<div className="flex flex-row items-center justify-between">
								<h2 className="text-xl font-semibold">Danh sách câu hỏi</h2>
								<Countdown
									date={data.examInfo.closedAt}
									onComplete={handleSubmit}
									className="text-2xl font-semibold text-primary ml-2"
									daysInHours
								/>
							</div>
							<div className="w-full h-[1.5px] mt-4 bg-[#F3F3F3] mx-auto" />
							<div className="flex flex-row justify-evenly items-center my-3 text-blackOne">
								<div className="flex flex-row items-center">
									<div className="w-4 h-4 rounded-[4px] bg-[#DEE5EF] inline-block mr-2" />
									<span>Chưa trả lời</span>
								</div>
								<div className="flex flex-row items-center">
									<div className="w-4 h-4 rounded-[4px] bg-student inline-block mr-2" />
									<span>Đã trả lời</span>
								</div>
							</div>
							<span className="text-xs text-textSecond ml-3 font-light">Bấm vào ô để xem câu hỏi</span>
							<div className="w-[80%] h-[1.5px] my-3 bg-[#F3F3F3] mx-auto" />
						</div>

						<div className="grid grid-cols-5 gap-4 max-h-[300px] overflow-scroll custom-scrool px-4">
							{data.questions.map((value, index) => (
								<>
									<button
										className={`p-2 rounded-[3px] text-white hover:bg-secondary ${
											checkQuestionAnswered(index) ? "bg-student" : "bg-[#DEE5EF]"
										}`}
										onClick={() => window.scrollTo({ top: positionYQuestions.current[index + 1], behavior: "smooth" })}
									>
										{index + 1}
									</button>
								</>
							))}
						</div>
						<div className="flex justify-center items-center mt-2">
							<button onClick={handleSubmit} className="px-6 py-2 font-medium text-base bg-primary text-white rounded-md">
								Nộp bài
							</button>
						</div>
					</div>
					<div className="w-[70%] rounded-md bg-white shadow-sm p-4">
						<div className="">
							<h1 className="text-center mt-5 font-bold text-2xl">{data.examInfo.title}</h1>
							<div className="w-full flex flex-row justify-center items-center mt-3 text-textSecond">
								<p className="inline mr-7">Môn học: {data.examInfo.subjectName}</p>
								<p className="inline mr-7">Ngày thi: {convertDate(data.examInfo.publishedAt)}</p>
								<p className="inline">Thời gian làm bài: {data.examInfo.timeAllowance} phút</p>
							</div>
						</div>
						<div className="w-[80%] h-[1.5px] mt-4 bg-[#F3F3F3] mx-auto" />
						<p className="font-semibold text-lg text-center text-blackOne mt-5">Mã đề thi : {data.examInfo.examCode}</p>
						<div className="">
							{data.questions.map((question, index) => (
								<QuestionItem
									question={question}
									index={index + 1}
									key={question.id}
									id={Number(id)}
									onLayout={handleLayoutQuestionItem}
								/>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Test;
