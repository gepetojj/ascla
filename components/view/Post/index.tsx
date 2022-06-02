import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import type { BlogPost } from "entities/BlogPost";
import React, { FC, memo, useEffect, useState } from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

export interface PostViewProps extends Omit<BlogPost, "id"> {
	showUserInteractions?: boolean;
}

const PostViewComponent: FC<PostViewProps> = ({
	metadata,
	title,
	description,
	content,
	showUserInteractions,
}) => {
	const [contentToHTML, setContentToHTML] = useState("");

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
		<section className="flex justify-between w-full h-full p-6">
			<article className="flex flex-col w-full">
				<h1 className="text-3xl font-bold mb-2 truncate">{title}</h1>
				<span className="text-sm text-grey-800 italic break-words">{description}</span>
				<hr className="my-4 text-grey-700 rounded-sm" />
				<div
					className="prose max-w-full"
					dangerouslySetInnerHTML={{ __html: contentToHTML }}
				></div>
			</article>
			<aside className="flex flex-col h-fit w-60 ml-4">
				<div className="bg-blue-grey-50 rounded-sm p-4">
					<div className="flex flex-col w-full">
						<h2 className="text-center text-xl font-semibold">Autor</h2>
						<span className="italic truncate">{metadata.authorId}</span>
					</div>
					<div className="flex flex-col w-full text-center mt-2">
						<h2 className="text-xl font-semibold">Postado em</h2>
						<span className="italic truncate">
							{new Date(metadata.createdAt).toLocaleDateString()}
						</span>
					</div>
					{metadata.updatedAt > 0 && (
						<div className="flex flex-col w-full text-center mt-2">
							<h2 className="text-xl font-semibold">Atualizado em</h2>
							<span className="italic truncate">
								{new Date(metadata.updatedAt).toLocaleDateString()}
							</span>
						</div>
					)}
				</div>
				{showUserInteractions && (
					<div className="flex justify-between items-center bg-blue-grey-50 rounded-sm p-4 mt-4">
						<div className="flex justify-center items-center w-1/2">
							<AiOutlineLike className="text-xl cursor-pointer" />
							<span className="ml-2">0</span>
						</div>
						<div className="flex justify-center items-center w-1/2">
							<AiOutlineDislike className="text-xl cursor-pointer" />
							<span className="ml-2">0</span>
						</div>
					</div>
				)}
			</aside>
		</section>
	);
};

export const PostView = memo(PostViewComponent);
