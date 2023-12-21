import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import LayoutMenu from "./Menu";
import LayoutHeader from "./Header";
import "./layout.less";

export const LayoutIndex = () => {
	const { Sider, Content } = Layout;
	const [isCollapse, setIsCollapse] = useState<boolean>(false);
	const [title, setTitle] = useState<string>("Trang chu");

	const listeningWindow = () => {
		window.onresize = () => {
			return (() => {
				let screenWidth = document.body.clientWidth;
				if (!isCollapse && screenWidth < 1200) setIsCollapse(true);
				if (!isCollapse && screenWidth > 1200) setIsCollapse(false);
			})();
		};
	};

	const handleCollapseToggle = () => {
		setIsCollapse(!isCollapse);
	};

	useEffect(() => {
		listeningWindow();
	}, []);

	return (
		<section className="container">
			<Sider trigger={null} collapsed={isCollapse} width={220} theme="light">
				<LayoutMenu isCollapse={isCollapse} setTitle={title => setTitle(title)} />
			</Sider>
			<Layout>
				<LayoutHeader title={title} isCollapse={isCollapse} onCollapseChange={handleCollapseToggle} />
				<Content>
					<Outlet></Outlet>
				</Content>
			</Layout>
		</section>
	);
};
