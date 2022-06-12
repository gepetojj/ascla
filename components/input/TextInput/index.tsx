import React, { FC, InputHTMLAttributes, memo } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label: string;
	error?: boolean;
}

const TextInputComponent: FC<TextInputProps> = ({ id, label, error, ...props }) => {
	return (
		<div className="flex flex-col w-full gap-1 sm:w-fit">
			<label
				htmlFor={id}
				className={`text-xs ${error ? "text-red-600" : "text-black-300"} font-medium ml-1`}
			>
				{label}
			</label>
			<input
				{...props}
				placeholder={label}
				className={`px-2 py-1 border ${
					error ? "border-red-400/50 text-red-500" : "border-black-200/10"
				} rounded outline-none duration-200 focus:shadow-sm disabled:brightness-95 disabled:cursor-not-allowed read-only:cursor-default ${
					props.className || ""
				}`}
			/>
		</div>
	);
};

export const TextInput = memo(TextInputComponent);
