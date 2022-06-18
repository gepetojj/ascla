import propTypes from "prop-types";
import React, { FC, InputHTMLAttributes, memo } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	/** Identificador único do componente. */
	id: string;
	/** Texto que ficará acima do componente. */
	label: string;
	/** Determina se o estado de erro está ativo. */
	error?: boolean;
}

/**
 * Renderiza um input de texto.
 *
 * @see {@link TextInputProps}
 *
 * @param {TextInputProps} ...props Props do componente, desestruturados
 * @returns {FC<TextInputProps>} Componente
 */
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
					error
						? "border-red-400/50 text-red-500 focus:border-red-400/60"
						: "border-black-200/10 focus:border-black-200/20"
				} rounded outline-none duration-200 disabled:brightness-95 disabled:cursor-not-allowed read-only:cursor-default ${
					props.className || ""
				}`}
			/>
		</div>
	);
};

TextInputComponent.propTypes = {
	id: propTypes.string.isRequired,
	label: propTypes.string.isRequired,
	error: propTypes.bool,
};

export const TextInput = memo(TextInputComponent);
