import React, { memo, FC, ReactNode } from "react";

export interface FooterTopicProps {
	title: string;
	children: ReactNode;
	onCenter?: boolean;
}

const FooterTopicComponent: FC<FooterTopicProps> = ({ title, children, onCenter }) => {
	return (
		<div className={`flex flex-col gap-4 ${onCenter ? "text-center" : "text-left"}`}>
			<h4 className="text-lg text-secondary-800 font-medium">{title}</h4>
			{children}
		</div>
	);
};

export const FooterTopic = memo(FooterTopicComponent);
