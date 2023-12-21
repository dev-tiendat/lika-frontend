import screenfull from "screenfull";
import { message } from "antd";
import { useEffect, useState } from "react";
import SvgIcon from "@/components/SvgIcon";

const ICON_SIZE = 35;

export const Fullscreen = () => {
	const [fullScreen, setFullScreen] = useState<boolean>(screenfull.isFullscreen);

	useEffect(() => {
		screenfull.on("change", () => {
			if (screenfull.isFullscreen) setFullScreen(true);
			else setFullScreen(false);
			return () => screenfull.off("change", () => {});
		});
	}, []);

	const handleFullScreen = () => {
		if (!screenfull.isEnabled) message.warning("当前您的浏览器不支持全屏 ❌");
		screenfull.toggle();
	};
	return (
		<button className="flex justify-center items-center mr-2" onClick={handleFullScreen}>
			{fullScreen ? (
				<SvgIcon name="fullscreen-exit-outlined" size={ICON_SIZE} color="#feca57"/>
			) : (
				<SvgIcon name="fullscreen-outlined" size={ICON_SIZE} color="#feca57"/>
			)}
		</button>
	);
};
export default Fullscreen;
