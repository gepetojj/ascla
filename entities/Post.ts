import type { JSONContent } from "@tiptap/core";

import { Academic } from "./Academic";
import type { DefaultMetadata } from "./DefaultMetadata";
import type { User } from "./User";

/**
 * Metadados de uma postagem.
 *
 * @see {@link Post}
 */
export interface PostMetadata extends DefaultMetadata {
	/** ID do usuário autor da postagem. */
	authorId: User["id"];
}

export interface PostWithAuthorMetadata extends DefaultMetadata {
	/** Objeto do autor, podendo ser como usuário ou como acadêmico. */
	authorId: User["id"];
	author?: User | Academic;
}

/**
 * Estrutura dos dados de uma postagem.
 */
export interface Post<WithAuthor = false> {
	/** ID da postagem. */
	id: string;
	/** Metadados da postagem. */
	metadata: WithAuthor extends true ? PostWithAuthorMetadata : PostMetadata;
	/** Título da postagem. */
	title: string;
	/** Descrição da postagem. */
	description: string;
	/** Link da imagem da postagem. */
	thumbnailUrl: string;
	/** Conteúdo da postagem. */
	content: JSONContent;
}

/** Estrutura dos dados que podem ser atualizados em uma postagem. */
export interface UpdatablePost {
	"metadata.updatedAt": number;
	title?: string;
	description?: string;
	content?: JSONContent;
	thumbnailUrl?: string;
}
