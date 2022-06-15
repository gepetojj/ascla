import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { generateHTML, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useEffect, useState } from "react";

export const useJSON = (json: JSONContent): string => {
	const [html, setHTML] = useState("");

	useEffect(() => {
		const htmlString = generateHTML(json, [
			StarterKit,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Link,
			Underline,
		]);
		setHTML(htmlString);
	}, [json]);

	return html;
};
