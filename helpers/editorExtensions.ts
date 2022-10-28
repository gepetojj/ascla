import type { Extensions } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";

import { Video } from "./videoExtension";

export const editorExtensions: Extensions = [
	StarterKit,
	TextAlign.configure({
		types: ["heading", "paragraph"],
	}),
	Link.configure({
		validate: href => /^https?:\/\//.test(href),
	}),
	Underline,
	Image,
	Video,
	Youtube,
];
