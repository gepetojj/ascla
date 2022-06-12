import React, { ButtonHTMLAttributes, FC, memo, ReactNode, useMemo } from "react";
import { CgSpinner } from "react-icons/cg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	loading?: boolean;
	asAnchor?: boolean;
	fullWidth?: boolean;
}

const ButtonComponent: FC<ButtonProps> = ({
	children,
	loading,
	asAnchor,
	fullWidth,
	type = "button",
	...props
}) => {
	const ButtonOrAnchor = useMemo(() => {
		const attributes: Omit<ButtonProps, "children"> = {
			...props,
			type,
			className: `flex justify-center items-center ${
				fullWidth ? "w-full" : "w-fit"
			} h-fit p-2 truncate rounded-sm duration-200 cursor-pointer select-none hover:brightness-95 active:brightness-90 disabled:cursor-not-allowed disabled:brightness-75 ${
				props.className || ""
			}`,
			disabled: props.disabled || loading,
		};

		if (asAnchor)
			return (
				<a className={attributes.className}>
					{loading && (
						<div>
							<CgSpinner className="text-xl text-current mr-2 animate-spin" />
						</div>
					)}
					{children}
				</a>
			);
		return (
			<button {...attributes}>
				{loading && (
					<div>
						<CgSpinner className="text-xl text-current mr-2 animate-spin" />
					</div>
				)}
				{children}
			</button>
		);
	}, [children, loading, asAnchor, fullWidth, type, props]);

	return <>{ButtonOrAnchor}</>;
};

export const Button = memo(ButtonComponent);
