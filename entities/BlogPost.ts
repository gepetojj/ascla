import type { JSONContent } from "@tiptap/core";

import { Academic } from "./Academic";
import type { DefaultMetadata } from "./DefaultMetadata";
import type { User } from "./User";

/**
 * Metadados de uma postagem.
 *
 * @see {@link BlogPost}
 */
export interface BlogPostMetadata extends DefaultMetadata {
	/** ID do usuário autor da postagem. */
	authorId: User["id"];
}

export interface BlogPostWithAuthorMetadata extends DefaultMetadata {
	/** Objeto do autor, podendo ser como usuário ou como acadêmico. */
	authorId: User["id"];
	author?: User | Academic;
}

/**
 * Estrutura dos dados de uma postagem.
 */
export interface BlogPost<WithAuthor = false> {
	/** ID da postagem. */
	id: string;
	/** Metadados da postagem. */
	metadata: WithAuthor extends true ? BlogPostWithAuthorMetadata : BlogPostMetadata;
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
export type UpdatableBlogPost = Partial<Omit<BlogPost, "id">> & {
	metadata: BlogPostMetadata;
};
