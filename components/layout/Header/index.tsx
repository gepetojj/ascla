import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { memo, FC } from "react";

import { HeaderLink } from "./Link";

const HeaderComponent: FC = () => {
	const { pathname } = useRouter();
	const { data } = useSession();

	return (
		<header className="w-screen h-fit p-6 bg-orange-50">
			<div className="flex items-center py-2 mb-2">
				<Image src="/logo.jpg" alt="Logo da ASCLA" width={51} height={51} priority />
				<h1 className="text-4xl ml-5">ASCLA</h1>
			</div>
			<nav className="flex justify-center items-center flex-wrap w-full">
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
				<HeaderLink
					href={!data ? "/conta" : "/conta/dados"}
					isActive={pathname.startsWith("/conta")}
				>
					{!data ? "Entrar" : "Sua conta"}
				</HeaderLink>
			</nav>
		</header>
	);
};

export const Header = memo(HeaderComponent);
