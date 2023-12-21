import react from "react";
import { HashRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import Toast from "./components/Toast";
import Router from "./routers";
import AuthRouter from "./routers/utils/AuthRouter";

function App() {
	// console.log(routerArray);
	return (
		<HashRouter>
			<ConfigProvider>
				<AuthRouter>
					<Router />
				</AuthRouter>
				<Toast />
			</ConfigProvider>
		</HashRouter>
	);
}

export default App;
