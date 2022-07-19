import { Button } from "components/input/Button";
import { Image } from "components/view/Image";
import { config } from "config";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { memo, FC, useCallback } from "react";

import { HeaderLink } from "./Link";

const HeaderComponent: FC = () => {
	const { pathname, push } = useRouter();
	const { data } = useSession();

	const accountLinkHandler = useCallback(() => {
		push(!data ? "/conta" : "/conta/dados");
	}, [push, data]);

	return (
		<header className="flex flex-col justify-center items-center bg-primary-main text-black-100 px-6 py-5 gap-4 lg:flex-row md:justify-between">
			<div className="flex items-center">
				<div className="flex items-center">
					<Image
						src="logo-ascla.webp"
						alt={`Logo da ${config.shortName}`}
						layout="fixed"
						width={94}
						height={94}
						priority
					/>
				</div>
				<div className="flex flex-col justify-center ml-5">
					<h1 className="text-2xl font-medium">{config.shortName}</h1>
					<h2 className="text-lg font-special">10 anos</h2>
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
					<Link href="/sobre/historia">
						<a>História</a>
					</Link>
					<Link href="/sobre/estatuto">
						<a>Estatuto</a>
					</Link>
				</HeaderLink>
				<HeaderLink
					href="#"
					isActive={pathname.startsWith("/cadeiras")}
					label="Cadeiras"
					showOnHover
				>
					<Link href="/cadeiras/patronos">
						<a>Patronos</a>
					</Link>
					<Link href="/cadeiras/academicos">
						<a>Acadêmicos</a>
					</Link>
					<Link href="/cadeiras/socios">
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
