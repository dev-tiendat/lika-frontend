import axios, {
	AxiosInstance,
	Method,
	AxiosError,
	AxiosRequestConfig,
	AxiosResponse,
	AxiosRequestHeaders,
	CancelToken
} from "axios";
import { Store } from "@reduxjs/toolkit";
import { message } from "antd";
import NProgress from "../config/nprogress";
import { isNil } from "lodash";
import { store } from "../store/store";
import auth from "../store/auth";
import { APIGenericResponse, APIGenericResponseData } from "./interface";
import { AxiosCanceler } from "./helper/axiosCancel";
import { showFullScreenLoading, tryHideFullScreenLoading } from "../config/serviceLoading";
import { checkStatus } from "./helper/checkStatus";

const axiosCanceler = new AxiosCanceler();

const TIMEOUT_REQUEST = 10000;

const config = {
	baseURL: "http://localhost:8081",
	timeout: TIMEOUT_REQUEST
	// withCredentials: true
};

class APIManager {
	private _service: AxiosInstance;
	private _store: Store | undefined;
	private _showLoading: boolean;

	constructor(config: AxiosRequestConfig, showLoading: boolean = true) {
		this._store = store;
		this._service = axios.create(config);
		this._showLoading = showLoading;

		this._service.interceptors.request.use(
			config => {
				NProgress.start();
				axiosCanceler.addPending(config);

				const token: string = this._store?.getState().auth.token;
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}

				return config;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		this._service.interceptors.response.use(
			response => {
				const { config } = response;
				NProgress.done();
				axiosCanceler.removePending(config);
				tryHideFullScreenLoading();
				return response;
			},
			error => {
				const { response } = error;
				NProgress.done();
				tryHideFullScreenLoading();
				if (error.message.indexOf("timeout") !== -1) message.error("Yêu cầu đã hết thời gian, vui lòng thử lại sau!");

				if (error.message.indexOf("Network Error") !== -1) message.error("Lỗi kết nối đến máy chủ");
				
				if (response) checkStatus(response.data.errorCode || response.status);

				// if (response.data.errorCode == "2001") {
				// 	store.dispatch(auth.actions.removeToken());
				// 	message.error(response.data.message);
				// 	window.location.hash = "/login";

				// 	return Promise.reject(response.data);
				// } else {
				// 	if (!window.navigator.onLine) window.location.hash = "/500";

				// 	return Promise.reject(error);
				// }
			}
		);
	}

	GET = async <T>(path: string, params?: Record<string, any> | undefined): Promise<APIGenericResponse<T>> => {
		return await this.request<T>("GET", path, undefined, params, null);
	};

	POST = async <T>(path: string, data?: any): Promise<APIGenericResponse<T>> => {
		return await this.request<T>("POST", path, undefined, undefined, data);
	};

	PUT = async <T>(path: string, data?: any): Promise<APIGenericResponse<T>> => {
		return await this.request<T>("PUT", path, undefined, undefined, data);
	};

	DELETE = async <T>(path: string, data?: any): Promise<APIGenericResponse<T>> => {
		return await this.request<T>("DELETE", path, undefined, undefined, data);
	};

	PATCH = async <T>(path: string, data?: any): Promise<APIGenericResponse<T>> => {
		return await this.request<T>("PATCH", path, undefined, undefined, data);
	};

	request = async <T>(
		method: Method,
		path: string,
		headers?: AxiosRequestHeaders,
		params?: Record<string, any> | undefined,
		data?: any
	): Promise<APIGenericResponse<T>> => {
		if (this._showLoading) showFullScreenLoading();
		try {
			if (headers == undefined) {
				headers = {} as AxiosRequestHeaders;
			}
			if (method !== "GET" && !isNil(data)) {
				if (data instanceof FormData) {
					headers["Content-Type"] = "multipart/form-data";
				} else {
					headers["Content-Type"] = "application/json;charset=UTF-8";
					data = JSON.stringify(data);
				}
			}

			const rawResponse = await this._service.request<APIGenericResponseData<T>>({
				url: path,
				method: method,
				headers: headers,
				params: params,
				data: data
			});

			const response = rawResponse.data;

			return {
				response
			};
		} catch (error) {
			return {
				error
			};
		}
	};

	isSucceed = (response: any) => {
		if (!response) {
			return false;
		}
		let responseData: APIGenericResponseData<any>;
		if ((response as APIGenericResponse<any>).response) {
			responseData = (response as APIGenericResponse<any>).response!;
		} else {
			responseData = response as APIGenericResponseData<any>;
		}

		return responseData || !(response.errorCode == 0 && response.data);
	};

	setShowLoading = (showLoading: boolean) => {
		this._showLoading = showLoading;
	};
}

export default new APIManager(config);
