import React, { useState } from "react";
import { Formik } from "formik";
import TextFieldInput from "@/components/TextFieldInput";
import { Gender, Role, userSchema } from "@/interface/user";
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
	Select,
	MenuItem,
	SelectChangeEvent
} from "@mui/material";
import { EyeOutline, EyeOffOutline } from "mdi-material-ui";
import { DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";
import APIManager from "@/api/";
import callToast, { ToastType } from "@/common/callToast";
import dayjs from "dayjs";

export const EditOrUpdateUserProfile = () => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [touchedPassword, setTouchedPassword] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleSubmit = async (data: any) => {
		const { response, error } = await APIManager.POST("/v1/api/users", data);

		if (APIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, "Thêm người dùng thành công");
			navigate("/users");
		}
	};

	return (
		<Formik
			initialValues={{
				username: "",
				password: "",
				email: "",
				firstName: "",
				lastName: "",
				gender: Gender.MAlE,
				dateOfBirth: undefined,
				address: "",
				roles: []
			}}
			validationSchema={userSchema}
			onSubmit={values => {
				// same shape as initial values
				console.log(values);
			}}
		>
			{({ errors, values, setFieldValue, isValid }) => (
				<div className="flex flex-col items-center min-w-[550px] h-full bg-cover shadow-2xl bg-login-bg bg-center max-h-full overflow-auto">
					<div className="my-14 flex flex-row w-[800px] justify-center items-center relative">
						<button className="p-3 hover:bg-levelHard bg-primary rounded-md absolute left-0" onClick={() => navigate("/users")}>
							<SvgIcon name="left-arrow" size={20} color="#ffffff" />
						</button>
						<h2 className="text-2xl font-semibold">Thêm người dùng</h2>
						<Button
							size="large"
							variant="contained"
							type="submit"
							disabled={!isValid}
							onClick={() => handleSubmit(values)}
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
						>
							Thêm
						</Button>
					</div>
					<div className="grid grid-cols-2 gap-8 gap-y-7 w-[800px]">
						<TextFieldInput
							label="Tên tài khoản"
							errorMessage={errors.username}
							text={values.username}
							onChange={text => setFieldValue("username", text)}
						/>
						<FormControl fullWidth>
							<InputLabel>Mật khẩu</InputLabel>
							<OutlinedInput
								label="Mật khẩu"
								value={values.password}
								onChange={e => {
									setFieldValue("password", e.target.value);
									setTouchedPassword(true);
								}}
								color={errors.password ? "error" : "primary"}
								type={showPassword ? "text" : "password"}
								endAdornment={
									<InputAdornment position="end">
										<IconButton edge="end" aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)}>
											{showPassword ? <EyeOutline /> : <EyeOffOutline />}
										</IconButton>
									</InputAdornment>
								}
							/>
							{errors.password && touchedPassword ? <p className="text-[#FF3333] text-sm mt-2">{errors.password}</p> : null}
						</FormControl>
						<TextFieldInput
							label="Email"
							errorMessage={errors.email}
							text={values.email}
							onChange={text => setFieldValue("email", text)}
						/>
						<TextFieldInput
							label="Họ"
							errorMessage={errors.firstName}
							text={values.firstName}
							onChange={text => setFieldValue("firstName", text)}
						/>
						<TextFieldInput
							label="Tên"
							errorMessage={errors.lastName}
							text={values.lastName}
							onChange={text => setFieldValue("lastName", text)}
						/>
						<FormControl>
							<FormLabel sx={{ fontSize: "0.875rem" }}>Giới tính</FormLabel>
							<RadioGroup
								row
								defaultValue="male"
								aria-label="gender"
								name="account-settings-info-radio"
								value={values.gender}
								onChange={event => setFieldValue("gender", event.target.value)}
							>
								<FormControlLabel value={Gender.MAlE} label="Nam" control={<Radio />} />
								<FormControlLabel value={Gender.FEMALE} label="Nữ" control={<Radio />} />
							</RadioGroup>
						</FormControl>
						<DatePicker
							placeholder={"Ngày sinh"}
							value={values.dateOfBirth}
							onChange={value => setFieldValue("dateOfBirth", value)}
						/>
						<TextField fullWidth id="address" label="Địa chỉ" />
						<FormControl fullWidth>
							<InputLabel>Vai trò</InputLabel>
							<Select
								label="Role"
								value={values.roles}
								onChange={e => {
									setFieldValue("roles", e.target.value);
									console.log(e.target.value);
								}}
								multiple
							>
								<MenuItem value={Role.ROLE_ADMIN}>Quản trị viên</MenuItem>
								<MenuItem value={Role.ROLE_TEACHER}>Giảng viên</MenuItem>
								<MenuItem value={Role.ROLE_STUDENT}>Học sinh</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>
			)}
		</Formik>
	);
};

export default EditOrUpdateUserProfile;
