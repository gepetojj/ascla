import React, { FC, HTMLAttributes, memo, ReactNode } from "react";

export interface MainProps extends HTMLAttributes<HTMLDivElement> {
	title: string;
	children: ReactNode;
}

const MainComponent: FC<MainProps> = ({ title, children, ...props }) => {
	return (
		<main className={props.className ?? "p-6"} {...props}>
			<h1 className="text-2xl text-center font-bold mt-4 mb-10 max-w-full break-words">
				{title}
			</h1>
			{children}
		</main>
	);
};

export const Main = memo(MainComponent);
