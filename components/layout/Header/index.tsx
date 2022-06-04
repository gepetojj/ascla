import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { memo, FC } from "react";

import { HeaderLink } from "./Link";

const HeaderComponent: FC = () => {
	const { pathname } = useRouter();
	const { data } = useSession();

	return (
		<header className="flex flex-col justify-center items-center bg-primary-main px-6 py-5 md:flex-row md:justify-between">
			<div className="flex items-center">
				<div className="flex items-center">
					<Image
						src="/logo-ascla.webp"
						alt="Logo da ASCLA"
						layout="fixed"
						width={72}
						height={72}
						priority
					/>
				</div>
				<h1 className="text-2xl font-medium text-secondary-800 ml-5">ASCLA</h1>
			</div>
			<nav className="flex justify-center items-center flex-wrap w-full mx-6 my-3 md:flex-nowrap md:my-0">
				<HeaderLink href="/" isActive={pathname === "/"}>
					Início
				</HeaderLink>
				<HeaderLink
					href="#"
					isActive={pathname.startsWith("/sobre")}
					label="Sobre"
					showOnHover
				>
					<a href="/sobre/historia">História</a>
					<a href="/sobre/estatuto">Estatuto</a>
					<a href="/sobre/sede">Sede</a>
				</HeaderLink>
				<HeaderLink
					href="#"
					isActive={pathname.startsWith("/cadeiras")}
					label="Cadeiras"
					showOnHover
				>
					<a href="/cadeiras/patronos">Patronos</a>
					<a href="/cadeiras/academicos">Acadêmicos</a>
					<a href="/cadeiras/socios">Sócios</a>
				</HeaderLink>
				<HeaderLink href="/blog" isActive={pathname.startsWith("/blog")}>
					Blog
				</HeaderLink>
				<HeaderLink href="/contato" isActive={pathname === "/contato"}>
					Contato
				</HeaderLink>
			</nav>
			<div>
				<HeaderLink
					href={!data ? "/conta" : "/conta/dados"}
					isActive={pathname.startsWith("/conta")}
				>
					{!data ? "Entrar" : "Sua conta"}
				</HeaderLink>
			</div>
		</header>
	);
};

export const Header = memo(HeaderComponent);
