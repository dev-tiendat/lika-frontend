import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { Typography, Card, CardContent } from "@mui/material";
import logoLeft from "@/assets/images/login_left.png";
import logo from "@/assets/images/logo.svg";
import LoginForm from "./components/LoginForm";

const LoginView = () => {
	const navigate = useNavigate();

	return (
		<div className="relative flex justify-center items-center min-w-[550px] h-full min-h-[500px] bg-cover bg-login-bg bg-center">
			<div className="box-border flex items-center justify-center w-[96%] h-[94%] pr-[4%] pb-5 overflow-hidden rounded-xl">
				<div className="w-[750px] hidden md:flex">
					<img className="w-full h-full" src={logoLeft} alt="login" />
				</div>
				<Box className="shadow-xl ml-8 pt-10 px-11 pb-6 rounded-xl bg-white">
					<div className="mb-10 flex flex-row justify-center items-center">
						<img className="flex justify-center items-center w-20 h-20 object-cover" src={logo} alt="logo" />
						<h1 className="text-4xl uppercase ml-3 font-bold text-primary">Clover</h1>
					</div>
					<Box sx={{ mb: 6 }}>
						<Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 1.5, color: "rgb(250, 177, 160)" }}>
							Chào mừng đến với Clover! 👋🏻
						</Typography>
						<Typography sx={{ color: "rgb(131, 149, 167)" }} variant="body1">
							Hãy đăng nhập tài khoản của bạn
						</Typography>
					</Box>
					<LoginForm />
					<Box>
						<Typography variant="body1" sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginY: 1, color: "rgb(131, 149, 167)" }}>
							Bạn chưa có tài khoản ?
							<button className="font-bold text-secondary ml-2" onClick={() => navigate("/signUp")}>
								Đăng ký
							</button>
						</Typography>
					</Box>
				</Box>
			</div>
		</div>
	);
};

export default LoginView;
