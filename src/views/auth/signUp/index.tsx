import React, { useState, forwardRef } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import {
	Typography,
	Card,
	CardContent,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormControlLabel,
	FormLabel,
	RadioGroup,
	Radio,
	Button,
	OutlinedInput,
	InputAdornment,
	IconButton
} from "@mui/material";
import { Formik } from "formik";
import { EyeOutline, EyeOffOutline } from "mdi-material-ui";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import callToast, { ToastType } from "@/common/callToast";
import logo from "../../../assets/images/logo.svg";
import { Gender, Role, userSchema } from "@/interface/user";
import TextFieldInput from "@/components/TextFieldInput";
import APIManager from "@/api/";

const SignUpView = () => {
	const navigate = useNavigate();
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [touchedPassword, setTouchedPassword] = useState<boolean>(false);
	const [errorConfirmPassword, setErrorConfirmPassword] = useState<boolean>(true);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleChangePasswordConfirm = (text: string, password: string) => {
		setConfirmPassword(text);
		if (text.indexOf(password) !== -1) {
			setErrorConfirmPassword(true);
		} else {
			setErrorConfirmPassword(false);
		}
	};

	const handleSubmit = async (data: any) => {
		const { response, error } = await APIManager.POST("/v1/api/auth/signUp", data);

		if (APIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, "Đăng ký tài khoản thành công");
			navigate("/login")
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
				dateOfBirth: dayjs("2000-01-01", "YYYY-MM-DD").unix(),
				address: "",
				role: Role.ROLE_STUDENT
			}}
			validationSchema={userSchema}
			onSubmit={values => {
				// same shape as initial values
				console.log(values);
			}}
		>
			{({ errors, values, setFieldValue, isValid }) => (
				<div className="relative min-w-[550px] h-full min-h-[500px] bg-cover shadow-2xl bg-login-bg bg-center max-h-full overflow-auto">
					<div className="box-border flex items-center justify-center w-[70%] rounded-xl my-6 mx-auto">
						<Box className="w-full shadow-xl mx-8 pt-10 px-11 pb-6 rounded-xl bg-white">
							<div className="mb-5 flex flex-row justify-center items-center">
								<img className="flex justify-center items-center w-20 h-20 object-cover" src={logo} alt="logo" />
								<h1 className="text-4xl uppercase ml-3 font-bold text-primary">Clover</h1>
							</div>
							<Box sx={{ mb: 6 }}>
								<Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 1.5, color: "rgb(250, 177, 160)" }}>
									Bạn chưa có tài khoản ?
								</Typography>
								<Typography sx={{ color: "rgb(131, 149, 167)" }} variant="body1">
									Hãy tạo 1 tài khoản cho bạn !
								</Typography>
							</Box>
							<div className="grid grid-cols-2 gap-8 gap-y-7 ">
								<>
									<TextFieldInput
										label="Tên tài khoản"
										errorMessage={errors.username}
										text={values.username}
										onChange={text => setFieldValue("username", text)}
									/>
									<FormControl fullWidth>
										<InputLabel htmlFor="auth-login-password">Mật khẩu</InputLabel>
										<OutlinedInput
											label="Mật khẩu"
											value={values.password}
											id="auth-login-password"
											onChange={e => {
												setFieldValue("password", e.target.value);
												setTouchedPassword(true);
											}}
											color={errors.password ? "error" : "primary"}
											type={showPassword ? "text" : "password"}
											endAdornment={
												<InputAdornment position="end">
													<IconButton edge="end" onClick={handleClickShowPassword} aria-label="toggle password visibility">
														{showPassword ? <EyeOutline /> : <EyeOffOutline />}
													</IconButton>
												</InputAdornment>
											}
										/>
										{errors.password && touchedPassword ? <p className="text-[#FF3333] text-sm mt-2">{errors.password}</p> : null}
									</FormControl>
									<FormControl fullWidth>
										<InputLabel htmlFor="auth-login-password">Xác nhận mật khẩu</InputLabel>
										<OutlinedInput
											label="Xác nhận mật khẩu"
											value={confirmPassword}
											id="auth-login-password"
											onChange={e => handleChangePasswordConfirm(e.target.value, values.password)}
											type={showPassword ? "text" : "password"}
											endAdornment={
												<InputAdornment position="end">
													<IconButton edge="end" onClick={handleClickShowPassword} aria-label="toggle password visibility">
														{showPassword ? <EyeOutline /> : <EyeOffOutline />}
													</IconButton>
												</InputAdornment>
											}
										/>
										{!errorConfirmPassword ? (
											<p className="text-[#FF3333] text-sm mt-2">Mật khẩu xác nhận không khớp với mật khẩu</p>
										) : null}
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
										<RadioGroup row defaultValue="male" aria-label="gender" name="account-settings-info-radio">
											<FormControlLabel value="male" label="Nam" control={<Radio />} />
											<FormControlLabel value="female" label="Nữ" control={<Radio />} />
										</RadioGroup>
									</FormControl>
									<DatePicker
										value={dayjs.unix(values.dateOfBirth)}
										onChange={value => setFieldValue("dateOfBirth", dayjs(value).unix())}
										placeholder={"Ngày sinh"}
									/>
									<TextField fullWidth id="address" label="Địa chỉ" />

									<FormControl fullWidth>
										<InputLabel>Vai trò</InputLabel>
										<Select label="Role" value={values.role} onChange={e => setFieldValue("role", e.target.value)}>
											<MenuItem value={Role.ROLE_TEACHER}>Giảng viên</MenuItem>
											<MenuItem value={Role.ROLE_STUDENT}>Sinh viên</MenuItem>
										</Select>
									</FormControl>
								</>
							</div>
							<div className="flex flex-col items-center">
								<Button
									size="large"
									variant="contained"
									onClick={() => handleSubmit(values)}
									sx={{
										paddingX: 2,
										paddingY: 1.5,
										marginY: 4,
										borderRadius: 3,
										backgroundColor: "rgb(116, 185, 255)",
										width: "40%"
									}}
									disabled={!errorConfirmPassword || !isValid}
								>
									Đăng ký tài khoản
								</Button>
								<Typography
									variant="body1"
									sx={{ display: "flex", justifyContent: "center", alignItems: "center", color: "rgb(131, 149, 167)" }}
								>
									Bạn đã có tài khoản ?
									<button className="font-bold p-0 text-primary ml-2" onClick={() => navigate("/login")}>
										Đăng nhập
									</button>
								</Typography>
							</div>
						</Box>
					</div>
				</div>
			)}
		</Formik>
	);
};

export default SignUpView;
