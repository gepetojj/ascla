import { Tooltip } from "@material-tailwind/react";

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
		<Tooltip content={tooltip}>
			<button
				type="button"
				className={`bg-grey-200 p-1 mx-1 rounded-sm duration-200 ${
					isActive ? "brightness-90 hover:brightness-[.85]" : "hover:brightness-95"
				}`}
				{...props}
			>
				{children}
			</button>
		</Tooltip>
	);
};

export const EditorMenuOption = memo(EditorMenuOptionComponent);
