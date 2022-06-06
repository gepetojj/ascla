import React, { ButtonHTMLAttributes, FC, memo, ReactNode } from "react";

export interface EditorMenuOptionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	tooltip: string;
	isActive?: boolean;
}

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
			className={`bg-grey-200 p-1 mx-1 rounded-sm duration-200 ${
				isActive ? "brightness-90 hover:brightness-[.85]" : "hover:brightness-95"
			}`}
			{...props}
		>
			{children}
		</button>
	);
};

export const EditorMenuOption = memo(EditorMenuOptionComponent);
