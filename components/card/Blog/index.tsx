import { Image } from "components/view/Image";
import type { BlogPost } from "entities/BlogPost";
import type { User } from "next-auth";
import Link from "next/link";
import propTypes from "prop-types";
import React, { FC, memo, useState, useEffect } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import useSWR from "swr";

export interface CardBlogProps extends BlogPost {
	/**
	 * Tipo da postagem, pode variar entre `blog` e `noticias`.
	 * Será usado para definir a url da postagem.
	 */
	type: "blog" | "noticias";
}

/**
 * Renderiza uma "chamada" para uma postagem, podendo variar em dois tipos.
 *
 * @see {@link CardBlogProps}
 *
 * @param {CardBlogProps} ...props Props do componente, desestruturados
 * @returns {FC<CardBlogProps>} Componente
 */
const CardBlogComponent: FC<CardBlogProps> = ({
	title,
	description,
	thumbnailUrl,
	metadata,
	type,
}) => {
	const { data, error } = useSWR(`/api/users/read?id=${metadata.authorId}`, (...args) =>
		fetch(...args).then(res => res.json())
	);
	const [author, setAuthor] = useState<User>();

	useEffect(() => {
		data && !error && setAuthor(data.user);
	}, [data, error]);

	return (
		<article className="flex flex-col-reverse justify-center items-center gap-5 p-4 bg-secondary-400 sm:flex-row sm:justify-start sm:items-start">
			<div className="flex justify-center items-center max-w-[300px] w-full h-full rounded shadow">
				{thumbnailUrl ? (
					<Image
						src={thumbnailUrl}
						alt="Imagem do post"
						layout="responsive"
						width={300}
						height={150}
					/>
				) : (
					<div className="flex justify-center items-center w-full h-[150px] rounded bg-cream-100">
						<span className="font-bold">Imagem</span>
					</div>
				)}
			</div>
			<div className="w-full h-full">
				<div className="sm:min-h-[8rem]">
					<h2 className="text-xl font-semibold break-words mb-1">{title}</h2>
					<h3 className="text-black-100 italic break-words mb-2">{description}</h3>
				</div>
				<div className="flex justify-between items-center flex-wrap gap-2 text-sm">
					<div className="flex flex-wrap gap-5 text-black-200 truncate">
						<div className="flex items-center gap-2">
							<MdAccountCircle className="text-xl" />
							<span>{author?.name || "Nome do autor"}</span>
						</div>
						<div className="flex items-center gap-2">
							<AiOutlineClockCircle className="text-xl" />
							<span>{new Date(metadata.createdAt).toLocaleDateString()}</span>
						</div>
					</div>
					<Link href={`/${type || "blog"}/${metadata.urlId}`}>
						<a className="text-black-main underline-offset-1 hover:underline">
							Ler mais
						</a>
					</Link>
				</div>
			</div>
		</article>
	);
};

CardBlogComponent.propTypes = {
	title: propTypes.string.isRequired,
	description: propTypes.string.isRequired,
	thumbnailUrl: propTypes.string.isRequired,
	metadata: propTypes.shape({
		urlId: propTypes.string.isRequired,
		createdAt: propTypes.number.isRequired,
		updatedAt: propTypes.number.isRequired,
		authorId: propTypes.string.isRequired,
	}).isRequired,
	type: propTypes.oneOf<"blog" | "noticias">(["blog", "noticias"]).isRequired,
};

export const CardBlog = memo(CardBlogComponent);
