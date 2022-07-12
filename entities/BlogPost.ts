import type { JSONContent } from "@tiptap/core";

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

/**
 * Estrutura dos dados de uma postagem.
 */
export interface BlogPost {
	/** ID da postagem. */
	id: string;
	/** Metadados da postagem. */
	metadata: BlogPostMetadata;
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
