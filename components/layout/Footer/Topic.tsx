import React, { memo, FC, ReactNode } from "react";

export interface FooterTopicProps {
	title: string;
	children: ReactNode;
}

const FooterTopicComponent: FC<FooterTopicProps> = ({ title, children }) => {
	return (
		<div className="flex flex-col m-3">
			<h3 className="font-medium border-b border-dotted border-orange-300 pb-1 mb-2">
				{title}
			</h3>
			{children}
		</div>
	);
};

export const FooterTopic = memo(FooterTopicComponent);
