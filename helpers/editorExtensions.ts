import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import type { Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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
];
