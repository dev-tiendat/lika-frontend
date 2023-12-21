import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { HOME_URL } from "../../config/config";
import "./index.less";

const NotAuth = () => {
	const navigate = useNavigate();
	const goHome = () => {
		navigate(HOME_URL);
	};
	return (
		<Result
			status="403"
			title="403"
			subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
			extra={
				<Button className="bg-red-300" type="primary" onClick={goHome}>
					Back Home
				</Button>
			}
		/>
	);
};

export default NotAuth;
