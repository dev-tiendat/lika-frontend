import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { HOME_URL } from "../../config/config";
import "./index.less";

const NotNetwork = () => {
	const navigate = useNavigate();
	const goHome = () => {
		navigate(HOME_URL);
	};
	return (
		<Result
			status="500"
			title="500"
			subTitle="Xin lỗi, có lỗi xảy ra."
			extra={
				<Button className="bg-red-300" type="primary" onClick={goHome}>
					Back Home
				</Button>
			}
		/>
	);
};

export default NotNetwork;
