import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import TextFieldInput from "@/components/TextFieldInput";
import { userSchema } from "@/interface/user";
import { Button } from "@mui/material";
import { EyeOutline, EyeOffOutline } from "mdi-material-ui";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";
import TextFieldCustom from "@/components/TextFieldCustom";
import { Answer, Correct, Level, Question, Type } from "@/interface/question";
import { LIST_CHAR } from "@/utils/textUtils";
import APIManager from "@/api/";
import { PaginationGenericData } from "@/interface/table";
import { Chapter, Subject } from "@/interface/subject";
import callToast, { ToastType } from "@/common/callToast";

const typeOptions = [
	{
		value: Type.SINGLE,
		label: "Một câu hỏi"
	},
	{
		value: Type.MULTIPLE,
		label: "Nhiều câu hỏi"
	}
];

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

export const EditOrUpdateQuestion = () => {
	const [subjectOptions, setSubjectOptions] = useState<any>([]);
	const [chapterOptions, setChapterOptions] = useState<any>([]);
	const [selectedSubject, setSelectedSubject] = useState<string>("");
	const [answerList, setAnswerList] = useState<Answer[]>([{ content: "", isCorrect: Correct.FALSE }]);
	const [questionMultiple, setQuestionMultiple] = useState<boolean>(false);
	const navigate = useNavigate();

	const loadSubjectHaveChapterData = async () => {
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

	const loadChapterBySubject = async (id: string) => {
		APIManager.setShowLoading(false);
		const { response, error } = await APIManager.GET<Chapter[]>(`/v1/api/subjects/${id}/chapters`);

		if (APIManager.isSucceed(response)) {
			const options = response!.data!.map(chapter => {
				return {
					label: "Chương " + chapter.chapterNumber + ": " + chapter.chapterName,
					value: chapter.id
				};
			});

			setChapterOptions(options);
		}
		APIManager.setShowLoading(true);
	};

	const isAnswersValid = () => {
		let numberQuestionRight = 0;
		for (let i = 0; i < answerList.length; i++) {
			if (answerList[i].isCorrect == Correct.TRUE) numberQuestionRight++;
		}

		if (
			(numberQuestionRight === 1 && !questionMultiple) ||
			(numberQuestionRight > 1 && questionMultiple && numberQuestionRight < answerList.length)
		)
			return true;

		return false;
	};

	const handleSubmit = async (data: any) => {
		if (!isAnswersValid()) {
			callToast(
				ToastType.ERROR,
				questionMultiple ? "Đáp án đúng cần nhiều hơn 1 đáp án và ít nhất 1 đáp án sai!" : "Chỉ cần 1 đáp án dúng!"
			);
			return;
		}

		data = {
			answers: answerList,
			...data
		};

		const { response, error } = await APIManager.POST<Question>("/v1/api/questions", data);

		if (APIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, "Thêm câu hỏi thành công!");
			navigate("/questions");
		}
	};

	useEffect(() => {
		loadSubjectHaveChapterData();
	}, []);

	const renderChapterItem = (answer: Answer, index: number) => {
		return (
			<div className="flex flex-row items-end" key={index}>
				<TextFieldCustom
					textarea={true}
					rows={2}
					label={`${LIST_CHAR[index]}`}
					text={answer.content}
					onChange={text => {
						answerList[index].content = text;
						setAnswerList(answerList.slice());
					}}
				/>
				<div className="flex flex-col justify-between h-full">
					<button
						onClick={() => {
							answerList[index].isCorrect = answerList[index].isCorrect == Correct.TRUE ? Correct.FALSE : Correct.TRUE;
							setAnswerList(answerList.slice());
						}}
						className={`${
							answer.isCorrect === Correct.TRUE ? "bg-[#487eb0] text-white" : " text-[#487eb0]"
						} px-1.5 font-medium text-sm  text-[0.9rem] py-2 border-[#487eb0] border-solid border-[1px] w-36 rounded-md hover:bg-[#487eb0] hover:text-white`}
					>
						Đáp án
					</button>
					<button
						onClick={() => {
							answerList.splice(index, 1);
							setAnswerList([...answerList]);
						}}
						className="px-1.5 py-2 font-medium text-sm  text-[0.9rem] border-levelEasy border-solid border-[1px] w-36 rounded-md text-levelEasy hover:bg-levelEasy hover:text-white"
					>
						Xóa
					</button>
				</div>
			</div>
		);
	};

	return (
		<Formik
			initialValues={{
				chapterId: "",
				content: "",
				type: Type.SINGLE,
				level: Level.EASY
			}}
			validationSchema={userSchema}
			onSubmit={values => {
				console.log(values);
			}}
		>
			{({ errors, values, setFieldValue }) => (
				<div className="flex flex-col items-center min-w-[550px] h-full bg-cover shadow-2xl bg-login-bg bg-center max-h-full overflow-auto pb-10">
					<div className="mt-7 mb-10 flex flex-row w-[800px] justify-center items-center relative">
						<button
							className="p-3 hover:bg-[#0097e6] bg-primary rounded-md absolute left-0"
							onClick={() => navigate("/questions")}
						>
							<SvgIcon name="arrow-left-bold" size={17} color="#ffffff" />
						</button>
						<h2 className="font-bold text-2xl">Tạo câu hỏi</h2>

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
							Thêm câu hỏi
						</Button>
					</div>
					<>
						<div className="w-[800px] flex justify-center items-center">
							<TextFieldCustom
								textarea={true}
								rows={4}
								label="Nội dung *"
								text={values.content}
								onChange={text => setFieldValue("content", text)}
							/>
						</div>
						<h4 className="text-secondary font-medium text-xl text-[20px] mt-5">Danh sách câu hỏi</h4>
						<div className="grid grid-cols-2 gap-8 gap-y-6 w-[800px] mt-5">
							{answerList.map((value, index) => renderChapterItem(value, index))}
							<div className="flex items-end">
								<button
									onClick={() => {
										answerList.push({ content: "", isCorrect: Correct.FALSE });
										setAnswerList(answerList.slice());
									}}
									className="px-3 py-2 ml-0 border-teacher border-solid border-[1px] w-36 h-[43px] rounded-md text-teacher hover:bg-teacher hover:text-white text-sm font-medium"
								>
									Thêm đáp án
								</button>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-8 gap-y-6 w-[800px] mt-10">
							<div>
								<label className="block text-sm font-medium text-[#111827] undefined undefined mb-2">Loại câu hỏi *</label>
								<Select
									value={values.type}
									style={{ width: "100%", height: 45, backgroundColor: "#F9FAFB" }}
									onChange={value => {
										setQuestionMultiple(!questionMultiple);
										setFieldValue("type", value);
									}}
									options={typeOptions}
								/>
							</div>

							<div>
								<label htmlFor="lastName" className="block text-sm font-medium text-[#111827] undefined undefined mb-2">
									Độ khó *
								</label>
								<Select
									value={values.level}
									style={{ width: "100%", height: 45, backgroundColor: "#F9FAFB" }}
									onChange={value => setFieldValue("level", value)}
									options={levelOptions}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-[#111827] undefined undefined mb-2">Môn học *</label>
								<Select
									value={selectedSubject}
									placeholder="Môn học"
									style={{ width: "100%", height: 45, backgroundColor: "#F9FAFB" }}
									onChange={value => {
										loadChapterBySubject(value);
										setFieldValue("chapterId", "");
										setSelectedSubject(value);
									}}
									options={subjectOptions}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-[#111827] undefined undefined mb-2">Chương *</label>
								<Select
									value={values.chapterId}
									placeholder="Chương"
									style={{ width: "100%", height: 45, backgroundColor: "#F9FAFB" }}
									onChange={value => setFieldValue("chapterId", value)}
									options={chapterOptions}
								/>
							</div>
						</div>
					</>
				</div>
			)}
		</Formik>
	);
};

export default EditOrUpdateQuestion;
