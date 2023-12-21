import React from "react";
import logo from "@/assets/images/logo.svg";

interface LogoProps {
	isCollapse: boolean;
}

export const Logo: React.FC<LogoProps> = props => {
	const { isCollapse } = props;

	return (
		<div className="logo-box">
			<img src={logo} alt="logo" className="logo-img" />
			{!isCollapse ? <h2 className="logo-text">CLOVER</h2> : null}
		</div>
	);
};

export default Logo;
