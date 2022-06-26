import { Image } from "components/view/Image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import propTypes from "prop-types";
import React, { FC, memo, useCallback } from "react";
import { MdEdit, MdShare } from "react-icons/md";
import { Store } from "react-notifications-component";

export interface ChairOccupantViewProps {
	/** Nome do ocupante. */
	name: string;
	/** Cadeira do ocupante. */
	chair: number;
	/** Avatar do ocupante. */
	avatarUrl?: string;
	/** Biografia do ocupante, em HTML. */
	bioHTML: string;
	/** urlId do ocupante. */
	urlId: string;
	/**
	 * Tipo do oposto do ocupante, podendo ser `academic` ou `patron`.
	 * Exemplo: o ocupante é um acadêmico, então seu oposto será um patrono, e vice-versa.
	 */
	oppositeType: "academic" | "patron";
	/** Nome do oposto do ocupante. */
	oppositeName?: string;
	/** Link para a página do oposto do ocupante. */
	oppositeUrlId?: string;
}

/**
 * Renderiza a página de um ocupante.
 *
 * @see {@link ChairOccupantViewProps}
 *
 * @param {ChairOccupantViewProps} ...props Props do componente, desestruturadas
 * @returns {FC<ChairOccupantViewProps>} Componente
 */
const ChairOccupantViewComponent: FC<ChairOccupantViewProps> = ({
	name,
	chair,
	avatarUrl,
	bioHTML,
	urlId,
	oppositeType,
	oppositeName,
	oppositeUrlId,
}) => {
	const session = useSession();
	const { pathname } = useRouter();

	const share = useCallback(() => {
		try {
			navigator.share({
				title: `ASCLA - ${name}`,
				text: `Conheça a história de ${name} agora, no website oficial da Academia Santanense de Ciências, Letras e Artes.`,
				url: window.location.href,
			});
		} catch {
			navigator.clipboard.writeText(window.location.href);
			Store.addNotification({
				title: "Sucesso",
				message: "Link copiado para a área de transferência.",
				type: "success",
				container: "bottom-right",
				dismiss: {
					duration: 5000,
					onScreen: true,
				},
			});
		}
	}, [name]);

	return (
		<section className="flex flex-col justify-center items-center w-full h-full gap-10 md:px-10 md:flex-row md:items-start">
			<aside className="flex flex-col items-center gap-2">
				<div>
					<Image
						src={avatarUrl || "usuario-padrao.webp"}
						alt="Avatar do participante"
						width={100}
						height={100}
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
				<div className="flex flex-col justify-center mt-4 gap-1">
					<button
						type="button"
						className="flex justify-center items-center gap-2 p-1 bg-cream-main rounded-sm duration-200 hover:brightness-95"
						onClick={share}
					>
						<MdShare className="text-xl" />
						<span>Compartilhar</span>
					</button>
					{session.data?.user?.role === "admin" && (
						<Link href={`/admin/${pathname.split("/")[2]}/${urlId}`} shallow>
							<a className="flex justify-center items-center gap-2 p-1 bg-cream-main rounded-sm duration-200 hover:brightness-95">
								<MdEdit className="text-xl" />
								<span>Editar</span>
							</a>
						</Link>
					)}
				</div>
			</aside>
			<article className="flex justify-center max-w-xl w-full">
				<div
					className="prose max-w-full w-full"
					dangerouslySetInnerHTML={{ __html: bioHTML }}
				/>
			</article>
		</section>
	);
};

ChairOccupantViewComponent.propTypes = {
	name: propTypes.string.isRequired,
	chair: propTypes.number.isRequired,
	avatarUrl: propTypes.string,
	bioHTML: propTypes.string.isRequired,
	urlId: propTypes.string.isRequired,
	oppositeType: propTypes.oneOf<"academic" | "patron">(["academic", "patron"]).isRequired,
	oppositeName: propTypes.string,
	oppositeUrlId: propTypes.string,
};

export const ChairOccupantView = memo(ChairOccupantViewComponent);
