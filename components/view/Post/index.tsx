import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import type { BlogPost } from "entities/BlogPost";
import type { User } from "entities/User";
import Image from "next/image";
import React, { FC, memo, useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdUpdate } from "react-icons/md";
import useSWR from "swr";

export interface PostViewProps extends Omit<BlogPost, "id"> {
	showUserInteractions?: boolean;
}

const PostViewComponent: FC<PostViewProps> = ({ metadata, content }) => {
	const { data, error } = useSWR(`/api/users/read?id=${metadata.authorId}`, (...args) =>
		fetch(...args).then(res => res.json())
	);
	const [author, setAuthor] = useState<User>();

	const [contentToHTML, setContentToHTML] = useState("");

	useEffect(() => {
		data && !error && setAuthor(data.user);
		!data && error && console.error(error);
	}, [data, error]);

	useEffect(() => {
		const htmlString = generateHTML(content, [
			StarterKit,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Link,
			Underline,
		]);
		setContentToHTML(htmlString);
	}, [content]);

	return (
		<section className="flex flex-col-reverse justify-center w-full h-full gap-10 md:flex-row">
			<article className="flex justify-center max-w-2xl w-full">
				<div
					className="prose max-w-full"
					dangerouslySetInnerHTML={{ __html: contentToHTML }}
				></div>
			</article>
			<aside className="flex flex-row justify-center items-center gap-4 md:flex-col md:justify-start md:gap-0">
				<div>
					<Image
						src={author?.avatarUrl || "/usuario-padrao.webp"}
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
				</div>
			</aside>
		</section>
	);
};

export const PostView = memo(PostViewComponent);
