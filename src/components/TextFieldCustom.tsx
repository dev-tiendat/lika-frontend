import React, { useState, HTMLInputTypeAttribute } from "react";

interface TextFieldCustomProps {
	text: string;
	label: string;
	onChange: (text: string) => void;
	type?: HTMLInputTypeAttribute;
	errorMessage?: string;
	textarea?: boolean;
	rows?: number;
}

export const TextFieldCustom: React.FC<TextFieldCustomProps> = ({
	text,
	label,
	onChange,
	errorMessage,
	type = "text",
	textarea,
	rows = 2
}) => {
	const [touched, setTouched] = useState<boolean>(false);
    
	return (
		<div className="w-full flex items-start ">
			<div className="flex-1  mr-5">
				<label htmlFor="lastName" className="block text-sm font-medium text-[#111827] undefined undefined mb-2">
					{label}
				</label>
				<div className="relative">
					{!textarea ? (
						<input
							value={text}
							onChange={e => {
								setTouched(true);
								onChange(e.target.value);
							}}
							type={type}
							className="bg-[#F9FAFB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-primary block w-full p-2.5 dark:bg-gray-700 dark:border-[#D1D5DB] dark:placeholder-gray-400 dark:text-[#111827]"
							placeholder=""
							autoComplete="off"
							min="0"
						/>
					) : (
						<textarea
							value={text}
							onChange={e => {
                                setTouched(true);
								onChange(e.target.value);
							}}
							rows={rows}
							className="bg-[#F9FAFB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-primary block w-full p-2.5 dark:bg-gray-700 dark:border-[#D1D5DB] dark:placeholder-gray-400 dark:text-[#111827]"
							placeholder=""
							autoComplete="off"
						/>
					)}
				</div>
				{errorMessage && touched ? <p className="text-[#FF3333] text-sm mt-2">{errorMessage}</p> : null}
			</div>
		</div>
	);
};

export default TextFieldCustom;
