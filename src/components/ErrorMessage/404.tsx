import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { HOME_URL } from "../../config/config";
import "./index.less";

const NotFound = () => {
	const navigate = useNavigate();
	const goHome = () => {
		navigate(HOME_URL);
	};
	return (
		<Result
			status="404"
			title="404"
			subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
			extra={
				<Button className="bg-red-300" type="primary" onClick={goHome}>
					Back Home
				</Button>
			}
		/>
	);
};

export default NotFound;
