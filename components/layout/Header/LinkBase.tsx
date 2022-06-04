import React, { FC, memo, ReactNode } from "react";

export interface HeaderLinkBaseAnchorProps {
	as: "anchor";
	href: string;
	children: ReactNode;
	isActive?: boolean;
	isHovering?: undefined;
}

export interface HeaderLinkBaseButtonProps {
	as: "button";
	href?: undefined;
	children: ReactNode;
	isActive?: boolean;
	isHovering: boolean;
}

export type HeaderLinkBaseProps = HeaderLinkBaseAnchorProps | HeaderLinkBaseButtonProps;

const HeaderLinkBaseComponent: FC<HeaderLinkBaseProps> = ({
	as,
	children,
	isActive,
	href,
	isHovering,
}) => {
	if (as === "anchor" && href) {
		return (
			<a
				href={href}
				className={`text-secondary-700 m-1 p-1 rounded-sm cursor-pointer duration-200 ${
					isActive
						? "bg-secondary-700/[0.17] hover:bg-secondary-700/20"
						: "hover:bg-secondary-700/10"
				}`}
			>
				{children}
			</a>
		);
	}

	return (
		<button
			type="button"
			className={`text-secondary-700 m-1 p-1 rounded-sm cursor-pointer duration-200 ${
				isHovering || isActive ? "bg-secondary-700/20" : "hover:bg-secondary-700/10"
			}`}
		>
			{children}
		</button>
	);
};

export const HeaderLinkBase = memo(HeaderLinkBaseComponent);
