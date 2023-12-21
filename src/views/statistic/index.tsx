import React from "react";
import StatisticTotalAll from "./TotalAll";
import StatisticQuestion from "./StatisticQuestion";

function StatisticView() {
	return (
		<div className="card min-h-full">
			<StatisticTotalAll />
			<StatisticQuestion />
		</div>
	);
}

export default StatisticView;
