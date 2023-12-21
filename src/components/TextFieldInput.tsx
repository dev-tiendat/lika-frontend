import React, { useState } from "react";
import { TextField } from "@mui/material";

interface TextFieldInputProps {
	text: string;
	label: string;
	onChange: (text: string) => void;
	errorMessage?: string;
}

export const TextFieldInput: React.FC<TextFieldInputProps> = ({ text, label, onChange, errorMessage }) => {
	const [touched, setTouched] = useState<boolean>(false);

	return (
		<div className={`flex flex-col`}>
			<TextField
				autoComplete="new-password"
				label={label}
				fullWidth
				value={text}
				color={errorMessage && touched ? "error" : "primary"}
				onChange={e => {
					setTouched(true);
					onChange(e.target.value);
				}}
			/>
			{errorMessage && touched ? <p className="text-[#FF3333] text-sm mt-2">{errorMessage}</p> : null}
		</div>
	);
};

export default TextFieldInput;
