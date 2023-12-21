import React, { useState, SyntheticEvent } from "react";
import { Tooltip } from "antd";
import SvgIcon from "@/components/SvgIcon/";
import { Answer, Correct } from "@/interface/question";

interface HoverShowAnswerProps {
	content: string;
	answers: Answer[];
}

export const HoverShowAnswer: React.FC<HoverShowAnswerProps> = ({ content, answers }) => {
	return (
		<Tooltip
			overlayInnerStyle={{ minWidth: 350 }}
			title={
				<div className="p-2">
					<p className="mb-3 font-semibold">{content}</p>
					{answers.map(answer => (
						<p className={`${answer.isCorrect === Correct.TRUE ? "text-[#fed330] font-semibold" : "text-[#d1d8e0]"} ml-2 mb-2`}>
							{answer.optionLetter!.toUpperCase()}. {answer.content}
						</p>
					))}
				</div>
			}
			arrow
			color="#45aaf2"
			placement={"right"}
		>
			<div className="w-11 h-11 bg-[#a55eea] p-1 flex justify-center items-center rounded-md">
				<SvgIcon name="eye" size={25} color="#ffffff" />
			</div>
		</Tooltip>
	);
};

export default HoverShowAnswer;
