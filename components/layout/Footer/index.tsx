import React, { memo, FC } from "react";

import { FooterTopic } from "./Topic";

const FooterComponent: FC = () => {
	return (
		<footer className="flex flex-col w-full h-full px-6 py-4 bg-orange-50">
			<section>
				<h2 className="text-lg font-medium">
					ASCLA - Academia Santanense de Letras, Ciências e Artes
				</h2>
			</section>
			<section className="flex justify-between flex-wrap mt-6 px-2">
				<FooterTopic title="Pesquisar:">
					<input type="text" placeholder="Busca:" />
				</FooterTopic>
				<FooterTopic title="Academias">
					<ul>
						<li>
							<a href="#">Academia 1</a>
						</li>
						<li>
							<a href="#">Academia 2</a>
						</li>
						<li>
							<a href="#">Academia 3</a>
						</li>
					</ul>
				</FooterTopic>
				<FooterTopic title="Blogs">
					<ul>
						<li>
							<a href="#">Blog 1</a>
						</li>
						<li>
							<a href="#">Blog 2</a>
						</li>
						<li>
							<a href="#">Blog 3</a>
						</li>
					</ul>
				</FooterTopic>
				<FooterTopic title="Jornais da Região">
					<ul>
						<li>
							<a href="#">Jornal 1</a>
						</li>
						<li>
							<a href="#">Jornal 2</a>
						</li>
					</ul>
				</FooterTopic>
			</section>
		</footer>
	);
};

export const Footer = memo(FooterComponent);
