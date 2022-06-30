import { Image } from "components/view/Image";
import { academias, blogs, config } from "config";
import React, { memo, FC } from "react";
import { MdSearch } from "react-icons/md";

import { FooterTopic } from "./Topic";

const FooterComponent: FC = () => {
	return (
		<footer className="flex flex-col w-full h-full p-6 gap-8 bg-primary-main text-black-100">
			<div className="flex items-center gap-4">
				<div>
					<Image
						src="logo-ascla.webp"
						alt={`Logo da ${config.shortName}`}
						layout="fixed"
						width={68}
						height={68}
						priority
					/>
				</div>
				<div className="flex flex-col gap-1 sm:gap-0">
					<h3 className="text-xl font-semibold">{config.fullName}</h3>
					<h4 className="font-light text-black-100">Santana do Ipanema, Alagoas</h4>
				</div>
			</div>
			<div className="flex justify-center items-center flex-wrap gap-x-8 gap-y-4 px-2 sm:justify-between sm:items-start">
				<FooterTopic title="Pesquisar:">
					<div className="relative w-60">
						<input
							className="w-full px-2 py-1 bg-cream-300 text-black-600 rounded-sm outline-none placeholder:text-black-500 focus:shadow-md"
							type="text"
							placeholder="Procure por notícias:"
						/>
						<button
							type="button"
							aria-label="Clique para pesquisar"
							className="flex justify-center items-center absolute h-full top-0 right-0 p-2 backdrop-blur-[1px] rounded-sm bg-cream-500/30 duration-200 hover:brightness-90"
						>
							<MdSearch className="text-xl" />
						</button>
					</div>
				</FooterTopic>
				<FooterTopic title="Academias" onCenter>
					<ul className="flex flex-col gap-1 sm:gap-0">
						{academias.map(academia => (
							<li key={academia.label.toLocaleLowerCase()}>
								<a
									href={academia.url}
									target="_blank"
									rel="noreferrer"
									className="hover:underline"
								>
									{academia.label}
								</a>
							</li>
						))}
					</ul>
				</FooterTopic>
				<FooterTopic title="Blogs" onCenter>
					<ul className="flex flex-col gap-1 sm:gap-0">
						{blogs.map(blog => (
							<li key={blog.label.toLocaleLowerCase()}>
								<a
									href={blog.url}
									target="_blank"
									rel="noreferrer"
									className="hover:underline"
								>
									{blog.label}
								</a>
							</li>
						))}
					</ul>
				</FooterTopic>
				<FooterTopic title="Jornais da Região" onCenter>
					<ul className="flex flex-col gap-1 sm:gap-0">
						<li>
							<a
								href="https://www.maltanet.com.br/v2/"
								target="_blank"
								rel="noreferrer"
								className="hover:underline"
							>
								Maltanet
							</a>
						</li>
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
								href="https://www.historiadealagoas.com.br"
								target="_blank"
								rel="noreferrer"
								className="hover:underline"
							>
								História de Alagoas
							</a>
						</li>
						<li>
							<a
								href="https://www.alagoasnanet.com.br/v3/"
								target="_blank"
								rel="noreferrer"
								className="hover:underline"
							>
								Alagoas na Net
							</a>
						</li>
					</ul>
				</FooterTopic>
			</div>
			<span className="text-center text-sm font-medium mt-2">
				{config.shortName} - {new Date().getFullYear()} - Todos os direitos reservados.
			</span>
		</footer>
	);
};

export const Footer = memo(FooterComponent);
