import React, { useState } from "react";
import { Formik } from "formik";
import TextFieldInput from "@/components/TextFieldInput";
import { userSchema } from "@/interface/user";
import {
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	IconButton,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	TextField,
	Button,
	MenuItem
} from "@mui/material";
import { EyeOutline, EyeOffOutline } from "mdi-material-ui";
import { DatePicker, Select } from "antd";
import { useNavigate } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";
import TextFieldCustom from "@/components/TextFieldCustom";
import { Subject, subjectSchema } from "@/interface/subject";
import APIManager from "@/api/";
import callToast, { ToastType } from "@/common/callToast";

const creditHoursOptions = [
	{
		label: 1,
		value: 1
	},
	{
		label: 2,
		value: 2
	},
	{
		label: 3,
		value: 3
	},
	{
		label: 4,
		value: 4
	},
	{
		label: 5,
		value: 5
	}
];

export const EditOrUpdateSubject = () => {
	const [chapterList, setChapterList] = useState<string[]>([""]);
	const navigate = useNavigate();

	const handleSubmit = async (values: any) => {
		const data = {
			...values,
			chapterNames: chapterList
		};

		const { response, error } = await APIManager.POST<Subject>("/v1/api/subjects", data);
		if (APIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, "Cập nhật môn học thành công");
			navigate("/subjects");
		}
	};

	const renderChapterItem = (text: string, index: number) => {
		return (
			<div className="flex flex-row items-end" key={index}>
				<TextFieldCustom
					label={`Chương ${index + 1}`}
					text={chapterList[index]}
					onChange={text => {
						chapterList[index] = text;
						setChapterList(chapterList.slice());
					}}
				/>
				<button
					onClick={() => {
						chapterList.splice(index, 1);
						setChapterList(chapterList.slice());
					}}
					className="px-3 py-2.5 border-levelEasy border-solid border-[1px] w-36 rounded-md text-levelEasy hover:bg-levelEasy hover:text-white font-medium"
				>
					Xóa
				</button>
			</div>
		);
	};

	return (
		<Formik
			initialValues={{
				subjectId: "",
				subjectName: "",
				creditHours: 1
			}}
			validationSchema={subjectSchema}
			onSubmit={values => {
				// same shape as initial values
				console.log(values);
			}}
		>
			{({ errors, values, setFieldValue }) => (
				<div className="flex flex-col items-center min-w-[550px] h-full bg-cover shadow-2xl bg-login-bg bg-center max-h-full overflow-auto pb-10">
					<div className="my-14 flex flex-row w-[800px] justify-center items-center relative">
						<button
							className="p-3 hover:bg-levelHard bg-primary rounded-md absolute left-0"
							onClick={() => navigate("/subjects")}
						>
							<SvgIcon name="left-arrow" size={20} color="#ffffff" />
						</button>
						<h2 className="text-2xl font-semibold">Thêm môn học</h2>

						<Button
							size="large"
							variant="contained"
							sx={{
								position: "absolute",
								right: 0,
								bottom: 0,
								paddingX: 0,
								paddingY: 0.5,
								marginX: "auto",
								borderRadius: 2,
								backgroundColor: "rgb(116, 185, 255)",
								width: "20%"
							}}
							onClick={() => handleSubmit(values)}
						>
							Thêm
						</Button>
					</div>
					<>
						<div className="grid grid-cols-2 gap-8 gap-y-3 w-[800px]">
							<TextFieldCustom
								label="Mã môn học *"
								text={values.subjectId}
								errorMessage={errors.subjectId}
								onChange={text => setFieldValue("subjectId", text)}
							/>
							<TextFieldCustom
								label="Tên môn học *"
								text={values.subjectName}
								errorMessage={errors.subjectName}
								onChange={text => setFieldValue("subjectName", text)}
							/>
							<div>
								<label htmlFor="lastName" className="block text-sm font-medium text-[#111827] mb-2">
									Độ khó *
								</label>
								<Select
									value={values.creditHours}
									style={{ width: 364, height: 41.5, backgroundColor: "#F9FAFB" }}
									onChange={value => setFieldValue("creditHours", value)}
									options={creditHoursOptions}
								/>
							</div>
						</div>
						<h4 className="text-secondary font-medium text-lg text-[20px] mt-10">Danh sách chương</h4>
						<div className="grid grid-cols-2 gap-8 gap-y-6 w-[800px] mt-5">
							{chapterList.map((value, index) => renderChapterItem(value, index))}
							<div className="flex items-end">
								<button
									onClick={() => {
										chapterList.push("");
										setChapterList(chapterList.slice());
									}}
									className="px-3 py-2 ml-0 border-teacher border-solid border-[1px] w-36 h-[43px] rounded-md text-teacher hover:bg-teacher hover:text-white font-medium"
								>
									Thêm chương
								</button>
							</div>
						</div>
					</>
				</div>
			)}
		</Formik>
	);
};

export default EditOrUpdateSubject;
