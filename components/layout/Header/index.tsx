import { Button } from "components/input/Button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { memo, FC, useCallback } from "react";

import { HeaderLink } from "./Link";

const HeaderComponent: FC = () => {
	const { pathname, push } = useRouter();
	const { data } = useSession();

	const accountLinkHandler = useCallback(() => {
		push(!data ? "/conta" : "/conta/dados", undefined, { shallow: true });
	}, [push, data]);

	return (
		<header className="flex flex-col justify-center items-center bg-primary-main text-black-100 px-6 py-5 gap-4 lg:flex-row md:justify-between">
			<div className="flex items-center">
				<div className="flex items-center">
					<Image
						src="/logo-ascla.webp"
						alt="Logo da ASCLA"
						layout="fixed"
						width={92}
						height={92}
						priority
					/>
				</div>
				<div className="flex flex-col justify-center ml-5">
					<h1 className="text-2xl font-medium">ASCLA</h1>
					<h2 className="text-sm font-medium">10 anos</h2>
				</div>
			</div>
			<nav
				title="Páginas"
				className="flex justify-center items-center flex-wrap w-full my-3 md:flex-nowrap md:my-0"
			>
				<HeaderLink href="/" isActive={pathname === "/"}>
					Início
				</HeaderLink>
				<HeaderLink
					href="#"
					isActive={pathname.startsWith("/sobre")}
					label="Sobre"
					showOnHover
				>
					<Link href="/sobre/historia" shallow>
						<a>História</a>
					</Link>
					<Link href="/sobre/estatuto" shallow>
						<a>Estatuto</a>
					</Link>
					<Link href="/sobre/sede" shallow>
						<a>Sede</a>
					</Link>
				</HeaderLink>
				<HeaderLink
					href="#"
					isActive={pathname.startsWith("/cadeiras")}
					label="Cadeiras"
					showOnHover
				>
					<Link href="/cadeiras/patronos" shallow>
						<a>Patronos</a>
					</Link>
					<Link href="/cadeiras/academicos" shallow>
						<a>Acadêmicos</a>
					</Link>
					<Link href="/cadeiras/socios" shallow>
						<a>Sócios</a>
					</Link>
				</HeaderLink>
				<HeaderLink href="/noticias" isActive={pathname.startsWith("/noticias")}>
					Notícias
				</HeaderLink>
				<HeaderLink href="/blog" isActive={pathname.startsWith("/blog")}>
					Blog
				</HeaderLink>
				<HeaderLink href="/contato" isActive={pathname === "/contato"}>
					Contato
				</HeaderLink>
			</nav>
			<div>
				<Button onClick={accountLinkHandler} className="bg-secondary-800 text-cream-100">
					{!data ? "Entrar" : "Sua conta"}
				</Button>
			</div>
		</header>
	);
};

export const Header = memo(HeaderComponent);
