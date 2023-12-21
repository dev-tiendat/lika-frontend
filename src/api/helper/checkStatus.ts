import { message } from "antd";
import callToast, { ToastType } from "../../common/callToast";

message.config({
	// top: 100,
	duration: 2,
	maxCount: 3,
	prefixCls: "my-message"
});

export const checkStatus = (status: number): void => {
	switch (status) {
		case 400:
			message.error("Yêu cầu không thành công! Vui lòng thử lại sau");
			break;
		case 401:
			message.error("Đăng nhập không hợp lệ! Xin vui lòng đăng nhập lại");
			break;
		case 403:
			message.error("Tài khoản hiện tại không có quyền truy cập!");
			break;
		case 404:
			message.error("Tài nguyên bạn đang truy cập không tồn tại!");
			break;
		case 405:
			message.error("Phương pháp yêu cầu sai! Vui lòng thử lại sau");
			break;
		case 408:
			message.error("Yêu cầu đã hết thời gian chờ! Vui lòng thử lại sau");
			break;
		case 409: 
			message.error("Người dùng đã có dữ liệu trên hệ thống, không thể xóa!");
			break;
		case 500:
			message.error("Có lỗi phía máy chủ!");
			break;
		case 502:
			message.error("Lỗi cổng!");
			break;
		case 503:
			message.error("Dịch vụ không có sẵn!");
			break;
		case 504:
			message.error("Cổng Time-out!");
			break;

		//Custom code
		case 2000:
			callToast(ToastType.ERROR, "Người dùng đã được đăng ký!");
			break;
		case 2001:
			callToast(ToastType.ERROR, "Email đã được đăng ký!");
			break;
		case 2003:
			callToast(ToastType.ERROR, "Người dùng chưa được đăng ký!");
			break;
		case 2004:
			callToast(ToastType.ERROR, "Mật khẩu không đúng!");
			break;
		case 2005:
			callToast(ToastType.ERROR, "Tài khoản chưa được kích hoạt!");
			break;
		case 2006:
			callToast(ToastType.ERROR, "Token hết hạn, vui lòng đăng nhập lại!");
			break;
		default:
			message.error("Yêu cầu không thành công!");
	}
};
