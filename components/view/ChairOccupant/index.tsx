import Image from "next/image";
import Link from "next/link";
import React, { FC, memo } from "react";

export interface ChairOccupantViewProps {
	name: string;
	chair: number;
	avatarUrl?: string;
	bioHTML: string;
	oppositeType: "academic" | "patron";
	oppositeName?: string;
	oppositeUrlId?: string;
}

const ChairOccupantViewComponent: FC<ChairOccupantViewProps> = ({
	name,
	chair,
	avatarUrl,
	bioHTML,
	oppositeType,
	oppositeName,
	oppositeUrlId,
}) => {
	return (
		<section className="flex flex-col justify-center items-center w-full h-full gap-10 md:px-10 md:flex-row md:items-start">
			<aside className="flex flex-col items-center gap-2">
				<div>
					<Image
						src={avatarUrl || "/usuario-padrao.webp"}
						alt="Avatar do participante"
						width={86}
						height={86}
						className="rounded-full"
					/>
				</div>
				<div className="w-full text-center">
					<h2 className="text-xl font-semibold truncate">{name}</h2>
					<span className="truncate">Cadeira Nº {chair < 10 ? `0${chair}` : chair}</span>
				</div>
				<div className="w-full text-center">
					<h2 className="text-center text-xl font-semibold">
						{oppositeType === "academic" ? "Acadêmico" : "Patrono"}
					</h2>
					<Link
						href={`/cadeiras/${
							oppositeType === "academic" ? "academicos" : "patronos"
						}/${oppositeUrlId}`}
					>
						<a className="truncate hover:underline">
							{oppositeName || "Nome do participante"}
						</a>
					</Link>
				</div>
			</aside>
			<article className="flex justify-center max-w-xl w-full">
				<div
					className="prose max-w-full w-full"
					dangerouslySetInnerHTML={{ __html: bioHTML }}
				></div>
			</article>
		</section>
	);
};

export const ChairOccupantView = memo(ChairOccupantViewComponent);
