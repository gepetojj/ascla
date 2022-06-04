import React, { memo, FC, ReactNode, Children, useState, useCallback } from "react";

import { HeaderLinkBase } from "./LinkBase";

export interface HeaderLinkProps {
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
				<HeaderLinkBase as="button" isActive={isActive} isHovering={isHovering}>
					{label}
				</HeaderLinkBase>
				<div
					className={`flex flex-col justify-center items-center absolute w-fit px-3 py-2 top-12 rounded-sm 
					bg-gray-500/40 backdrop-blur-sm border border-gray-100/5 ease-linear transform origin-top duration-100 ${
						isHovering ? "scale-100" : "scale-0"
					}`}
				>
					{Children.toArray(children).map((option, index) => (
						<div
							key={`header-link-${index}`}
							className="w-full text-center p-1 cursor-pointer hover:underline underline-offset-1"
						>
							{option}
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<HeaderLinkBase as="anchor" href={href} isActive={isActive}>
			{children}
		</HeaderLinkBase>
	);
};

export const HeaderLink = memo(HeaderLinkComponent);
