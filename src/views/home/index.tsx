import welcome from "@/assets/images/welcome01.png";

const HomeView = () => {
	return (
		<div className="flex justify-center items-center h-full w-full card ">
			<img className="w-3/4" src={welcome} alt="welcome" />
		</div>
	);
};

export default HomeView;
