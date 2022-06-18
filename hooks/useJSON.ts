import { generateHTML, JSONContent } from "@tiptap/react";

import { editorExtensions } from "helpers/editorExtensions";
import { useEffect, useState } from "react";

/**
 * Transforma o JSON fornecido em HTML no formato de string.
 *
 * @param {JSONContent} json JSON que será transformado
 * @returns {string} HTML em formato de string
 */
export const useJSON = (json: JSONContent): string => {
	const [html, setHTML] = useState("");

	useEffect(() => {
		const htmlString = generateHTML(json, editorExtensions);
		setHTML(htmlString);
	}, [json]);

	return html;
};
