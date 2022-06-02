import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import type { Patron } from "entities/Patron";
import React, { FC, memo, useEffect, useState } from "react";

export type PatronViewProps = Omit<Patron, "id">;

const PatronViewComponent: FC<PatronViewProps> = ({ metadata, name, bio }) => {
	const [bioToHTML, setBioToHTML] = useState("");

	useEffect(() => {
		const htmlString = generateHTML(bio, [
			StarterKit,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Link,
			Underline,
		]);
		setBioToHTML(htmlString);
	}, [bio]);

	return (
		<section className="flex justify-between w-full h-full p-6">
			<aside className="flex flex-col h-fit w-60 mr-6">
				<div className="bg-blue-grey-50 rounded-sm p-4">
					<div className="flex flex-col w-full text-center">
						<span className="italic truncate">Imagem do patrono</span>
					</div>
					<div className="flex flex-col w-full text-center mt-2">
						<h2 className="text-xl font-semibold">Cadeira</h2>
						<span className="italic truncate">Nº</span>
					</div>
					<div className="flex flex-col w-full mt-2">
						<h2 className="text-center text-xl font-semibold">Acadêmico</h2>
						<span className="italic truncate">{metadata.academicId}</span>
					</div>
				</div>
			</aside>
			<article className="flex flex-col w-full">
				<h1 className="text-3xl font-bold mb-2 truncate">{name}</h1>
				<hr className="my-2 text-grey-700 rounded-sm" />
				<div
					className="prose max-w-full"
					dangerouslySetInnerHTML={{ __html: bioToHTML }}
				></div>
			</article>
		</section>
	);
};

export const PatronView = memo(PatronViewComponent);
