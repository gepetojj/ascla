import React, { memo, FC, ReactNode, HTMLProps, Children, useState, useCallback } from "react";

export interface HeaderLinkProps extends HTMLProps<HTMLAnchorElement> {
	href: string;
	isActive?: boolean;
	label?: string;
	showOnHover?: boolean;
	children: ReactNode;
}

const HeaderLinkComponent: FC<HeaderLinkProps> = ({
	href,
	isActive,
	label,
	showOnHover,
	children,
	...props
}) => {
	const [isHovering, setIsHovering] = useState(false);

	const toggleHover = useCallback(() => setIsHovering(isHovering => !isHovering), []);

	if (showOnHover) {
		return (
			<div
				className="flex justify-center items-start relative z-10"
				onMouseEnter={toggleHover}
				onMouseLeave={toggleHover}
			>
				<button
					className={`p-2 mx-1 rounded-sm duration-200 bg-orange-50 ${
						isHovering || isActive ? "brightness-95" : "hover:brightness-95"
					}`}
				>
					{label}
				</button>
				<div
					className={`flex flex-col justify-center items-center absolute w-fit p-2 top-12 bg-orange-100 ease-linear transform origin-top duration-100 ${
						isHovering ? "scale-100" : "scale-0"
					}`}
				>
					{Children.toArray(children).map((option, index) => (
						<div
							key={`header-link-${index}`}
							className="w-full p-1 cursor-pointer text-center bg-orange-100 duration-200 rounded-sm hover:brightness-95"
						>
							{option}
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<a
			className={`p-2 mx-1 rounded-sm duration-200 bg-orange-50 ${
				isActive ? "brightness-95 hover:brightness-90" : "hover:brightness-95"
			}`}
			href={href}
			{...props}
		>
			{children}
		</a>
	);
};

export const HeaderLink = memo(HeaderLinkComponent);
