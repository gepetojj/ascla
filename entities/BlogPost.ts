import type { JSONContent } from "@tiptap/react";

import type { User } from "entities/User";

/**
 * Metadados de uma postagem.
 *
 * @see {@link BlogPost}
 */
export interface BlogPostMetadata {
	/** Url personalizada da postagem. */
	urlId: string;
	/** Timestamp de criação da postagem. */
	createdAt: number;
	/** Timestamp de atualização da postagem. */
	updatedAt: number;
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
	thumbnailUrl?: string;
	/** Conteúdo da postagem. */
	content: JSONContent;
}

/** Estrutura dos dados que podem ser atualizados em uma postagem. */
export interface UpdatableBlogPost {
	metadata: BlogPost["metadata"];
	title?: BlogPost["title"];
	description?: BlogPost["description"];
	thumbnailUrl?: BlogPost["thumbnailUrl"];
	content?: BlogPost["content"];
}
