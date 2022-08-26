import React, { ButtonHTMLAttributes, FC, memo, ReactNode } from "react";

export interface EditorMenuOptionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	/** Filhos do componente. */
	children: ReactNode;
	/** Texto do tooltip do botão. */
	tooltip: string;
	/** Determina se o botão está ativo. */
	isActive?: boolean;
}

/**
 * Renderiza um botão para o menu do editor.
 *
 * @see {@link EditorMenuOptionProps}
 *
 * @param {EditorMenuOptionProps} ...props Props do componente, desestruturados
 * @returns {FC<EditorMenuOptionProps>} Componente
 */
const EditorMenuOptionComponent: FC<EditorMenuOptionProps> = ({
	children,
	tooltip,
	isActive,
	...props
}) => {
	return (
		<button
			type="button"
			title={tooltip}
			className={`p-1 mx-1 rounded-sm duration-200 ${
				isActive ? "bg-slate-200" : "hover:bg-slate-200/50"
			}`}
			{...props}
		>
			{children}
		</button>
	);
};

export const EditorMenuOption = memo(EditorMenuOptionComponent);
