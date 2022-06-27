import { config } from "config";
import type { BlogPost } from "entities/BlogPost";
import type { User } from "entities/User";
import { useJSON } from "hooks/useJSON";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdEdit, MdShare, MdUpdate } from "react-icons/md";
import { Store } from "react-notifications-component";
import useSWR from "swr";

import { Image } from "../Image";

export type PostViewProps = Omit<BlogPost, "id">;

/**
 * Renderiza a página de uma postagem.
 *
 * @see {@link PostViewProps}
 *
 * @param {PostViewProps} ...props Props do componente, desestruturados
 * @returns {FC<PostViewProps>} Componente
 */
const PostViewComponent: FC<PostViewProps> = ({ metadata, content, title, description }) => {
	const session = useSession();
	const { data, error } = useSWR(`/api/users/read?id=${metadata.authorId}`, (...args) =>
		fetch(...args).then(res => res.json())
	);
	const [author, setAuthor] = useState<User>();
	const contentHTML = useJSON(content);
	const { pathname } = useRouter();

	useEffect(() => {
		data && !error && setAuthor(data.user);
	}, [data, error]);

	const share = useCallback(() => {
		try {
			navigator.share({
				title: `${config.shortName} - ${title}`,
				text: description,
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
	}, [title, description]);

	return (
		<section className="flex flex-col-reverse justify-center w-full h-full gap-10 md:flex-row">
			<article className="flex justify-center max-w-2xl w-full">
				<div
					className="prose max-w-full"
					/* # skipcq: JS-0440 */
					dangerouslySetInnerHTML={{ __html: contentHTML }}
				/>
			</article>
			<aside className="flex flex-row justify-center items-center gap-4 md:flex-col md:justify-start md:gap-0">
				<div>
					<Image
						src={author?.avatarUrl || "usuario-padrao.webp"}
						alt="Avatar do usuário"
						width={74}
						height={74}
						className="rounded-full"
					/>
				</div>
				<div>
					<h3 className="text-lg text-center text-black-main font-medium break-words">
						{author?.name || "Nome do autor"}
					</h3>
					<div className="flex justify-center gap-2">
						<div className="flex items-center gap-1 text-xs">
							<AiOutlineClockCircle className="text-xl" />
							<span>{new Date(metadata.createdAt).toLocaleDateString()}</span>
						</div>
						{metadata.updatedAt > 0 && (
							<div className="flex items-center gap-1 text-xs">
								<MdUpdate className="text-xl" />
								<span>{new Date(metadata.updatedAt).toLocaleDateString()}</span>
							</div>
						)}
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
							<Link
								href={`/admin/${pathname.split("/")[1]}/${metadata.urlId}`}
								shallow
							>
								<a className="flex justify-center items-center gap-2 p-1 bg-cream-main rounded-sm duration-200 hover:brightness-95">
									<MdEdit className="text-xl" />
									<span>Editar</span>
								</a>
							</Link>
						)}
					</div>
				</div>
			</aside>
		</section>
	);
};

export const PostView = memo(PostViewComponent);
