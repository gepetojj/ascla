import React, { FC, HTMLAttributes, memo, ReactNode } from "react";

export interface MainProps extends HTMLAttributes<HTMLDivElement> {
	title: string;
	children: ReactNode;
}

const MainComponent: FC<MainProps> = ({ title, children, ...props }) => {
	return (
		<main className={props.className ?? "p-6"} {...props}>
			<h2 className="text-2xl text-center font-bold mt-4 mb-10">{title}</h2>
			{children}
		</main>
	);
};

export const Main = memo(MainComponent);
