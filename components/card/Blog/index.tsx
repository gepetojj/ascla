import type { BlogPost } from "entities/BlogPost";
import Image from "next/image";
import Link from "next/link";
import React, { FC, memo } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";

export type CardBlogProps = BlogPost;

const CardBlogComponent: FC<CardBlogProps> = ({ title, description, thumbnailUrl, metadata }) => {
	return (
		<article className="flex flex-col-reverse justify-center items-center gap-5 p-4 bg-cream-500 sm:flex-row sm:justify-start sm:items-start">
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
							<span>{metadata.authorId}</span>
						</div>
						<div className="flex items-center gap-2">
							<AiOutlineClockCircle className="text-xl" />
							<span>{new Date(metadata.createdAt).toLocaleDateString()}</span>
						</div>
					</div>
					<Link href={`/blog/${metadata.urlId}`}>
						<a className="text-secondary-600 underline-offset-1 hover:underline">
							Ler mais
						</a>
					</Link>
				</div>
			</div>
		</article>
	);
};

export const CardBlog = memo(CardBlogComponent);
