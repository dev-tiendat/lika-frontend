export enum Role {
	ROLE_ADMIN = "ROLE_ADMIN",
	ROLE_TEACHER = "ROLE_TEACHER",
	ROLE_STUDENT = "ROLE_STUDENT"
}

export enum Status {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE"
}

import * as Yup from "yup";

export enum Gender {
	FEMALE = "FEMALE",
	MAlE = "MALE"
}

export interface UserProfile {
	id: number;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	address: string;
	dateOfBirth: number;
	gender: Gender;
	status: Status;
	roles: Role[];
}

export interface UserInfo {
	id: number;
	username: string;
	firstName: string;
	lastName: string;
}

export const userSchema = Yup.object().shape({
	username: Yup.string().min(6, "Tên tài khoản cần tối thiểu 6 ký tự").required("Tài khoản không được để trống"),
	password: Yup.string().min(8, "Mật khẩu cần tối thiểu 8 ký tự").required("Mật khẩu không được để trống"),
	email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
	firstName: Yup.string().required("Họ không được để trống"),
	lastName: Yup.string().required("Tên không được để trống"),
	dateOfBirth: Yup.string().required("Ngày sinh không được để trống")
});
