import Link from "next/link";
import React, { FC, memo } from "react";

export interface CardChairOccupantProps {
	number: string;
	name: string;
	href: string;
}

const CardChairOccupantComponent: FC<CardChairOccupantProps> = ({ number, name, href }) => {
	return (
		<div className="flex flex-col w-full px-4 py-3 m-2 rounded-sm bg-secondary-400 shadow-sm sm:w-fit">
			<span className="text-base text-black-300">Cadeira Nº {number}</span>
			<Link href={href} shallow>
				<a className="font-semibold text-lg text-black-100 hover:underline">{name}</a>
			</Link>
		</div>
	);
};

export const CardChairOccupant = memo(CardChairOccupantComponent);
