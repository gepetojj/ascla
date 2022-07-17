import Link from "next/link";
import propTypes from "prop-types";
import React, { FC, memo } from "react";

export interface CardChairOccupantProps {
	/** Número da cadeira do ocupante. */
	number: number;
	/** Nome do ocupante. */
	name: string;
	/** Link para a página do ocupante. */
	href: string;
}

/**
 * Renderiza uma "chamada" para a página do ocupante da cadeira.
 *
 * @see {@link CardChairOccupantProps}
 *
 * @param {CardChairOccupantProps} ...props Props do componente, desestruturados
 * @returns {FC<CardChairOccupantProps>} Componente
 */
const CardChairOccupantComponent: FC<CardChairOccupantProps> = ({ number, name, href }) => {
	return (
		<li className="flex flex-col w-full px-4 py-3 m-2 rounded-sm bg-secondary-400 shadow-sm sm:w-96">
			<span className="text-base text-black-300">
				Cadeira Nº {number < 10 ? `0${number}` : number}
			</span>
			<Link href={href}>
				<a className="font-semibold text-lg text-black-100 leading-snug hover:underline">{name}</a>
			</Link>
		</li>
	);
};

CardChairOccupantComponent.propTypes = {
	number: propTypes.number.isRequired,
	name: propTypes.string.isRequired,
	href: propTypes.string.isRequired,
};

export const CardChairOccupant = memo(CardChairOccupantComponent);
