import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
	IconButton,
	TextField,
	FormControl,
	OutlinedInput,
	InputLabel,
	InputAdornment,
	FormControlLabel,
	Link,
	Checkbox,
	Box,
	Button
} from "@mui/material";
import { EyeOutline, EyeOffOutline } from "mdi-material-ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import auth from "@/store/auth/";
import global from "@/store/global";
import callToast, { ToastType } from "@/common/callToast";
import NewAPIManager from "@/api/";
import { LoginResponse } from "@/interface/auth";

const LoginForm = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const account = useAppSelector(global.selectors.selectAccount);
	const [usernameOrEmail, setUsernameOrEmail] = useState<string>(account?.usernameOrEmail || "");
	const [password, setPassword] = useState<string>(account?.password || "");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isRememberMe, setIsRememberMe] = useState<boolean>(account ? true : false);

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setUsernameOrEmail(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setPassword(e.target.value);
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = async () => {
		const request = {
			usernameOrEmail,
			password
		};
		const { response, error } = await NewAPIManager.POST<LoginResponse>("/v1/api/auth/signIn", request);
		if (NewAPIManager.isSucceed(response)) {
			callToast(ToastType.SUCCESS, "Đăng nhập thành công !");
			const { token, ...userProfile } = response?.data!;
			dispatch(auth.actions.setToken(token));
			dispatch(global.actions.setUserProfile(userProfile));

			if (isRememberMe) dispatch(global.actions.setAccount(request));

			navigate("/home");
		}
	};

	return (
		<Box>
			<form noValidate autoComplete="off">
				<TextField
					value={usernameOrEmail}
					onChange={handleUsernameChange}
					autoFocus
					fullWidth
					label="Tên tài khoản"
					sx={{ marginBottom: 4 }}
				/>
				<FormControl fullWidth>
					<InputLabel htmlFor="auth-login-password">Mật khẩu</InputLabel>
					<OutlinedInput
						label="Password"
						value={password}
						id="auth-login-password"
						onChange={handlePasswordChange}
						type={showPassword ? "text" : "password"}
						endAdornment={
							<InputAdornment position="end">
								<IconButton edge="end" onClick={handleClickShowPassword} aria-label="toggle password visibility">
									{showPassword ? <EyeOutline /> : <EyeOffOutline />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
				<Box sx={{ marginY: 2, display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
					<FormControlLabel
						onChange={() => setIsRememberMe(!isRememberMe)}
						checked={isRememberMe}
						control={<Checkbox />}
						label="Ghi nhớ tài khoản"
					/>
				</Box>
				<Button
					fullWidth
					size="large"
					variant="contained"
					sx={{ paddingX: 2, paddingY: 1.5, marginBottom: 2, borderRadius: 3, backgroundColor: "rgb(116, 185, 255)" }}
					onClick={handleSubmit}
				>
					Đăng nhập
				</Button>
			</form>
		</Box>
	);
};

export default LoginForm;
