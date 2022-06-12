import Image from "next/image";
import React, { memo, FC } from "react";
import { MdSearch } from "react-icons/md";

import { FooterTopic } from "./Topic";

const FooterComponent: FC = () => {
	return (
		<footer className="flex flex-col w-full h-full p-6 gap-8 bg-primary-main">
			<div className="flex items-center gap-4">
				<div>
					<Image
						src="/logo-ascla.webp"
						alt="Logo da ASCLA"
						layout="fixed"
						width={68}
						height={68}
						priority
					/>
				</div>
				<h3 className="text-xl text-secondary-800 font-semibold">
					Academia Santanense de Ciências, Letras e Artes
				</h3>
			</div>
			<div className="flex justify-center items-center flex-wrap gap-x-8 gap-y-4 px-2 sm:justify-between">
				<FooterTopic title="Pesquisar:">
					<div className="relative w-60">
						<input
							className="w-full px-2 py-1 bg-cream-300 text-black-500 rounded-sm outline-none placeholder:text-black-500/70 focus:shadow-md"
							type="text"
							placeholder="Procure por notícias:"
						/>
						<button className="flex justify-center items-center absolute h-full top-0 right-0 p-2 backdrop-blur-[1px] rounded-sm bg-cream-500/30 duration-200 hover:brightness-90">
							<MdSearch className="text-xl" />
						</button>
					</div>
				</FooterTopic>
				<FooterTopic title="Academias" onCenter>
					<ul className="text-secondary-800">
						<li>
							<a
								href="https://www.academia.org.br/"
								target="_blank"
								rel="noreferrer"
								className="hover:underline"
							>
								ABL
							</a>
						</li>
						<li>
							<a
								href="https://www.aal.al.org.br/"
								target="_blank"
								rel="noreferrer"
								className="hover:underline"
							>
								AAL
							</a>
						</li>
						<li>
							<a
								href="https://apalca.com.br/"
								target="_blank"
								rel="noreferrer"
								className="hover:underline"
							>
								APALCA
							</a>
						</li>
					</ul>
				</FooterTopic>
				<FooterTopic title="Blogs" onCenter>
					<ul className="text-secondary-800">
						<li>
							<a
								href="https://www.apensocomgrifo.com/"
								target="_blank"
								rel="noreferrer"
								className="hover:underline"
							>
								Apenso com Grifo
							</a>
						</li>
						<li>
							<a
								href="#"
								target="_blank"
								rel="noreferrer"
								className="hover:underline"
							>
								Outro blog
							</a>
						</li>
						<li>
							<a
								href="#"
								target="_blank"
								rel="noreferrer"
								className="hover:underline"
							>
								Mais um blog
							</a>
						</li>
					</ul>
				</FooterTopic>
				<FooterTopic title="Jornais da Região" onCenter>
					<ul className="text-secondary-800">
						<li>
							<a
								href="https://d.gazetadealagoas.com.br/"
								target="_blank"
								rel="noreferrer"
								className="hover:underline"
							>
								Gazeta de Alagoas
							</a>
						</li>
						<li>
							<a
								href="#"
								target="_blank"
								rel="noreferrer"
								className="hover:underline"
							>
								Outro jornal
							</a>
						</li>
					</ul>
				</FooterTopic>
			</div>
			<span className="text-center text-sm text-secondary-800 font-medium mt-2">
				ASCLA - {new Date().getFullYear()} - Código aberto no{" "}
				<a
					href="http://github.com/gepetojj/ascla-website"
					target="_blank"
					rel="noreferrer"
					className="hover:underline"
				>
					Github
				</a>
			</span>
		</footer>
	);
};

export const Footer = memo(FooterComponent);
