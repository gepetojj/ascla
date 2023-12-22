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
				className="flex justify-center items-start relative z-10 group"
				onMouseEnter={toggleHover}
				onMouseLeave={toggleHover}
			>
				<HeaderLinkBase as="button" isActive={isActive} isHovering={isHovering}>
					{label}
				</HeaderLinkBase>
				<div className="absolute ease-linear transform origin-top duration-100 scale-0 group-hover:scale-100">
					<div className="scale-0 group-hover:scale-100 w-full h-12" />
					<div className="flex flex-col justify-center items-center w-fit px-3 py-2 rounded-sm bg-gray-500/40 backdrop-blur-sm border border-gray-100/5">
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
