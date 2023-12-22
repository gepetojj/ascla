import { Image } from "components/view/Image";
import { academias, blogs, config } from "config";
import { useRouter } from "next/router";
import React, { memo, FC, useRef } from "react";
import { MdSearch } from "react-icons/md";

import { FooterTopic } from "./Topic";

const FooterComponent: FC = () => {
	const { push } = useRouter();
	const search = useRef<HTMLInputElement>(null);

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
							className="w-full px-2 py-1 rounded duration-200 outline-none border border-black-300/10 focus:border-black-300/50"
							type="text"
							placeholder="Procure por notícias:"
							ref={search}
						/>
						<button
							type="button"
							aria-label="Clique para pesquisar"
							className="flex justify-center items-center absolute h-full top-0 right-0 p-2 backdrop-blur-[1px] rounded-sm bg-cream-500/30 duration-200 hover:brightness-90"
							onClick={() =>
								push({
									pathname: "/noticias",
									query: {
										search: search?.current?.value,
									},
								})
							}
						>
							<MdSearch className="text-xl" />
						</button>
					</div>
				</FooterTopic>
				<FooterTopic title="Academias" onCenter>
					<ul className="flex flex-col gap-2 sm:gap-0">
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
					<ul className="flex flex-col gap-2 sm:gap-0">
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
					<ul className="flex flex-col gap-2 sm:gap-0">
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
				{config.shortName} - {new Date().getFullYear()} - Todos os direitos reservados.{" "}
				<br />
				Desenvolvido por{" "}
				<a
					href="http://www.github.com/gepetojj"
					target="_blank"
					rel="noopener noreferrer"
					className="text-slate-800 hover:underline"
				>
					Gepetojj
				</a>
			</span>
		</footer>
	);
};

export const Footer = memo(FooterComponent);
