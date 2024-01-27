import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import TextFieldInput from "@/components/TextFieldInput";
import { userSchema } from "@/interface/user";
import { Button } from "@mui/material";
import { EyeOutline, EyeOffOutline } from "mdi-material-ui";
import { Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";
import TextFieldCustom from "@/components/TextFieldCustom";
import { Answer, Correct, Level, Question, Type, questionSchema } from "@/interface/question";
import { LIST_CHAR } from "@/utils/textUtils";
import APIManager from "@/api/";
import { PaginationGenericData } from "@/interface/table";
import { Chapter, Subject } from "@/interface/subject";
import callToast, { ToastType } from "@/common/callToast";
import { Criteria, ExamSet, examSetSchema } from "@/interface/examSet";

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

export const AddOrUpdateExamSet = () => {
	const { state } = useLocation();
	const [subjectOptions, setSubjectOptions] = useState<any>([]);
	const [chapterOptions, setChapterOptions] = useState<any>([]);
	const [selectedSubject, setSelectedSubject] = useState<string>(state ? state.subject.id : "");
	const [criteriaList, setCriteriaList] = useState<any[]>(
		state
			? state.criteria.map((item: any) => {
					return {
						quantity: item.quantity,
						level: item.level,
						chapterId: item.chapter.id
					};
			  })
			: [{ chapterId: undefined, quantity: undefined, level: undefined }]
	);
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

	const handleSubmit = async (data: any) => {
		data = {
			criteria: criteriaList,
			subjectId: selectedSubject,
			...data
		};

		const { response, error } = !state
			? await APIManager.POST<ExamSet>(`/v1/api/examSet`, data)
			: await APIManager.PUT<Question>(`/v1/api/examSet/${state.id}`, data);

		if (APIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, state ? "Cập nhật câu hỏi thành công!" : "Thêm câu hỏi thành công!");
			navigate("/examSets");
		}
	};

	useEffect(() => {
		loadSubjectHaveChapterData();
		if (state) loadChapterBySubject(selectedSubject);
	}, []);

	const handleCriteriaChange = (field: string, value: any, index: number) => {
		criteriaList[index][field] = value;
		setCriteriaList(criteriaList.slice());
	};

	const renderCriteriaItem = (criteria: Criteria, index: number) => {
		return (
			<div className="flex flex-row justify-between items-center w-[800px] my-5" key={index}>
				<div>
					<label className="block text-sm font-medium text-[#111827] undefined undefined mb-2">Chương *</label>
					<Select
						value={criteria.chapterId}
						placeholder="Chương"
						style={{ width: 250, height: 45, backgroundColor: "#F9FAFB" }}
						onChange={value => handleCriteriaChange("chapterId", value, index)}
						options={chapterOptions}
					/>
				</div>
				<div>
					<label htmlFor="lastName" className="block text-sm font-medium text-[#111827] mb-2">
						Độ khó *
					</label>
					<Select
						value={criteria.level}
						style={{ width: 200, height: 45, backgroundColor: "#F9FAFB" }}
						onChange={value => handleCriteriaChange("level", value, index)}
						options={levelOptions}
					/>
				</div>
				<div>
					<label htmlFor="lastName" className="block text-sm font-medium text-[#111827] mb-2">
						Số lượng *
					</label>
					<Select
						value={criteria.quantity}
						style={{ width: 200, height: 41.5, backgroundColor: "#F9FAFB" }}
						onChange={value => handleCriteriaChange("quantity", value, index)}
						options={numberOfExamOptions}
					/>
				</div>
				<button
					onClick={() => {
						criteriaList.splice(index, 1);
						setCriteriaList([...criteriaList]);
					}}
					className="px-8 py-2.5 mb-0.5 font-medium text-sm self-end text-[0.9rem] border-levelEasy border-solid border-[1px] w-22 rounded-md text-levelEasy hover:bg-levelEasy hover:text-white bg-white"
				>
					Xóa
				</button>
			</div>
		);
	};

	return (
		<Formik
			initialValues={{
				name: state ? state.name : "",
				quantityOfExam: state ? state.exams.length : 1
			}}
			validationSchema={examSetSchema}
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
						<h2 className="font-bold text-2xl">{state ? "Cập nhật đề thi môn học" : "Tạo đề thi môn học"}</h2>

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
							{state ? "Cập nhật đề thi" : "Thêm đề thi"}
						</Button>
					</div>
					<>
						<div className="grid grid-cols-2 gap-8 gap-y-3 w-[800px]">
							<TextFieldCustom
								label="Tên bộ đề thi *"
								text={values.name}
								onChange={text => setFieldValue("name", text)}
								errorMessage={errors.name as string}
							/>
						</div>
						<div className="grid grid-cols-2 gap-8 gap-y-3 w-[800px] mt-3">
							<div>
								<label className="block text-sm font-medium text-[#111827] undefined undefined mb-2">Môn học *</label>
								<Select
									value={selectedSubject}
									placeholder="Môn học"
									style={{ width: "100%", height: 45, backgroundColor: "#F9FAFB" }}
									onChange={value => {
										loadChapterBySubject(value);
										setSelectedSubject(value);
										setFieldValue("chapterId", "");
										setCriteriaList([{ chapterId: undefined, quantity: undefined, level: undefined }]);
									}}
									options={subjectOptions}
								/>
							</div>
							<div>
								<label htmlFor="lastName" className="block text-sm font-medium text-[#111827] mb-2">
									Số lượng đề thi *
								</label>
								<Select
									value={values.quantityOfExam}
									style={{ width: 364, height: 41.5, backgroundColor: "#F9FAFB" }}
									onChange={value => setFieldValue("quantityOfExam", value)}
									options={numberOfExamOptions}
								/>
							</div>
						</div>
						<h4 className="text-secondary font-medium text-xl text-[20px] mt-5">Danh sách tiêu chí</h4>
						<div className="">
							{criteriaList.map((value, index) => renderCriteriaItem(value, index))}
							<div className="flex items-end">
								<button
									onClick={() => {
										criteriaList.push({ chapterId: undefined, quantity: undefined, level: undefined });
										setCriteriaList(criteriaList.slice());
									}}
									className="px-3 py-2 ml-0 border-teacher border-solid border-[1px] w-36 h-[43px] rounded-md text-teacher hover:bg-teacher hover:text-white text-sm font-medium bg-white"
								>
									Thêm tiêu chí
								</button>
							</div>
						</div>
					</>
				</div>
			)}
		</Formik>
	);
};

export default AddOrUpdateExamSet;
